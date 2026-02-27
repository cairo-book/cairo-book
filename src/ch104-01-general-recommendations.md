# General Recommendations

We've been focusing so far on learning how to write Cairo Code, which is the
minimum for your programs to come to life; but writing _secure_ code is just as
important. This chapter distills was written inspired from a large corpus of
real Cairo/Starknet audits compiled into concrete instructions you can use while
coding, testing, and reviewing your contracts.

We'll focus on:

- Access control and upgrades
- Safe ERC20 token integrations
- Cairo-specific pitfalls that could lead to vulnerabilities
- Cross-domain/bridging safety
- Economic/DoS must-knowns on Starknet

## Access Control, Upgrades & Initializers

The most common critical findings in Starknet audits are still “who can call
this?” and “can this be (re)initialized?” issues. Cairo has great simple
building blocks whose logic you should reuse to focus on the core security
aspects of your program.

### Own your privileged paths

Always make sure that upgrades can only be done by authorized roles. If a
non-authorized user can upgrade your contract, it can replace the class with
anything and get full control over the contract. The same applies for
pause/resume functions, bridge handlers (who can call this contract from L1),
and meta-execution. All these critical functions should be guarded using the
OwnableComponent from OpenZeppelin.

```cairo, noplayground
// components
component!(path: OwnableComponent, storage: ownable);
component!(path: UpgradeableComponent, storage: upgradeable, event: UpgradeableEvent);

#[abi(embed_v0)]
impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;
impl InternalUpgradeableImpl = UpgradeableComponent::InternalImpl<ContractState>;

#[event]
fn Upgraded(new_class_hash: felt252) {}

fn upgrade(ref self: ContractState, new_class_hash: ClassHash) {
    self.ownable.assert_only_owner();
    self.upgradeable._upgrade(new_class_hash);
    Upgraded(new_class_hash); // emit explicit upgrade event
}
```

**Why emit events?** Incident response and indexers depend on them. Emit for
upgrades, configuration changes, pausing, liquidations, and any privileged
action; include addresses (e.g., token) to remove ambiguity.

### Initializers should only be called once

A frequent vulnerability vector is a publicly exposed initializer that can be
called post-deploy. The purpose of an initializer is to de-couple the deployment
and the initialization of the contract. However, if the initializer can be
called multiple times, it can have unexpected consequences. Make sure the
behavior is idempotent.

```cairo, noplayground
#[storage]
struct Storage {
    _initialized: u8,
    // ...
}

fn initializer(ref self: ContractState, owner: ContractAddress) {
    assert!(self._initialized.read() == 0, "ALREADY_INIT");
    self._initialized.write(1);
    self.ownable.initialize(owner);
    // init the rest…
}
```

> Rule: if it _must_ be external during deployment, make sure it can only be
> called once; if it doesn't need to be external, keep it internal.

## Token Integrations

### Always check boolean returns

While the OpenZeppelin ERC20 implementation reverts on failure, it is not all
ERC-20 implementations that do. Some might return `false` instead, without
panicking. The `transfer` and `transfer_from` return boolean flags; verify them
to ensure the transfers were successful.

### CamelCase / snake_case dual interfaces

Most ERC20 tokens on starknet should use the `snake_case` naming style. However,
for legacy reasons, some old ERC20 tokens have `camelCase` entrypoints, which
might cause issues if your contracts calls them expecting to find `snake_case`.
Handling both naming styles is cumbersome; but you should at least ensure that
most tokens you'll be interacting with use the `snake_case` naming style, or
adapt your contracts.

## Cairo-Specific Pitfalls

The Cairo language itself does not have very complicated semantics that could
introduce vulnerabilities, but there are some regular programming patterns that
could lead to unwanted behavior.

### Operator precedence in expressions

In Cairo, `&&` has higher precedence than `||`. Make sure that combined
expressions are properly parenthesized to force precedence between operators.

```cairo, noplayground
// ❌ buggy: ctx.coll_ok and ctx.debt_ok are only required in Recovery
assert!(
    mode == Mode::None || mode == Mode::Recovery && ctx.coll_ok && ctx.debt_ok,
    "EMERGENCY_MODE"
);

// ✅ fixed
assert!(
    (mode == Mode::None || mode == Mode::Recovery) && (ctx.coll_ok && ctx.debt_ok),
    "EMERGENCY_MODE"
);
```

### Unsigned loop underflow

Using a `u32` for a loop counter could lead to an underflow panic if that
counter is decremented past 0. If the counter is supposed to handle negative
values, use a `i32` instead.

```cairo, noplayground
// ✅ prefer signed counters or explicit break
let mut i: i32 = (n.try_into().unwrap()) - 1;
while i >= 0 { // This would never trigger if `i` was a u32.
    // ...
    i -= 1;
}
```

### Bit-packing into `felt252`

Packing multiple fields into one `felt252` is great for optimizations, but it is
also common and dangerous without tight bounds. Make sure to check the bounds of
the fields before packing them into a `felt252`. Notably, the sum of the size of
the values packed should not exceed 251 bits.

```cairo, noplayground
fn pack_order(book_id: u256, tick_u24: u256, index_u40: u256) -> felt252 {
    // width checks
    assert!(book_id < (1_u256 * POW_2_187), "BOOK_OVER");
    assert!(tick_u24 < (1_u256 * POW_2_24),  "TICK_OVER");
    assert!(index_u40 < (1_u256 * POW_2_40), "INDEX_OVER");

    let packed: u256 =
        (book_id * POW_2_64) + (tick_u24 * POW_2_40) + index_u40;
    packed.try_into().expect("PACK_OVERFLOW")
}
```

<span class="caption"> A bit packing that could fail if the values are too big.
</span>

### `deploy_syscall(deploy_from_zero=true)` collisions

Deterministic deployment from zero enables could lead to collisions if two
contracts are attempted to be deployed with the same calldata. Make sure to set
`deploy_from_zero` to `false` unless you are sure you want to deploy from zero.

### Don’t check `get_caller_address().is_zero()`

Inherited from Solidity are zero-address checks. On Starknet,
`get_caller_address()` is never the zero address. Thus, these checks are
useless.

## Cross-Domain / Bridging Safety

L1-L2 interactions are specific to how Starknet works, and can be a source of
mistakes.

### L1 handler must validate the caller address

The `#[l1_handler]` attribute marks an entrypoint as callable from a contract on
L1. In most cases, you will want to ensure that the source of that call is a
trusted L1 contract - and as such, you should validate the caller address.

```cairo, noplayground
#[l1_handler]
fn handle_deposit(
    ref self: ContractState,
    from_address: ContractAddress,
    account: ContractAddress,
    amount: u256
) {
    let l1_bridge = self._l1_bridge.read();
    assert!(!l1_bridge.is_zero(), 'UNINIT_BRIDGE');
    assert!(from_address == l1_bridge, 'ONLY_L1_BRIDGE');
    // credit account…
}
```

## Economic/DoS & Griefing

### Unbounded loops

User-controlled iterations (claims, batch withdrawals, order sweeps) can exceed
the Starknet steps limit. Make sure to cap the number of iterations and/or use a
pagination pattern to split the work into multiple transactions.

Notably, imagine that you are implementing a system in which when called, a
function will iterate over a list of items in storage and process them. If the
list is not bounded, an attacker could increase the amount of items in that
list, such that the function will never terminate as it will reach the execution
step limit of Starknet.

In that case, the contract is bricked: It will not be possible for _anyone_ to
interact with it anymore, as any interaction will trigger the step limit.

To bypass that, you could for example use a pagination pattern, where the
function will process a maximum number of items at a time, and return the next
cursor to the caller. The caller can then call the function again with the next
cursor to process the next batch of items.

```cairo, noplayground
fn claim_withdrawals(ref self: ContractState, start: u64, max: u64) -> u64 {
    let mut i = start;
    let end = core::cmp::min(self.pending_count.read(), start + max);
    while i < end {
        self._process(i);
        i += 1;
    }
    end // next cursor
}
```

# Unit Testing

You've written a smart contract. How do you know it works?

The most direct way is to test individual functions in isolation. That's what
_unit testing_ is: you pick a function, give it some inputs, and check that it
does what you expect. If your `transfer` function should move tokens between
accounts, you write a test that calls it and verifies the balances changed
correctly.

In this section, we'll explore two approaches Cairo gives us for unit testing,
when to use each, and the tools that make testing practical.

## Two Ways to Test a Contract

Cairo offers two approaches to unit testing:

| Approach                        | What You're Testing      | When to Use It             |
| ------------------------------- | ------------------------ | -------------------------- |
| `contract_state_for_testing`    | Internal functions       | Logic not in the ABI       |
| Deploy + dispatcher             | External interface (ABI) | What users actually call   |

Both test a single contract in isolation. The difference is whether you're
testing through the public interface or reaching into the internals.

## Testing Internal Functions

Sometimes the function you want to test isn't in the contract's public
interface. Maybe it's a helper function in a private `impl` block, or it uses
`#[generate_trait]`. You could test it indirectly through public functions, but
that makes tests harder to write and failures harder to diagnose.

Cairo's `contract_state_for_testing` function gives you direct access. It
creates a `ContractState` without actually deploying anything, so you can call
internal functions and inspect storage.

### Example: Testing a Private Setter

Let's say we have a `PizzaFactory` contract with an internal `set_owner`
function that we don't expose publicly:

```cairo,noplayground
{{#rustdoc_include ../listings/ch104-starknet-smart-contracts-security/listing_02_pizza_factory_snfoundry/src/pizza.cairo}}
```

{{#label pizza-factory-unit}}
<span class="caption">Listing
{{#ref pizza-factory-unit}}: A PizzaFactory contract with internal functions</span>

The `InternalTrait` contains `set_owner`, which isn't part of the ABI. To test
it, we import the trait and call it directly on a test state:

```cairo,noplayground
{{#rustdoc_include ../listings/ch104-starknet-smart-contracts-security/listing_02_pizza_factory_snfoundry/src/tests/foundry_test.cairo:test_internals}}
```

{{#label test-unit-internal}}

<span class="caption">Listing
{{#ref test-unit-internal}}: Testing internal functions with contract_state_for_testing</span>

We import `InternalTrait` to access `set_owner` and `StoragePointerReadAccess`
to read storage. Since there's no deployment, the test runs instantly.

## Testing the External Interface

Most of your tests will deploy the contract and interact through its public
interface. This is closer to how users will actually interact with your
contract, which means these tests catch real-world bugs.

### The Deploy-and-Test Pattern

The pattern is straightforward: declare the contract class, deploy it with
constructor arguments, and interact through a dispatcher.

```cairo,noplayground
{{#rustdoc_include ../listings/ch104-starknet-smart-contracts-security/listing_02_pizza_factory_snfoundry/src/tests/foundry_test.cairo:deployment}}
```

{{#label unit-deployment}}

<span class="caption">Listing {{#ref unit-deployment}}:
Deploying a contract for unit testing</span>

This helper function handles the boilerplate: declaring, preparing calldata,
deploying, and returning a dispatcher you can use in tests.

## Testing with Cheatcodes

Here's where things get interesting. Real smart contracts don't run in a
vacuum. They check who's calling them (`get_caller_address`), what time it is
(`get_block_timestamp`), and other context that's hard to control in tests.

Starknet Foundry provides _cheatcodes_ that let you manipulate this context.
Think of them as ways to set up the exact scenario you want to test.

### Mocking the Caller

Access control is everywhere in smart contracts. An `only_owner` function needs
to know who's calling it. In tests, you control this with
`start_cheat_caller_address`:

```cairo,noplayground
{{#rustdoc_include ../listings/ch104-starknet-smart-contracts-security/listing_02_pizza_factory_snfoundry/src/tests/foundry_test.cairo:test_owner}}
```

{{#label unit-cheat-caller}}

<span class="caption">Listing
{{#ref unit-cheat-caller}}: Testing access control by mocking the caller</span>

We deploy the contract, then use `start_cheat_caller_address` to impersonate
the owner. Now `get_caller_address()` returns the owner's address for all calls
to this contract.

> Test both paths: the happy path where an authorized caller succeeds, and the
> rejection path where an unauthorized caller fails. Many security bugs come
> from forgetting to check permissions in some code path.

### Verifying Events

When your contract emits events, off-chain systems like indexers and frontends
depend on them being correct. Use `spy_events` to capture and check them:

```cairo,noplayground
{{#rustdoc_include ../listings/ch104-starknet-smart-contracts-security/listing_02_pizza_factory_snfoundry/src/tests/foundry_test.cairo:test_make_pizza}}
```

{{#label unit-spy-events}}

<span class="caption">Listing {{#ref unit-spy-events}}:
Capturing and verifying events</span>

Create the spy before the action that emits events, then use
`spy.assert_emitted` to check what was emitted.

### Reading Storage Directly

Sometimes you need to verify storage values that don't have public getters. The
`load` function reads raw storage:

```cairo,noplayground
{{#rustdoc_include ../listings/ch104-starknet-smart-contracts-security/listing_02_pizza_factory_snfoundry/src/tests/foundry_test.cairo:test_constructor}}
```

{{#label unit-load-storage}}

<span class="caption">Listing
{{#ref unit-load-storage}}: Reading storage directly to verify initial state</span>

Pass the contract address, a storage key (use `selector!("variable_name")`),
and how many felts to read.

## Cheatcode Reference

Here are the cheatcodes you'll use most often:

| Cheatcode                       | What It Does               | Common Use Case             |
| ------------------------------- | -------------------------- | --------------------------- |
| `start_cheat_caller_address`    | Mock `get_caller_address`  | Testing access control      |
| `stop_cheat_caller_address`     | Stop mocking caller        | Reset after test            |
| `start_cheat_block_timestamp`   | Mock block timestamp       | Time-dependent logic        |
| `start_cheat_block_number`      | Mock block number          | Block-dependent logic       |
| `spy_events`                    | Capture emitted events     | Verify event data           |
| `load`                          | Read raw storage           | Verify internal state       |
| `store`                         | Write raw storage          | Set up test preconditions   |

For the full list, see the [Starknet Foundry cheatcode
documentation](https://foundry-rs.github.io/starknet-foundry/appendix/cheatcodes.html).

## Choosing Your Approach

| What You're Testing              | Use                         |
| -------------------------------- | --------------------------- |
| Internal helper function         | `contract_state_for_testing` |
| Pure calculation logic           | `contract_state_for_testing` |
| Access control                   | Deploy + cheatcodes          |
| Events                           | Deploy + spy_events          |
| Constructor logic                | Deploy + assertions          |
| Public function behavior         | Deploy + dispatcher          |

One thing to know: you can't mix approaches in the same test. If you deploy and
get a dispatcher, use the dispatcher. If you use `contract_state_for_testing`,
work with that state object directly.

## Writing Good Tests

A few patterns make tests easier to write and maintain:

**One behavior per test.** When a test fails, you want to know exactly what
broke. A test named `test_transfer` that checks balances, events, and error
cases is hard to debug. Split it:

```cairo,noplayground
// Each test checks one thing
#[test]
fn test_transfer_updates_balances() { /* ... */ }

#[test]
fn test_transfer_emits_event() { /* ... */ }

// Not this - too much in one test
#[test]
fn test_transfer() {
    // Checks balances AND events AND error cases...
}
```

**Name tests so failures tell you what's wrong.** Use
`test_<function>_<expected_behavior>`:

- `test_transfer_updates_balances`
- `test_transfer_fails_on_insufficient_balance`
- `test_change_owner_requires_current_owner`

**Clean up cheatcodes.** Always pair `start_cheat_*` with the corresponding
`stop_cheat_*`:

```cairo,noplayground
start_cheat_caller_address(address, owner());
// ... test logic ...
stop_cheat_caller_address(address);
```

**Test edge cases.** Unit tests are perfect for boundary conditions: zero
values, maximum values like `u256::MAX`, empty arrays, and off-by-one
scenarios.

## When Unit Tests Aren't Enough

Unit tests verify single-contract behavior. When your contract talks to other
contracts, you'll want [integration testing](./ch104-02-02-integration-testing.md)
to test those interactions.

For testing that properties hold across many random inputs, see [property-based
testing](./ch104-02-03-fuzz-testing.md). And when you need to test against real
deployed contracts like AMMs or lending protocols, [fork
testing](./ch104-02-04-fork-testing.md) lets you do that.

## Summary

Unit testing in Cairo means testing one contract at a time. You have two
approaches:

- **`contract_state_for_testing`** for internal functions: fast, no deployment,
  direct access to contract state.

- **Deploy + dispatcher + cheatcodes** for the public interface: tests what
  users actually experience, with tools to control caller identity, timestamps,
  and more.

Start with the public interface tests. They catch more real bugs. Reach for
`contract_state_for_testing` when you have internal logic that's worth testing
directly.

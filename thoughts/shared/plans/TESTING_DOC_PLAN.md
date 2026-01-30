# Testing Documentation Improvement Plan

**Goal:** Teach developers *how to think about* testing Cairo contracts and *why* certain patterns matter. Not a reference manual - that's what Starknet Foundry docs are for.

**Philosophy:** The Cairo Book teaches concepts and engineering practices. For detailed API references, link to Starknet Foundry documentation.

---

## 1. Current Coverage Assessment

### Well Covered
- Basic test anatomy (`#[test]`, assertions) - ch10-01
- `#[should_panic]` with expected messages - ch10-01
- Component testing (2 patterns) - ch103-02-03
- Contract deployment/dispatcher testing - ch104-02
- Event spying - ch104-02
- `contract_state_for_testing` - ch104-02 (just improved)
- L1-L2 messaging concepts - ch103-04

### Missing: Testing Philosophy & Advanced Patterns
- **Why** fuzzing matters (not just how)
- **When** to use fork testing
- Writing good invariants
- Test isolation principles
- Integration testing patterns

---

## 2. Proposed Additions

### 2.1 Property-Based Testing with Fuzzing (NEW SECTION)

**Location:** Add to ch104-02 or create ch104-02-01-fuzz-testing.md

**Teaching Goals:**
1. Explain *why* example-based tests are insufficient
2. Teach how to think in terms of **properties** and **invariants**
3. Show practical patterns for smart contract invariants

**Content Outline:**

#### Why Fuzz Testing?

> Example-based tests check specific scenarios you thought of. Fuzzing checks scenarios you didn't think of.

Real-world bug example: A transfer function that works for amounts 1-1000 but overflows at edge cases. Manual tests pass, fuzzer finds the bug.

#### Thinking in Properties

Properties are statements that should *always* be true:

| Property Type | Example |
|--------------|---------|
| **Invariant** | Total supply never changes after transfer |
| **Round-trip** | `decode(encode(x)) == x` |
| **Symmetry** | `a + b == b + a` |
| **Idempotence** | `pause(); pause();` same as `pause();` |

#### Writing Good Invariants for Smart Contracts

```cairo
#[test]
#[fuzzer(runs: 256)]
fn test_transfer_preserves_total_supply(sender: ContractAddress, amount: u256) {
    // Setup
    let mut state = ERC20::contract_state_for_testing();
    let initial_supply = state.total_supply.read();

    // Action (may fail for invalid inputs - that's ok)
    // ... transfer logic ...

    // Invariant: total supply unchanged
    assert_eq!(state.total_supply.read(), initial_supply);
}
```

#### Common Smart Contract Invariants to Test

1. **Balance invariants**: Sum of all balances == total supply
2. **Access control**: Only owner can call admin functions (for all callers)
3. **State machine**: Invalid state transitions revert
4. **Arithmetic safety**: No overflow/underflow for any inputs

#### Handling Invalid Inputs

```cairo
#[test]
#[fuzzer]
fn test_withdraw(amount: u256) {
    // Skip invalid inputs rather than expecting failure
    if amount > MAX_BALANCE {
        return;
    }
    // Test the valid case
}
```

**Listing needed:** `listing_fuzz_erc20_invariants/` - Real ERC20 property tests

---

### 2.2 Fork Testing for Integration (NEW SECTION)

**Location:** Add to ch104-02 or create ch104-02-02-fork-testing.md

**Teaching Goals:**
1. Explain *when* fork testing is valuable
2. Show how it simplifies integration testing
3. Warn about pitfalls (non-determinism, RPC costs)

**Content Outline:**

#### When to Use Fork Testing

Fork testing shines when:
- Testing integration with **deployed contracts** (DEXs, oracles, bridges)
- Reproducing **mainnet bugs** in a controlled environment
- Validating **upgrade paths** against real state

Don't use fork testing for:
- Unit tests (too slow, non-deterministic)
- Testing your own contracts in isolation

#### Example: Testing Against a Real DEX

```cairo
#[test]
#[fork(url: "https://starknet-mainnet.public.blastapi.io", block_number: 500000)]
fn test_swap_integration() {
    // This test runs against real mainnet state at block 500000
    let jediswap = IJediSwapDispatcher { contract_address: JEDISWAP_ADDRESS };

    // Interact with real deployed contract
    let quote = jediswap.get_amounts_out(amount_in, path);

    // Your contract integrates with it
    my_contract.execute_swap(amount_in, min_out);
}
```

#### Block Pinning: Determinism vs Freshness

| Strategy | Deterministic | Cached | Use Case |
|----------|--------------|--------|----------|
| `block_number: 123456` | ✅ | ✅ | CI, reproducible tests |
| `block_hash: 0x...` | ✅ | ✅ | Pinning specific state |
| `block_tag: "latest"` | ❌ | ❌ | Manual exploration only |

**Listing needed:** `listing_fork_dex_integration/` - Testing against real DEX

---

### 2.3 Testing L1 Handlers (ADD TO EXISTING)

**Location:** Add a "Testing" subsection to ch103-04-L1-L2-messaging.md

**Teaching Goal:** Show how to test L1 handler functions without actual L1 infrastructure.

**Content to Add:**

```cairo
#[test]
fn test_deposit_from_l1() {
    let contract_address = deploy_contract();

    // Simulate L1 message arrival
    snforge_std::l1_handler(
        contract_address,
        selector!("handle_deposit"),
        from_address: L1_BRIDGE_ADDRESS,
        payload: array![user.into(), amount.low.into(), amount.high.into()]
    );

    // Verify the deposit was processed
    let balance = IERC20Dispatcher { contract_address }.balance_of(user);
    assert_eq!(balance, amount);
}
```

**Key points to teach:**
- `l1_handler()` simulates sequencer executing L1HandlerTransaction
- Always verify `from_address` in your handler (security!)
- Test both valid and invalid `from_address` scenarios

---

## 3. What NOT to Add

Per feedback, explicitly **exclude**:

| Topic | Reason |
|-------|--------|
| Cheat code reference | Covered by [Starknet Foundry docs](https://foundry-rs.github.io/starknet-foundry/appendix/cheatcodes.html) |
| Exhaustive fuzzer options | Reference material, not teaching |
| All fork configuration options | Link to snforge docs instead |
| Detailed `spy_messages_to_l1` API | Already implied by L1-L2 chapter |

**Instead:** Link to Starknet Foundry docs for detailed API references.

---

## 4. Implementation Plan

### Phase 1: Fuzzing Section
1. Write ch104-02-01-fuzz-testing.md
2. Create `listing_fuzz_erc20_invariants/` with meaningful property tests
3. Focus on *why* and *how to think*, not feature enumeration

### Phase 2: Fork Testing Section
1. Write ch104-02-02-fork-testing.md
2. Create `listing_fork_dex_integration/`
3. Emphasize use cases and trade-offs

### Phase 3: L1 Handler Testing
1. Add "Testing L1 Handlers" subsection to ch103-04-L1-L2-messaging.md
2. Show `l1_handler()` usage with security considerations

### Phase 4: Polish
1. Update SUMMARY.md with new sections
2. Add cross-references between chapters
3. Add "For detailed API reference, see Starknet Foundry docs" links

---

## 5. Success Criteria

After reading the updated docs, a developer should:

- [ ] Understand *why* property-based testing catches bugs that example tests miss
- [ ] Be able to identify invariants in their own contracts
- [ ] Know *when* to use fork testing vs unit testing
- [ ] Be able to test L1 handler functions
- [ ] Know where to find detailed API references (snforge docs)

---

## 6. Listings Summary

| Listing | Purpose |
|---------|---------|
| `listing_fuzz_erc20_invariants/` | Property-based testing patterns |
| `listing_fork_dex_integration/` | Fork testing real DEX |
| (existing L1-L2 listing) | Add test examples |

---

## Appendix: Reference Links (for readers, not content to copy)

- [Starknet Foundry Cheatcodes](https://foundry-rs.github.io/starknet-foundry/appendix/cheatcodes.html)
- [Fuzz Testing Reference](https://foundry-rs.github.io/starknet-foundry/snforge-advanced-features/fuzz-testing.html)
- [Fork Testing Reference](https://foundry-rs.github.io/starknet-foundry/snforge-advanced-features/fork-testing.html)

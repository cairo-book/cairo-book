# docs: add property-based testing with fuzzing section

**Type:** Feature
**Status:** Open
**Parent:** #001
**Location:** ch104-02 (Testing Smart Contracts) — new subsection or page

---

## Why

Example-based tests only check scenarios the developer thought of. This leaves contracts vulnerable to edge cases, overflow conditions, and unexpected input combinations that slip through manual test cases.

Property-based testing (fuzzing) addresses this by:
- Automatically generating many inputs to explore the state space
- Finding edge cases humans wouldn't think to test
- Forcing developers to articulate what *must always be true* about their contracts

Smart contracts handle real value and are immutable once deployed—making thorough testing especially critical. Developers need guidance on **how to think in properties and invariants**, not just how to configure a fuzzer.

---

## What

Create a new section that teaches property-based testing for Cairo smart contracts. The content should cover:

### Conceptual Foundation
- The limitation of example-based tests
- What properties and invariants are
- Common property types: invariants, round-trips, symmetry, idempotence

### Smart Contract Invariants
- Balance invariants (sum of balances == total supply)
- Access control invariants (admin functions only callable by authorized users)
- State machine invariants (invalid state transitions revert)
- Arithmetic safety (no overflow/underflow for any inputs)

### Practical Patterns
- Writing fuzz tests with `#[fuzzer]` attribute
- Handling invalid inputs gracefully (skip vs expect failure)
- Combining fuzzing with `contract_state_for_testing` for unit-level property tests

### Example Listing
A complete ERC20 property test suite demonstrating real invariants—not toy examples.

---

## How

### Content Approach

Focus on the *why* and *how to think* rather than exhaustive feature coverage:
- Use a real-world example (ERC20 transfer invariant) to motivate the concepts
- Show the thought process for identifying properties in existing code
- Keep fuzzer configuration minimal—link to snforge docs for options

### File Structure

Option A: Add as subsection within `ch104-02-testing-smart-contracts.md`
Option B: Create new page `ch104-02-01-fuzz-testing.md` linked from ch104-02

The implementer should choose based on content length and flow with existing material.

### Listing Requirements

Create a new listing (suggested: `listings/ch104-starknet-smart-contracts-security/listing_fuzz_erc20_invariants/`) with:
- A minimal ERC20 implementation (or use existing)
- Property tests demonstrating:
  - Transfer preserves total supply
  - Access control holds for random callers
  - Balance consistency across operations

### Links and References

End the section with explicit links to:
- Starknet Foundry fuzz testing documentation (for detailed options)
- The existing ch10 testing chapter (for basic test anatomy)

---

## Acceptance Criteria

- [ ] Reader understands why fuzzing catches bugs that example tests miss
- [ ] Reader can identify invariants in their own contracts
- [ ] At least one complete, runnable listing demonstrates the concepts
- [ ] Links to snforge docs for detailed configuration

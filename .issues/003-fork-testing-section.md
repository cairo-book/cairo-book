# docs: add fork testing for integration section

**Type:** Feature
**Status:** Open
**Parent:** #001
**Location:** ch104-02 (Testing Smart Contracts) — new subsection or page

---

## Why

Many smart contracts don't operate in isolation—they integrate with DEXs, oracles, bridges, and other deployed protocols. Testing these integrations traditionally requires:
- Mock contracts that may not match real behavior
- Deploying to testnets with slow iteration cycles
- Hoping mainnet behavior matches testnet assumptions

Fork testing solves this by running tests against actual mainnet state. This allows developers to:
- Validate integrations with real deployed contracts
- Reproduce and debug mainnet bugs in a controlled environment
- Test upgrade paths against actual storage state

However, fork testing has trade-offs (speed, RPC costs, potential non-determinism) that developers need to understand to use it appropriately.

---

## What

Create a new section that teaches fork testing for Cairo smart contracts. The content should cover:

### When to Use Fork Testing
Clear guidance on appropriate use cases:
- **Good fit:** Integration with deployed contracts, reproducing mainnet bugs, validating upgrades
- **Poor fit:** Unit tests (too slow), testing isolated contract logic

### Block Pinning Strategies
Explain the trade-offs between different pinning approaches:
- `block_number` — Deterministic and cacheable, best for CI
- `block_hash` — Pins specific state
- `block_tag: "latest"` — Non-deterministic, manual exploration only

### Practical Example
A realistic example testing integration with a deployed protocol (DEX, oracle, or similar). The example should demonstrate:
- Forking mainnet at a specific block
- Interacting with a real deployed contract
- Asserting on actual protocol behavior

### Pitfalls and Best Practices
- RPC rate limits and costs
- Test flakiness from non-deterministic state
- Cache behavior and when to invalidate

---

## How

### Content Approach

Emphasize *when* to use fork testing, not just *how*. Developers should finish this section knowing:
- Fork testing is a specific tool for specific problems
- It complements, not replaces, unit and property tests
- Determinism requires explicit block pinning

### File Structure

Option A: Add as subsection within `ch104-02-testing-smart-contracts.md`
Option B: Create new page `ch104-02-02-fork-testing.md` linked from ch104-02

The implementer should choose based on content length and flow.

### Listing Requirements

Create a new listing (suggested: `listings/ch104-starknet-smart-contracts-security/listing_fork_dex_integration/`) demonstrating:
- A contract that interacts with an external protocol
- Fork test against mainnet state
- Realistic assertions

Choose a deployed protocol that is:
- Stable and unlikely to change significantly
- Has clear, documentable behavior
- Represents a common integration pattern

### Links and References

End with links to:
- Starknet Foundry fork testing documentation
- RPC provider documentation for rate limits

---

## Acceptance Criteria

- [ ] Reader knows when fork testing adds value vs when it doesn't
- [ ] Reader understands block pinning and determinism trade-offs
- [ ] At least one runnable listing demonstrates a real integration test
- [ ] Links to snforge docs for detailed configuration options

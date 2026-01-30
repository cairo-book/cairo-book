# docs: improve testing documentation with advanced patterns

**Type:** Meta Issue
**Status:** Open
**Related:** #002, #003, #004, #005

---

## Why

The Cairo Book's testing documentation currently covers the basics well—test anatomy, assertions, `#[should_panic]`, component testing, contract deployment, and event spying. However, it lacks guidance on **testing philosophy** and **advanced patterns** that help developers write more robust smart contracts.

Developers need to understand not just *how* to use testing tools, but *why* certain testing strategies matter and *when* to apply them. The goal is to teach developers how to think about testing Cairo contracts—not to duplicate the Starknet Foundry reference documentation.

The current gaps include:
- No coverage of property-based testing and why fuzzing catches bugs that example tests miss
- No guidance on fork testing and when it's appropriate vs unit testing
- No documentation on testing L1 handlers, despite L1-L2 messaging being documented

---

## What

Expand the testing documentation to cover three new areas:

1. **Property-Based Testing with Fuzzing** — Teach developers to think in terms of invariants and properties, not just example inputs. Show common smart contract invariants (balance preservation, access control, state machines).

2. **Fork Testing for Integration** — Explain when fork testing adds value (integration with deployed contracts, reproducing mainnet bugs) and when it doesn't (unit tests). Cover block pinning for determinism.

3. **L1 Handler Testing** — Complete the L1-L2 messaging chapter by showing how to test `#[l1_handler]` functions without actual L1 infrastructure.

**Philosophy:** Focus on teaching concepts and engineering practices. For detailed API references, link to Starknet Foundry documentation rather than duplicating it.

---

## How

### Structure

The new content should fit within the existing book structure:

- **ch104-02** (Testing Smart Contracts): Add fuzzing and fork testing as subsections or linked pages
- **ch103-04** (L1-L2 Messaging): Add a "Testing" subsection for L1 handler testing

### Implementation Sequence

1. Property-based testing section (#002)
2. Fork testing section (#003)
3. L1 handler testing (#004)
4. Cross-references and polish (#005)

### Success Criteria

After reading the updated docs, a developer should:
- Understand why property-based testing catches bugs that example tests miss
- Be able to identify invariants in their own contracts
- Know when to use fork testing vs unit testing
- Be able to test L1 handler functions
- Know where to find detailed API references (snforge docs)

---

## References

- [TESTING_DOC_PLAN.md](../thoughts/shared/plans/TESTING_DOC_PLAN.md) — Full implementation plan
- [Starknet Foundry Cheatcodes](https://foundry-rs.github.io/starknet-foundry/appendix/cheatcodes.html)
- [Fuzz Testing Reference](https://foundry-rs.github.io/starknet-foundry/snforge-advanced-features/fuzz-testing.html)
- [Fork Testing Reference](https://foundry-rs.github.io/starknet-foundry/snforge-advanced-features/fork-testing.html)

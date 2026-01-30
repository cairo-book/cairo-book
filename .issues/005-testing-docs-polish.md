# docs: integrate and polish testing documentation updates

**Type:** Chore
**Status:** Open
**Parent:** #001
**Depends On:** #002, #003, #004

---

## Why

After implementing the new testing sections (#002, #003, #004), the book needs integration work to ensure:
- New content is discoverable through the table of contents
- Related chapters reference each other appropriately
- Readers have clear paths to external references (Starknet Foundry docs)
- The testing story is cohesive across all related chapters

Without this integration pass, the new content may be orphaned or disconnected from the broader testing narrative.

---

## What

Perform a polish pass to integrate the new testing documentation:

### SUMMARY.md Updates
If new pages were created (e.g., `ch104-02-01-fuzz-testing.md`, `ch104-02-02-fork-testing.md`), add them to `src/SUMMARY.md` in the appropriate location under the Security chapter.

### Cross-References Between Chapters
Add appropriate links between related content:
- ch10 (Testing Cairo Programs) → ch104-02 (for smart contract testing)
- ch104-02 → ch10 (for basic test anatomy review)
- ch104-02 fuzzing section → ch103-02-03 (component testing can also use fuzzing)
- ch103-04 → ch104-02 (testing chapter for general testing patterns)

### External Reference Links
Ensure each new section ends with clear links to:
- Starknet Foundry documentation for detailed API references
- Relevant sections users shouldn't duplicate but should know exist

### Consistency Check
Review all testing-related content for:
- Consistent terminology (fuzzing vs property-based testing vs fuzz testing)
- Consistent code style across listings
- Consistent voice and pedagogical approach

### What NOT to Add
Per the original plan, explicitly avoid:
- Cheatcode reference tables (link to snforge docs instead)
- Exhaustive configuration option listings
- Content that duplicates Starknet Foundry documentation

---

## How

### Approach

This is a review and integration task, not a content creation task. The implementer should:

1. **Audit** — Review what was actually implemented in #002, #003, #004
2. **Integrate** — Update SUMMARY.md and add cross-references
3. **Verify** — Build the book and navigate through the testing content to verify discoverability
4. **Clean up** — Fix any inconsistencies found during the audit

### SUMMARY.md Pattern

If new pages were created, follow the existing pattern:
```markdown
## Starknet Smart Contracts Security

- [Starknet Smart Contracts Security](./ch104-00-starknet-smart-contracts-security.md)
  - [General Recommendations](./ch104-01-general-recommendations.md)
  - [Testing Smart Contracts](./ch104-02-testing-smart-contracts.md)
    - [Property-Based Testing](./ch104-02-01-fuzz-testing.md)       # if created
    - [Fork Testing](./ch104-02-02-fork-testing.md)                 # if created
  - [Static Analysis Tools](./ch104-03-static-analysis-tools.md)
```

### Cross-Reference Format

Use the book's existing cross-reference style. Example:
```markdown
For more on property-based testing, see [Property-Based Testing with Fuzzing](./ch104-02-01-fuzz-testing.md).
```

### Verification Steps

- [ ] `mdbook build` completes without errors
- [ ] `mdbook serve` and manually navigate testing content
- [ ] All new pages accessible from SUMMARY.md
- [ ] Cross-links resolve correctly
- [ ] External links to snforge docs work

---

## Acceptance Criteria

- [ ] All new testing content is linked in SUMMARY.md (if applicable)
- [ ] Cross-references connect related testing chapters
- [ ] Each section links to relevant Starknet Foundry documentation
- [ ] Book builds without errors
- [ ] Testing documentation tells a cohesive story across chapters

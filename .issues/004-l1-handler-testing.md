# docs: add testing section to L1-L2 messaging chapter

**Type:** Feature
**Status:** Open
**Parent:** #001
**Location:** ch103-04 (L1-L2 Messaging) — new "Testing L1 Handlers" subsection

---

## Why

The L1-L2 messaging chapter (`ch103-04-L1-L2-messaging.md`) thoroughly explains the messaging mechanism and how to write `#[l1_handler]` functions. However, it provides no guidance on testing these handlers.

Testing L1 handlers is challenging because:
- Messages originate from L1, not from a Starknet account
- The `from_address` verification is critical for security
- Real L1 infrastructure isn't available in test environments

Developers need to know how to:
- Simulate L1 message arrival in tests
- Verify their `from_address` validation works correctly
- Test both happy paths and security-critical rejection paths

This completes the L1-L2 messaging documentation by showing the full development lifecycle.

---

## What

Add a "Testing L1 Handlers" subsection to the existing L1-L2 messaging chapter. The content should cover:

### Simulating L1 Messages
How to use snforge's `l1_handler()` function to simulate the sequencer executing an `L1HandlerTransaction`. Explain what this simulates in terms of the actual Starknet protocol.

### Testing the Happy Path
A complete example showing:
- Deploying the contract
- Calling `l1_handler()` with valid parameters
- Asserting the expected state changes occurred

### Testing Security: from_address Validation
Emphasize that `from_address` verification is security-critical:
- Test that valid `from_address` succeeds
- Test that invalid `from_address` is rejected
- Explain why this matters (prevents unauthorized message injection)

### Payload Serialization in Tests
Brief note on correctly serializing payloads (connecting to the Cairo Serde section already in the chapter).

---

## How

### Content Approach

This should be a focused addition to an existing chapter, not a standalone page. Keep it concise and practical:
- One clear example showing the testing pattern
- Security emphasis on `from_address` validation
- Link to snforge docs for additional `l1_handler` options

### Location

Add as a new subsection within `ch103-04-L1-L2-messaging.md`, likely after the "Sending Messages from Starknet to Ethereum" section and before "Cairo Serde".

Suggested heading: `## Testing L1 Handlers`

### Listing Requirements

Extend the existing L1-L2 messaging listing or create a companion test file that demonstrates:
- `l1_handler()` usage
- Valid message processing
- Rejected message (wrong `from_address`)

The test should use the same contract shown earlier in the chapter for continuity.

### Security Callout

Include a prominent note or callout box emphasizing:
> Always test both valid and invalid `from_address` scenarios. The `from_address` check is your contract's defense against unauthorized message injection from L1.

---

## Acceptance Criteria

- [ ] Reader can test `#[l1_handler]` functions without L1 infrastructure
- [ ] Reader understands `l1_handler()` simulates `L1HandlerTransaction` execution
- [ ] Security importance of `from_address` validation is emphasized
- [ ] Example tests both success and rejection paths
- [ ] Fits naturally within the existing chapter flow

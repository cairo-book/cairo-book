# Property-Based Testing with Fuzzing

Example-based tests verify that your code works for inputs you thought of.
Property-based testing verifies that your code works for inputs you didn't think
of.

When you write `test_transfer(100)`, you're testing one scenario. But what about
`transfer(0)`? What about `transfer(u256::MAX)`? What about the exact balance
amount? Property-based testing with _fuzzing_ automatically generates hundreds
or thousands of inputs to find edge cases that manual testing would miss.

Google's OSS-Fuzz project has found over 25,000 bugs that traditional testing
missed. In the smart contract space, fuzzing has detected hundreds of
vulnerabilities across deployed contracts.

## Thinking in Properties, Not Examples

The shift: instead of "test with this specific input," you ask "does this
property hold for any input?"

### What is a Property?

A _property_ is a statement that should always be true about your code,
regardless of the input. "Total supply never changes during a transfer." "A
user's balance is never negative." "Only the owner can call this function."

### What is an Invariant?

An _invariant_ is a specific type of property: a condition that must hold before
and after every operation. Smart contracts often have important invariants:

| Invariant Type      | Example                                          |
| ------------------- | ------------------------------------------------ |
| Balance Preservation | `totalSupply == sum(all_balances)`              |
| Access Control      | Only owner can call privileged functions         |
| State Machine       | Cannot transition from "closed" to "pending"     |
| Arithmetic Safety   | Balances cannot underflow to create tokens       |

## Example-Based vs Property-Based Testing

Let's compare approaches using a token transfer:

### Example-Based Test

```cairo,noplayground
{{#rustdoc_include ../listings/ch104-starknet-smart-contracts-security/listing_03_fuzz_testing/src/tests/fuzz_tests.cairo:example_test}}
```

This test verifies that transferring 100 tokens works. But it doesn't test
transferring 0 tokens, transferring the exact balance, transferring more than
the balance, transferring to yourself, or large amounts near `u256::MAX`.

### Property-Based Test

Instead of testing one amount, we test a _property_ that should hold for _any_
amount:

```cairo,noplayground
{{#rustdoc_include ../listings/ch104-starknet-smart-contracts-security/listing_03_fuzz_testing/src/tests/fuzz_tests.cairo:fuzz_balance_invariant}}
```

{{#label fuzz-invariant}}

<span class="caption">Listing {{#ref fuzz-invariant}}:
A fuzz test verifying the total supply invariant</span>

The `#[fuzzer(runs: 100, seed: 12345)]` attribute tells Starknet Foundry to run
this test 100 times with different random `amount` values, using seed `12345`
for reproducibility. If any of those 100 runs violates the invariant, the test
fails and reports the failing input.

## Writing Effective Fuzz Tests

### Identify Your Invariants

Before writing fuzz tests, list what must always be true.

For a token contract: total supply is constant (transfers don't create or
destroy tokens), the sum of all balances equals total supply, balance of any
account is non-negative, and only the minter can increase total supply.

For an auction: highest bid only increases, you cannot bid after the auction
ends, and the winner is the highest bidder.

### Design for Fuzzability

Structure tests so the fuzzer can explore interesting cases:

```cairo,noplayground
{{#rustdoc_include ../listings/ch104-starknet-smart-contracts-security/listing_03_fuzz_testing/src/tests/fuzz_tests.cairo:fuzz_balance_conservation}}
```

{{#label fuzz-conservation}}

<span class="caption">Listing
{{#ref fuzz-conservation}}: Testing balance conservation across transfers</span>

We deploy with maximum `u64` supply so any fuzzed `u64` amount is valid. Then we
capture state before and after, and check that the sum of balances stayed the
same.

### Test Round-Trip Properties

Round-trip properties verify that operations can be "undone":

```cairo,noplayground
{{#rustdoc_include ../listings/ch104-starknet-smart-contracts-security/listing_03_fuzz_testing/src/tests/fuzz_tests.cairo:fuzz_roundtrip}}
```

{{#label fuzz-roundtrip}}

<span class="caption">Listing {{#ref fuzz-roundtrip}}:
Testing the transfer round-trip property</span>

## Common Property Patterns

### Invariants (Always True)

```cairo,noplayground
// After ANY operation, this should hold
assert!(contract.total_supply() == expected_total);
```

### Symmetry/Commutativity

```cairo,noplayground
// Order shouldn't matter
let result_ab = calculate(a, b);
let result_ba = calculate(b, a);
assert_eq!(result_ab, result_ba);
```

### Idempotence

```cairo,noplayground
// Doing it twice is same as doing it once
contract.pause();
contract.pause(); // Should not fail or change state
assert!(contract.is_paused());
```

### No Invalid State Transitions

```cairo,noplayground
// From "completed" state, cannot go back to "pending"
#[test]
#[should_panic]
fn test_cannot_transition_completed_to_pending(random_input: felt252) {
    // Setup completed state
    // Attempt transition - should fail
}
```

## Configuring the Fuzzer

Configure fuzzing in your `Scarb.toml`:

```toml
[tool.snforge]
fuzzer_runs = 256      # Number of iterations per fuzz test
fuzzer_seed = 12345    # Seed for reproducibility
```

Or per-test with the attribute:

```cairo,noplayground
#[test]
#[fuzzer(runs: 1000, seed: 42)]
fn test_with_custom_config(x: u128) { /* ... */ }
```

### Choosing Fuzzer Runs

During development, 50-100 runs give you fast iteration. In CI, 256-500 runs
provide good coverage. Before audits, run 1000+ for thorough testing.

## When to Fuzz

Fuzzing pays off most for:

| Scenario              | Why Fuzz                                              |
| --------------------- | ----------------------------------------------------- |
| Financial calculations | Edge cases in math can cause loss of funds           |
| Access control        | Ensure no input bypasses authorization                |
| State machines        | Find invalid state transitions                        |
| Parsing/serialization | Malformed input handling                              |

Fuzzing may be overkill for simple getters with no logic, functions with no
parameters, and already well-tested pure functions.

## Limitations

Starknet Foundry's fuzzer is random, not coverage-guided. It generates random
inputs rather than learning which inputs explore new code paths. This means it
may miss specific edge cases that require precise inputs. More runs generally
find more bugs, but with diminishing returns. Use fuzzing to complement
thoughtful example tests, not replace them.

## Summary

Property-based testing asks "does this property hold for any input?" instead of
"does this pass for the inputs I thought of?" The workflow is straightforward:
identify invariants (what must always be true?), write fuzz tests to check them,
and use more runs in CI than during development.

Combined with unit and integration tests, fuzzing catches edge cases that manual
testing misses. For contracts handling real value, it's worth the setup.

For detailed fuzzer options, see the [Starknet Foundry fuzz testing
documentation](https://foundry-rs.github.io/starknet-foundry/snforge-advanced-features/fuzz-testing.html).

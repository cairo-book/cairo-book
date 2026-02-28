# Integration Testing

An _integration test_ in smart contract development tests **multiple contracts**
interacting together. This is the industry-standard definition: if you're
testing cross-contract calls, composition, or how your contract works with
another contract, it's an integration test.

Integration tests answer one question: do my contracts work together correctly?

## Unit Tests vs Integration Tests

The distinction is about scope, not mechanism:

| Test Type   | Scope              | Example                                  |
| ----------- | ------------------ | ---------------------------------------- |
| Unit test   | Single contract    | Testing your token's `transfer` function |
| Integration | Multiple contracts | Testing your token with a DEX router     |

Both types deploy contracts and use cheatcodes. The difference is whether you're
testing one contract or multiple contracts interacting.

## When to Use Integration Testing

Integration tests make sense when you need to verify cross-contract calls work
correctly, test contract composition (e.g., your protocol using OpenZeppelin
contracts), validate callback patterns, or test complex multi-step flows
involving multiple contracts.

If you're testing a single contract's behavior, use
[unit testing](./ch104-02-01-unit-testing.md) instead.

## Test Organization in Starknet Foundry

Starknet Foundry distinguishes tests by location:

```text
my_project/
├── src/
│   └── lib.cairo           # Your contracts
│   └── tests/              # Unit tests (#[cfg(test)] modules)
└── tests/
    └── integration.cairo   # Integration tests (separate crate)
```

**Unit tests** live in `src/` within `#[cfg(test)]` modules. They have access to
private items in your crate.

**Integration tests** live in a separate `tests/` directory. They're compiled as
a separate crate and can only access your contracts' public interfaces, just
like external users.

This mirrors the Rust testing convention and enforces that integration tests use
contracts through their public APIs.

## Integration Test Structure

A typical integration test deploys multiple contracts and tests their
interactions. Here's a setup function that deploys a Token and a Staking
contract:

```cairo,noplayground
{{#rustdoc_include ../listings/ch104-starknet-smart-contracts-security/listing_04_integration_testing/tests/integration_tests.cairo:setup}}
```

The pattern: deploy multiple contracts, wire them together, then test that
operations spanning contracts work correctly.

## Common Integration Test Scenarios

### Testing Token + Protocol Interactions

Most DeFi protocols interact with tokens. Test the full flow:

```cairo,noplayground
{{#rustdoc_include ../listings/ch104-starknet-smart-contracts-security/listing_04_integration_testing/tests/integration_tests.cairo:test_staking_flow}}
```

### Testing Multi-Contract State Changes

When one action affects multiple contracts, capture state before and after to
verify all contracts updated correctly:

```cairo,noplayground
{{#rustdoc_include ../listings/ch104-starknet-smart-contracts-security/listing_04_integration_testing/tests/integration_tests.cairo:test_multi_contract_state}}
```

### Cheatcode Cleanup in Cross-Contract Calls

Integration tests require careful cheatcode management. When contract A calls
contract B, you must stop cheating contract B's caller before the cross-contract
call happens:

```cairo,noplayground
{{#rustdoc_include ../listings/ch104-starknet-smart-contracts-security/listing_04_integration_testing/tests/integration_tests.cairo:cheatcode_cleanup}}
```

## Best Practices

### Use Setup Functions

Don't repeat deployment code. Create setup functions that deploy your contract
constellation:

```cairo,noplayground
fn deploy_full_protocol() -> (ITokenDispatcher, IDexDispatcher, IOracleDispatcher) {
    // Deploy and wire up all contracts
    // Return dispatchers for each
}
```

### Test Realistic Flows

Integration tests should mirror real user flows:

```cairo,noplayground
#[test]
fn test_complete_trading_flow() {
    // 1. User deposits collateral
    // 2. User opens position
    // 3. Price changes (mock oracle)
    // 4. User closes position
    // 5. User withdraws collateral
    // Each step may involve multiple contracts
}
```

### Document Contract Dependencies

Integration tests serve as documentation for how contracts interact:

```cairo,noplayground
#[test]
fn test_liquidation_flow() {
    // This test documents that liquidation requires:
    // - Oracle for price data
    // - Vault for collateral
    // - Token for debt repayment
    // - Liquidator contract for executing
}
```

### Test Failure Modes

Test what happens when cross-contract calls fail:

```cairo,noplayground
{{#rustdoc_include ../listings/ch104-starknet-smart-contracts-security/listing_04_integration_testing/tests/integration_tests.cairo:test_stake_without_approval}}
```

## When Integration Tests Aren't Enough

Integration tests verify your contracts work together, but they test against
contracts you deploy. Move to [fork testing](./ch104-02-04-fork-testing.md) when
you need to test against real deployed protocols (DEXs, oracles) you don't
control, or test against actual mainnet state.

## Summary

Integration testing means testing multiple contracts interacting:

- Deploy multiple contracts in your test setup
- Test cross-contract calls and state changes
- Use the `tests/` directory for integration tests (separate crate)
- Test realistic multi-step flows

If you're testing a single contract, it's a
[unit test](./ch104-02-01-unit-testing.md). If you're testing multiple contracts
together, it's an integration test.

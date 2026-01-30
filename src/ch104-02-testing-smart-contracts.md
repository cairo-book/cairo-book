# Testing Smart Contracts

Smart contracts on Starknet are immutable. Once deployed, you can't patch a bug
the way you would with a web server. A mistake in production means lost funds
and broken protocols. In January 2024 alone, DeFi hacks caused over $100 million
in losses, many from bugs that testing would have caught.

This chapter covers how to think about testing smart contracts, not just the
mechanics. We'll work through four testing approaches that complement each
other, each answering different questions about your code.

## Smart Contract Testing Terminology

- **Unit tests** test a _single contract's_ functions. In Starknet Foundry,
  these live in your `src/` directory within `#[cfg(test)]` modules. They use
  cheatcodes freely and typically deploy the contract being tested.

- **Integration tests** test _multiple contracts_ interacting together. In
  Starknet Foundry, these live in a separate `tests/` directory. They verify
  cross-contract calls and composition.

- **Fork tests** run against _real blockchain state_. They fetch actual
  mainnet/testnet data via RPC to test against deployed protocols.

## The Testing Pyramid

```text
        △
       /  \      Fork Tests (real chain state)
      /----\     Integration Tests (multi-contract)
     /------\    Unit Tests (single contract)
    ▔▔▔▔▔▔▔▔▔▔
```

Unit tests form the base. They test one contract at a time, are fast, and catch
most bugs. Integration tests verify that multiple contracts work together
correctly. Fork tests sit at the top, testing against real deployed protocols.

The right ratio depends entirely on your contract. A math-heavy AMM needs more
unit tests for calculations. An aggregator routing through multiple DEXs needs
more integration tests. A protocol that wraps external contracts needs fork
tests.

## Choosing the Right Testing Approach

Each testing approach answers a different question about your contract:

| Approach                                          | Speed       | Question It Answers                                           |
| ------------------------------------------------- | ----------- | ------------------------------------------------------------- |
| [Unit Testing](./ch104-02-01-unit-testing.md)     | Fast        | Does this single contract work correctly?                     |
| [Integration Testing](./ch104-02-02-integration-testing.md) | Fast  | Do my contracts work together correctly?                      |
| [Property-Based Testing](./ch104-02-03-fuzz-testing.md) | Medium | Does this invariant hold for any input, not just examples?    |
| [Fork Testing](./ch104-02-04-fork-testing.md)     | Slow        | Does my contract work with real deployed protocols?           |

### Which Approach to Use

**Unit testing** handles most of your testing needs: testing a contract's
functions, access control, events, and state changes. If you're testing a single
contract, it's a unit test, whether you use `contract_state_for_testing` for
internal functions or deploy the contract to test its ABI.

**Integration testing** is for multi-contract scenarios: your token interacting
with a DEX, a lending protocol calling an oracle, or any cross-contract calls.

**Property-based testing** uses fuzzing to verify invariants hold across many
random inputs. Use it when example tests aren't enough to catch edge cases.

**Fork testing** tests against real chain state. Use it when your contract
integrates with deployed protocols you don't control.

## Setting Up Starknet Foundry

All testing approaches in this chapter use [Starknet
Foundry](https://foundry-rs.github.io/starknet-foundry/), the standard testing
framework for Starknet smart contracts. If you haven't already, configure your
`Scarb.toml`:

```toml
[dev-dependencies]
snforge_std = "0.51.1"

[scripts]
test = "snforge test"

[[target.starknet-contract]]

[tool.scarb]
allow-prebuilt-plugins = ["snforge_std"]

[cairo]
enable-gas = true
```

With this configuration, `scarb test` runs `snforge test` under the hood.

Install Starknet Foundry by following the [installation
guide](https://foundry-rs.github.io/starknet-foundry/getting-started/installation.html).
We recommend using `asdf` to manage tool versions.

> For basic Cairo testing concepts (test anatomy, `#[test]` attribute,
> assertions), see [Testing Cairo Programs](./ch10-00-testing-cairo-programs.md).
> This chapter focuses on smart contract-specific testing patterns.

## What's Next

The following sections cover each testing approach in depth:

- [Unit testing](./ch104-02-01-unit-testing.md) covers testing a single
  contract, from internal functions using `contract_state_for_testing` to
  deployed contracts with cheatcodes for access control, events, and state.

- [Integration testing](./ch104-02-02-integration-testing.md) covers
  multi-contract testing: deploying multiple contracts and testing their
  interactions.

- [Property-based testing](./ch104-02-03-fuzz-testing.md) uses fuzzing to find
  edge cases you'd never think of by testing invariants across random inputs.

- [Fork testing](./ch104-02-04-fork-testing.md) lets you test against real
  mainnet or testnet state.

Each section includes working code examples and explains when to use each
approach.

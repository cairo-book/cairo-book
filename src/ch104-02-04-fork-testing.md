# Fork Testing

Fork testing runs your tests against actual blockchain state. Instead of
deploying mock contracts, you interact with real deployed protocols like DEXs,
oracles, and lending platforms as they exist on mainnet or testnet.

This comes with trade-offs. Fork tests are slower, require RPC access, and can
be non-deterministic. Use them for scenarios where mocks aren't sufficient.

## When to Use Fork Testing

Fork testing works well in specific scenarios:

| Good Fit                        | Why                                                    |
| ------------------------------- | ------------------------------------------------------ |
| Integration with deployed protocols | Test against actual DEX, oracle, or lending behavior |
| Reproducing mainnet bugs        | Pin to the exact block where a bug occurred            |
| Upgrade testing                 | Verify upgrades against real storage state             |
| Composability testing           | Test complex multi-protocol interactions               |

| Poor Fit                        | Why                                                    |
| ------------------------------- | ------------------------------------------------------ |
| Unit tests                      | Way too slow for isolated logic                        |
| Fuzz testing                    | Burns RPC quota quickly                                |
| Rapid development iteration     | Latency kills feedback loop                            |
| Testing isolated contract logic | No benefit over regular tests                          |

If your contract doesn't interact with deployed protocols, you probably don't
need fork testing.

## Configuring Fork Testing

Configure fork targets in your `Scarb.toml`:

```toml
[[tool.snforge.fork]]
name = "MAINNET"
url = "https://starknet-mainnet.public.blastapi.io/rpc/v0_7"
block_id.number = "500000"

[[tool.snforge.fork]]
name = "SEPOLIA"
url = "https://starknet-sepolia.public.blastapi.io/rpc/v0_7"
block_id.number = "100000"
```

Then use the `#[fork]` attribute in your tests:

```cairo,noplayground
#[test]
#[fork("MAINNET")]
fn test_integration_with_deployed_protocol() {
    // This test runs against mainnet state at block 500000
}
```

## Block Pinning

If you take one thing from this page: _pin your blocks_. Without pinning, your
tests are non-deterministic. They pass today, fail tomorrow, as chain state
changes.

### Pinning Strategies

| Strategy             | Determinism     | Use Case                              |
| -------------------- | --------------- | ------------------------------------- |
| `block_id.number`    | ✅ Deterministic | CI, reproducible tests                |
| `block_id.hash`      | ✅ Deterministic | Pin to specific state                 |
| `block_id.tag = "latest"` | ❌ Non-deterministic | Manual exploration only         |

Always pin to a specific block number in CI. Using `latest` causes flaky tests
that fail randomly as chain state evolves.

```toml
# Good - deterministic
[[tool.snforge.fork]]
name = "MAINNET_PINNED"
url = "https://your-rpc-url.com"
block_id.number = "500000"

# Bad for CI - non-deterministic
[[tool.snforge.fork]]
name = "MAINNET_LATEST"
url = "https://your-rpc-url.com"
block_id.tag = "latest"
```

## Practical Example: Testing Against a Deployed Contract

First, define an interface matching the deployed contract you want to interact
with:

```cairo,noplayground
{{#rustdoc_include ../listings/ch104-starknet-smart-contracts-security/listing_05_fork_testing/src/lib.cairo:deployed_interface}}
```

Then write a fork test that interacts with the real deployed contract:

```cairo,noplayground
{{#rustdoc_include ../listings/ch104-starknet-smart-contracts-security/listing_05_fork_testing/src/tests.cairo:fork_test_basic}}
```

### Testing Your Contract Against Deployed Protocols

More commonly, you'll deploy your contract in the fork and have it interact with
deployed protocols:

```cairo,noplayground
{{#rustdoc_include ../listings/ch104-starknet-smart-contracts-security/listing_05_fork_testing/src/tests.cairo:fork_test_deploy_and_interact}}
```

## Caching and Performance

Fork tests are slow on first run—Starknet Foundry has to fetch state from the
RPC. After that, it caches.

Expect 1-7 minutes on a cold cache depending on how much state you touch.
Subsequent runs take seconds.

### Cache Behavior

Cache is keyed by RPC URL and block number, so changing block number invalidates
cache. Cache persists across test runs.

To reset the cache (useful when debugging):

```bash
rm -rf ~/.blockchain_cache
```

## Best Practices

### Use Fork Tests Sparingly

Fork tests should be at the top of your testing pyramid:

```text
        △
       /  \      Fork Tests (few)
      /----\     Integration Tests (some)
     /------\    Unit Tests (most)
    ▔▔▔▔▔▔▔▔▔▔
```

Don't use fork tests for logic that can be tested with unit tests or integration
tests.

### Pin Blocks for CI

Your CI should use deterministic block numbers:

```toml
[[tool.snforge.fork]]
name = "MAINNET_CI"
url = "https://your-rpc-url.com"
block_id.number = "500000"  # Fixed block for reproducibility
```

### Document Why You're Forking

Fork tests should have comments explaining what deployed contract you're testing
against and why a mock wouldn't work:

```cairo,noplayground
#[test]
#[fork("MAINNET")]
fn test_complex_dex_routing() {
    // We fork mainnet because:
    // 1. DEX router at 0xABC has complex multi-hop logic
    // 2. Actual liquidity pools affect routing decisions
    // 3. Mocking this would be as complex as the real thing
    // ...
}
```

### Test Both Success and Failure

Fork tests should verify your contract handles real-world conditions:

```cairo,noplayground
#[test]
#[fork("MAINNET")]
fn test_handles_low_liquidity() {
    // Test against a pool with known low liquidity
    // Verify your contract handles slippage correctly
}

#[test]
#[fork("MAINNET")]
fn test_handles_oracle_stale_price() {
    // Test against historical block where oracle was stale
    // Verify your contract's staleness check works
}
```

## Common Pitfalls

- **Non-deterministic tests**: If your tests pass sometimes and fail other
  times, you're probably using `block_id.tag = "latest"` or not pinning at all.
  Always pin to a specific block number.

- **RPC quota exhaustion**: If tests fail with RPC errors, you may have too many
  fork tests, or you're combining fork with fuzzing. Use a dedicated RPC
  provider, reduce fork test count, run fork tests in a separate CI job, cache
  aggressively, and never fuzz with fork.

- **Slow feedback loop**: If fork tests take minutes to run, you likely have a
  cold cache or excessive state access. Warm the cache in CI setup and minimize
  state reads.

## When Fork Testing Isn't Enough

Fork testing has limitations. You can't test future state, only historical data.
Deployed contracts might change, so you can't test protocol upgrades. And
interactions affect real state, so you can't test in isolation.

For thorough coverage, combine fork testing with unit tests for logic,
integration tests for your contract's interface, and fuzz tests for edge cases.

## Summary

Fork testing lets you test against real blockchain state. Use it for deployed
protocol integrations, reproducing bugs, and upgrade testing. Don't use it for
unit tests, fuzz tests, or rapid iteration. Always pin to a specific block for
deterministic CI, and keep fork tests minimal—only where mocks aren't sufficient.

For detailed configuration options, see the [Starknet Foundry fork testing
documentation](https://foundry-rs.github.io/starknet-foundry/snforge-advanced-features/fork-testing.html).

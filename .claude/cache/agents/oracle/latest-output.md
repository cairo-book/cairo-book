# Research Report: Fork Testing for Smart Contracts
Generated: 2026-01-18

## Summary

Fork testing allows developers to test smart contracts against real blockchain state by creating a local copy ("fork") of a live network at a specific block. This technique is essential for integration testing with deployed protocols, reproducing mainnet bugs, and validating contract upgrades. However, it should be used sparingly at the top of the testing pyramid due to slower execution and RPC dependencies.

## Questions Answered

### Q1: When should you use fork testing (and when NOT to)?
**Answer:** Use fork testing for integration with deployed protocols, reproducing mainnet bugs, and upgrade testing. Avoid for unit tests or isolated logic.
**Source:** [ethereum.org Testing Guide](https://ethereum.org/developers/docs/smart-contracts/testing/), [MixBytes Fork Testing Guide](https://mixbytes.io/blog/how-fork-mainnet-testing)
**Confidence:** High

### Q2: How do block pinning strategies affect determinism?
**Answer:** Block pinning (by number or hash) ensures deterministic test state and enables caching. Using `latest` causes non-determinism and should be avoided in CI.
**Source:** [Foundry Fork Testing Docs](https://book.getfoundry.sh/forge/fork-testing)
**Confidence:** High

### Q3: What are real-world use cases for fork testing?
**Answer:** DEX integration (Uniswap swaps), oracle price testing, protocol composability, and incident reproduction.
**Source:** [BuildBear Uniswap Testing](https://medium.com/buildbear/uniswap-testing-1d88ca523bf0), [Chaos Labs Oracle Tools](https://github.com/ChaosLabsInc/uniswap-v3-oracle-cli)
**Confidence:** High

### Q4: What are the main pitfalls and gotchas?
**Answer:** RPC rate limits, test flakiness from non-deterministic state, cache invalidation issues, and high latency on first run.
**Source:** [Foundry Fork Testing Docs](https://book.getfoundry.sh/forge/fork-testing)
**Confidence:** High

### Q5: Where do fork tests fit in the testing pyramid?
**Answer:** At the top - few tests, high fidelity, slow execution. Unit tests form the base, integration tests in the middle.
**Source:** [Martin Fowler's Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html)
**Confidence:** High

---

## Detailed Findings

### Finding 1: When to Use Fork Testing

**Source:** [ethereum.org](https://ethereum.org/developers/docs/smart-contracts/testing/), [MixBytes](https://mixbytes.io/blog/how-fork-mainnet-testing)

**Good Use Cases:**

| Use Case | Why Fork Testing Helps |
|----------|----------------------|
| **Protocol Integration** | Test against real DEX liquidity, lending protocols, oracles |
| **Reproducing Mainnet Bugs** | Exact state reproduction at incident block |
| **Upgrade Testing** | Verify new implementation against production state |
| **Composability Testing** | Test interactions with multiple deployed contracts |

**Bad Use Cases:**

| Use Case | Why NOT Fork Testing |
|----------|---------------------|
| **Unit Tests** | Too slow; use mocks instead |
| **Isolated Logic** | No external dependencies to test |
| **Fuzz Testing** | Burns RPC quota; non-deterministic inputs |
| **Rapid Iteration** | Slow feedback loop |

**Key Points:**
- Mocks can mask dangerous problems because they only implement needed functions
- Not all protocols are deployed to testnet - some may only exist on mainnet
- Fork testing provides exact production state including liquidity, balances, and oracle prices
- The forked environment can be reverted after each test for isolation

**Code Example (Starknet Foundry):**
```cairo
// Use fork testing for protocol integration
#[test]
#[fork("MAINNET_FORK")]
fn test_dex_swap_integration() {
    // Tests against real deployed AMM contracts
    let amm_dispatcher = IAMMDispatcher { contract_address: REAL_AMM_ADDRESS };
    // ...
}

// DON'T use fork testing for unit tests
#[test]
fn test_calculate_price() {
    // Pure logic - no network state needed
    let price = calculate_price(100, 50);
    assert(price == 2, 'incorrect price');
}
```

---

### Finding 2: Block Pinning Strategies and Determinism

**Source:** [Foundry Fork Testing](https://book.getfoundry.sh/forge/fork-testing), [Starknet Foundry Scarb.toml Reference](https://foundry-rs.github.io/starknet-foundry/appendix/scarb-toml.html)

**Block Pinning Options:**

| Strategy | Determinism | CI Suitability | Use When |
|----------|-------------|----------------|----------|
| `block_id.number = "123456"` | Deterministic | Excellent | Production CI/CD |
| `block_id.hash = "0x..."` | Deterministic | Excellent | Maximum precision |
| `block_id.tag = "latest"` | Non-deterministic | Poor | Local development only |

**Why Determinism Matters:**

1. **Reproducibility**: Tests pass/fail consistently across runs and machines
2. **Caching**: Pinned blocks enable RPC response caching
3. **Debugging**: Failed tests can be reproduced exactly
4. **CI Reliability**: No flaky tests from changing state

**Cache Behavior:**

Ethereum Foundry:
```
~/.foundry/cache/rpc/<chain name>/<block number>/
```

- First run with pinned block: 7+ minutes (fetches all state)
- Subsequent runs: ~0.5 seconds (uses cache)
- `forge clean` clears cache
- CI: foundry-toolchain GitHub Action caches RPC responses automatically

**Starknet Foundry Configuration:**
```toml
# Scarb.toml - RECOMMENDED for CI (pinned block)
[[tool.snforge.fork]]
name = "MAINNET_PINNED"
url = "https://starknet-mainnet.public.blastapi.io"
block_id.number = "500000"

# Development only (non-deterministic)
[[tool.snforge.fork]]
name = "MAINNET_LATEST"
url = "https://starknet-mainnet.public.blastapi.io"
block_id.tag = "latest"
```

---

### Finding 3: Real-World Examples

**Source:** [BuildBear Uniswap Testing](https://medium.com/buildbear/uniswap-testing-1d88ca523bf0), [Chaos Labs Oracle Tools](https://github.com/ChaosLabsInc/uniswap-v3-oracle-cli), [Euler Price Oracle Fork Tests](https://github.com/euler-xyz/euler-price-oracle/blob/master/test/adapter/uniswap/UniswapV3Oracle.fork.t.sol)

#### Example 1: DEX Integration Testing

**Problem:** Testing swaps against a DEX requires real liquidity pools

**Solution:** Fork mainnet and test against actual pool state

```solidity
// Ethereum Foundry example
contract SwapTest is Test {
    function setUp() public {
        // Fork at specific block with known liquidity
        vm.createSelectFork("mainnet", 19000000);
    }
    
    function testSwapETHForDAI() public {
        // Use real Uniswap router
        IUniswapV2Router router = IUniswapV2Router(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D);
        
        address[] memory path = new address[](2);
        path[0] = WETH;
        path[1] = DAI;
        
        uint256 amountOut = router.swapExactETHForTokens{value: 1 ether}(
            0, path, address(this), block.timestamp
        );
        
        assertGt(amountOut, 0);
    }
}
```

#### Example 2: Oracle Price Testing

**Problem:** Oracle prices affect liquidations, but are static on forks by default

**Solution:** Use oracle manipulation tools or mock specific price feeds

The Chaos Labs team provides tools specifically for this:
- [uniswap-v3-oracle-cli](https://github.com/ChaosLabsInc/uniswap-v3-oracle-cli) - CLI for manipulating TWAP prices
- [uniswap-v3-oracle-hardhat-plugin](https://github.com/ChaosLabsInc/uniswap-v3-oracle-hardhat-plugin) - Hardhat integration

**Key Insight:** Oracle return values trigger state changes in DeFi apps. Being able to test a range of prices is critical for edge cases like liquidations.

#### Example 3: Reproducing Mainnet Incidents

**Use Case:** Cardano network experienced a split in November 2024 due to a malformed transaction

**Approach:**
1. Fork at block before incident
2. Replay the problematic transaction
3. Observe failure mode
4. Develop and test fix
5. Verify fix prevents the issue

From the Tenderly team: "If their users report any issue, the Safe team uses Transaction Simulator to reproduce the problem."

---

### Finding 4: Pitfalls and Gotchas

**Source:** [Foundry Fork Testing](https://book.getfoundry.sh/forge/fork-testing), [Dev.to Flaky Tests](https://dev.to/codux/flaky-tests-and-how-to-deal-with-them-2id2)

#### RPC Rate Limits and Costs

| Provider | Free Tier | Notes |
|----------|-----------|-------|
| Alchemy | 300M compute units/month | Free archive data |
| Infura | 100K requests/day | Free archive data |
| Tenderly | Varies | Optimized for fork testing |

**Mitigation Strategies:**
```toml
# foundry.toml
[profile.default]
# Limit RPC calls per second
compute_units_per_second = 330

# Configure retries for rate limit errors
fork_retries = 3
fork_retry_backoff = 1000
```

**Warning:** Fuzz tests on forks can rapidly exhaust RPC quotas. Each fuzz run may trigger multiple RPC calls. Consider:
- Limiting fuzz runs for fork tests
- Using cached local state
- Running fuzz tests against mocks instead

#### Test Flakiness Sources

| Source | Cause | Mitigation |
|--------|-------|------------|
| Non-pinned blocks | State changes between runs | Always pin block number |
| Network latency | Timeouts | Increase timeout, use caching |
| RPC rate limits | Too many requests | Implement backoff, limit fuzz runs |
| Cache invalidation | Stale cached data | Clear cache periodically |

#### Fork State Isolation Warning (Foundry)

```solidity
// WRONG: Creates independent forks, state not shared
vm.createSelectFork("mainnet", 100);  // Fork 1
// ... make state changes ...
vm.createSelectFork("mainnet", 100);  // Fork 2 - changes from Fork 1 are LOST

// CORRECT: Create once, select to switch
uint256 fork1 = vm.createFork("mainnet", 100);
uint256 fork2 = vm.createFork("mainnet", 200);
vm.selectFork(fork1);  // Switch between forks
vm.selectFork(fork2);
```

---

### Finding 5: Testing Pyramid Placement

**Source:** [Martin Fowler's Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html), [ethereum.org Testing](https://ethereum.org/developers/docs/smart-contracts/testing/)

```
                    /\
                   /  \
                  / E2E \           <- Fork Tests (Few, Slow, High Fidelity)
                 /  Fork \
                /----------\
               / Integration \      <- Contract Integration Tests
              /----------------\
             /    Unit Tests    \   <- Fast, Isolated, Many
            /____________________\
```

**Test Type Characteristics:**

| Type | Quantity | Speed | Fidelity | Fork? |
|------|----------|-------|----------|-------|
| Unit | Many (70-80%) | Fast (ms) | Low | No |
| Integration | Medium (15-20%) | Medium (s) | Medium | Sometimes |
| Fork/E2E | Few (5-10%) | Slow (min) | High | Yes |

**Recommended Distribution for Smart Contracts:**

```
src/
├── lib.cairo              # Contract code
└── tests/
    ├── unit/              # 70%+ of tests
    │   ├── test_math.cairo
    │   └── test_storage.cairo
    ├── integration/       # 20% of tests
    │   ├── test_contract_calls.cairo
    │   └── test_workflows.cairo
    └── fork/              # <10% of tests
        └── test_mainnet_integration.cairo
```

**Key Principles:**

1. **Unit tests are the foundation** - Fast, isolated, catch most bugs early
2. **Integration tests verify contracts work together** - Use mocks when possible
3. **Fork tests are the safety net** - Only for scenarios that require real state
4. **Fork tests should not replace unit tests** - They supplement them

**When to Add Fork Tests:**

- After unit and integration tests pass
- For external protocol dependencies
- For upgrade validation
- For incident reproduction
- NOT for basic functionality

---

## Starknet Foundry Fork Testing Specifics

### Configuration

```toml
# Scarb.toml
[package]
name = "my_project"
version = "0.1.0"

[dev-dependencies]
snforge_std = "0.54.0"

# Fork configuration
[[tool.snforge.fork]]
name = "MAINNET"
url = "https://starknet-mainnet.public.blastapi.io"
block_id.number = "500000"

[[tool.snforge.fork]]
name = "SEPOLIA"
url = "https://starknet-sepolia.public.blastapi.io"
block_id.tag = "latest"
```

### Using Fork in Tests

```cairo
use snforge_std::{declare, ContractClassTrait};

#[test]
#[fork("MAINNET")]
fn test_on_mainnet_fork() {
    // This test runs against forked mainnet state at block 500000
    // Can interact with deployed contracts at their real addresses
}

#[test]
#[fork("SEPOLIA")]
fn test_on_sepolia_fork() {
    // This test runs against forked Sepolia state
}
```

### Recent Improvements (v0.50+)

- Fork tests now discover chain ID via provided RPC URL (defaults to SN_SEPOLIA)
- Support for overriding fork configuration in test attribute with different block ID
- Fixed bug where resources in nested calls were counted multiple times
- Deal cheatcode allows minting STRK to accounts in fork tests

---

## Recommendations

### For This Codebase (Cairo Book)

1. **Structure fork testing documentation** in the testing pyramid context
2. **Emphasize block pinning** for CI determinism
3. **Provide concrete Starknet examples** (DEX, oracle, upgrade scenarios)
4. **Warn about RPC costs** and rate limiting
5. **Show the testing hierarchy** - unit tests first, fork tests as safety net

### Implementation Notes

- Use `block_id.number` in CI, not `block_id.tag = "latest"`
- Cache considerations: first fork run is slow, subsequent runs fast
- Consider RPC provider free tier limits when writing fork tests
- Fork tests should be few and focused - not a replacement for unit tests
- Use meaningful fork names that indicate purpose (e.g., "MAINNET_BLOCK_500000")

---

## Sources

1. [Foundry Fork Testing Documentation](https://book.getfoundry.sh/forge/fork-testing) - Primary reference for Ethereum Foundry fork testing
2. [Starknet Foundry Scarb.toml Reference](https://foundry-rs.github.io/starknet-foundry/appendix/scarb-toml.html) - Configuration options for snforge fork testing
3. [ethereum.org Smart Contract Testing](https://ethereum.org/developers/docs/smart-contracts/testing/) - Testing best practices
4. [Martin Fowler's Practical Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html) - Testing strategy fundamentals
5. [MixBytes Fork Testing Guide](https://mixbytes.io/blog/how-fork-mainnet-testing) - Practical fork testing advice
6. [BuildBear Uniswap Testing](https://medium.com/buildbear/uniswap-testing-1d88ca523bf0) - DEX integration testing example
7. [Chaos Labs Oracle Tools](https://github.com/ChaosLabsInc/uniswap-v3-oracle-cli) - Oracle manipulation for testing
8. [Tenderly Forks Documentation](https://docs.tenderly.co/forks/guides/testing) - Alternative fork testing infrastructure
9. [Starknet Foundry GitHub](https://github.com/foundry-rs/starknet-foundry) - Source and changelog
10. [Hardhat Mainnet Forking](https://v2.hardhat.org/hardhat-network/docs/guides/forking-other-networks) - Alternative tooling reference

## Open Questions

- How does snforge handle fork test caching compared to Ethereum Foundry?
- Are there Starknet-specific DEX/AMM contracts commonly used for fork testing examples?
- What are the RPC rate limits for popular Starknet RPC providers?

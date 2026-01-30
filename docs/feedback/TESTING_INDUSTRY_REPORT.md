# Smart Contract Testing: Industry Patterns vs Cairo Book

**Purpose:** This report documents industry-standard smart contract testing patterns from
the EVM/Foundry ecosystem and identifies misalignments with the Cairo Book's current
testing documentation.

---

## 1. Industry Definitions

### What "Unit Test" Means in Smart Contracts

In Foundry and the broader EVM ecosystem, a **unit test** is a test that:

- Tests a single contract's functions
- **Deploys the contract** in `setUp()`
- Uses cheatcodes (`vm.prank`, `vm.warp`, etc.) freely
- May test access control, events, and state changes

This differs from traditional software where "unit test" often means "no dependencies."

**Foundry example of a standard unit test:**

```solidity
// This IS a unit test in Foundry terminology
contract MyContractTest is Test {
    MyContract myContract;

    function setUp() public {
        myContract = new MyContract();  // Deployment happens here
    }

    function test_OnlyOwnerCanCall() public {
        vm.prank(address(0));           // Mock the caller
        vm.expectRevert(Unauthorized.selector);
        myContract.ownerOnlyFunction();
    }
}
```

Source: [Foundry Best Practices - Writing Tests](https://getfoundry.sh/guides/best-practices/writing-tests/)

### What "Integration Test" Means

An **integration test** in smart contracts typically means:

- Testing **multiple contracts** interacting together
- Testing cross-contract calls
- Testing contract composition (e.g., your contract calling a DEX)

It does NOT mean "tests that deploy contracts" (that's just regular testing).

### What "Fork Test" Means

A **fork test** runs against real blockchain state:

- Fetches actual mainnet/testnet state via RPC
- Tests against real deployed protocols
- Used for integration with external protocols you don't control

Source: [Foundry Fork Testing](https://getfoundry.sh/forge/fork-testing)

---

## 2. Foundry Test Organization

### File Structure

```
test/
├── MyContract.t.sol           # Unit tests for MyContract
├── MyContract.owner.t.sol     # Unit tests for owner functions (large contracts)
├── MyContract.deposits.t.sol  # Unit tests for deposit functions
└── integration/
    └── MyContractDex.t.sol    # Integration with DEX
```

### Naming Conventions

| Pattern | Type |
|---------|------|
| `test_Description` | Standard test |
| `testFuzz_Description` | Fuzz test |
| `test_RevertIf_Condition` | Revert test |
| `testFork_Description` | Fork test |
| `testForkFuzz_Description` | Fork + fuzz |

### setUp() Always Deploys

In Foundry, `setUp()` runs before every test and typically deploys contracts:

```solidity
function setUp() public {
    token = new MyToken();
    owner = makeAddr("owner");
    vm.prank(owner);
    token.initialize();
}
```

This is standard practice, not "integration testing."

Source: [Foundry Writing Tests](https://getfoundry.sh/forge/writing-tests)

---

## 3. How Cheatcodes Are Used

Cheatcodes are used **in all test types**, not just integration tests.

### Common Cheatcodes in Unit Tests

```solidity
// Caller mocking - used in unit tests for access control
vm.prank(attacker);
vm.startPrank(owner);

// Time manipulation - used in unit tests for time-dependent logic
vm.warp(block.timestamp + 1 days);

// Block manipulation
vm.roll(block.number + 100);

// Expectation setting
vm.expectRevert(Unauthorized.selector);
vm.expectEmit(true, true, false, true);
```

Source: [Foundry Cheatcodes](https://getfoundry.sh/forge/cheatcodes)

### Access Control Testing

Access control is tested in **unit tests** with `vm.prank`:

```solidity
// This is a UNIT test, not an integration test
function test_RevertWhen_CallerNotOwner() public {
    vm.prank(address(0));  // Simulate non-owner caller
    vm.expectRevert(Unauthorized.selector);
    myContract.ownerOnlyFunction();
}
```

---

## 4. Testing Internal Functions

Foundry provides a pattern for testing `internal` functions using **harness contracts**:

```solidity
// Harness exposes internal functions
contract MyContractHarness is MyContract {
    function exposed_internalCalculation(uint x) external returns (uint) {
        return _internalCalculation(x);
    }
}

// Test uses the harness
contract MyContractTest is Test {
    MyContractHarness harness;

    function setUp() public {
        harness = new MyContractHarness();
    }

    function test_InternalCalculation() public {
        assertEq(harness.exposed_internalCalculation(5), 10);
    }
}
```

Note: This still deploys a contract. There is no "test without deployment" pattern in Foundry.

**Private functions** cannot be unit tested. Foundry docs suggest either:
1. Convert them to `internal`
2. Copy the logic into test files (with CI checks to keep them in sync)

---

## 5. Testing Ratios: No Industry Standard

**No authoritative source prescribes ratios like 70-20-10.**

From [ethereum.org](https://ethereum.org/developers/docs/smart-contracts/testing/):
> No specific percentages mentioned. Emphasis on "a test suite made up of different
> tools and approaches is ideal."

From [Smart Contract Security Field Guide](https://scsfg.io/developers/testing/):
> "Every system should incorporate a comprehensive unit testing strategy and
> end-to-end tests."
> No ratios prescribed.

The ratio depends entirely on the contract:
- Math-heavy contracts (AMMs, lending) → more unit tests
- Access-control-heavy contracts (governance) → more deployed tests
- Protocol integrations → more fork tests

---

## 6. Comparison: Cairo Book vs Industry

### Current Cairo Book Claims

| Cairo Book Says | Industry Practice |
|-----------------|-------------------|
| `contract_state_for_testing` = unit test | No equivalent in Foundry; this is Cairo-specific |
| `deploy` + dispatcher = integration test | This is what Foundry calls a "unit test" |
| Unit tests shouldn't depend on contract state | Foundry unit tests absolutely test stateful behavior |
| 70% unit, 20% integration, 10% fork | No one prescribes these ratios |
| Unit tests for "internal functions or pure logic" | Foundry tests internal via harnesses (still deployed) |

### The Cairo-Specific Pattern

`contract_state_for_testing()` is unique to Cairo. It allows:
- Direct state manipulation without deployment
- Calling internal functions directly
- No ABI serialization overhead

This is useful but **not what the industry calls "unit testing."**

The closest Foundry equivalent is the harness pattern, which still deploys.

---

## 7. Recommendations for Cairo Book

### Terminology Alignment

Instead of:
> "Unit Testing" vs "Integration Testing"

Consider:
> "Testing Internal Functions" vs "Testing Deployed Contracts" vs "Fork Testing"

Or align with Foundry:
> "Unit Tests" = tests of a single contract (deployed)
> "Integration Tests" = tests of multiple contracts interacting
> "Fork Tests" = tests against real chain state

### Remove Prescribed Ratios

Replace:
> "A healthy test suite might have 70% unit tests, 20% integration tests, and 10% fork tests."

With:
> "The ratio depends on your contract. Math-heavy contracts benefit from more
> internal function tests. Access-control-heavy contracts need more deployed tests.
> Protocol integrations require fork tests."

### Be Explicit About Cairo's Unique Pattern

Add clarity that `contract_state_for_testing()` is a Cairo-specific feature:

> "Cairo provides `contract_state_for_testing()`, which creates a contract state
> without deployment. This is unique to Cairo—in Foundry/Hardhat, even 'unit tests'
> deploy contracts. Use this pattern for testing internal functions that aren't
> exposed in the ABI."

### Clarify Access Control Testing

Current docs imply access control testing is "integration testing." The industry
tests access control in unit tests with caller mocking. Clarify:

> "Testing access control requires mocking the caller. In Cairo, this means using
> `start_cheat_caller_address` on a deployed contract. While this uses deployment
> machinery, you're still testing a single function's behavior—this is standard
> practice, not 'integration testing.'"

### Add Harness Pattern for Completeness

Document that for internal functions needing caller context, a harness-like
pattern may be needed:

```cairo
// If you need caller context for internal function testing,
// create a wrapper that exposes it:
#[external(v0)]
fn exposed_internal_transfer(ref self: ContractState, ...) {
    self._internal_transfer(...);
}
```

---

## 8. Summary Table

| Concept | Foundry/EVM | Cairo Book (Current) | Recommended |
|---------|-------------|---------------------|-------------|
| Unit test | Single contract, deployed, cheatcodes OK | No deployment, direct state | Clarify Cairo-specific nature |
| Integration test | Multiple contracts | Any deployment | Align with industry |
| Fork test | Real chain state | Real chain state | ✓ Aligned |
| Access control testing | Unit test with `vm.prank` | "Integration test" | Reclassify as unit test |
| Internal functions | Harness pattern (deployed) | `contract_state_for_testing` | Document as Cairo-specific |
| Ratios | None prescribed | 70-20-10 | Remove or caveat heavily |

---

## Sources

- [Foundry Best Practices - Writing Tests](https://getfoundry.sh/guides/best-practices/writing-tests/)
- [Foundry Writing Tests](https://getfoundry.sh/forge/writing-tests)
- [Foundry Fork Testing](https://getfoundry.sh/forge/fork-testing)
- [Foundry Cheatcodes](https://getfoundry.sh/forge/cheatcodes)
- [ethereum.org - Testing Smart Contracts](https://ethereum.org/developers/docs/smart-contracts/testing/)
- [Smart Contract Security Field Guide - Testing](https://scsfg.io/developers/testing/)
- [LogRocket - Unit Testing with Forge](https://blog.logrocket.com/unit-testing-smart-contracts-forge/)
- [Hardhat - Testing Contracts](https://v2.hardhat.org/hardhat-runner/docs/guides/test-contracts)

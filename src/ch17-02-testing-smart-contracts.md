# Testing Smart Contracts

Testing smart contracts is a critical part of the development process. It is important to ensure that the smart contract behaves as expected and that it is secure.

In this section, we will give a brief overview of how to test Cairo smart contracts using Native Test Runner and Starknet Foundry. 

Depending on your use case and the complexity of your contract, you can choose the testing tool that best suits your needs.

1. Native Test Runner: For simple and static testing 
2. Starknet Foundry: For advanced blockchain simulated testing
 
We will be testing our `PizzaFactory` contract: 

```rust
{{#include ../listings/ch17-starknet-smart-contracts-security/listing_02_pizza_factory/src/pizza.cairo}}
```

## Introduction to Native Test Runner 

Native Test Runner is a built-in testing tool with `Scarb` and with usage from native libraries from `starknet` which means you can test your cairo contract without any additional installation.

This is the command to run your test contract.

```cairo
scarb cairo-test
```

List of test functions: 


```rust
// From testing.cairo

fn set_block_number(block_number: u64) 
fn set_caller_address(address: ContractAddress)
fn set_contract_address(address: ContractAddress)
fn set_sequencer_address(address: ContractAddress)
fn set_block_timestamp(block_timestamp: u64)
fn set_version(version: felt252)
fn set_account_contract_address(address: ContractAddress)
fn set_max_fee(fee: u128)
fn set_transaction_hash(hash: felt252)
fn set_chain_id(chain_id: felt252)
fn set_nonce(nonce: felt252)
fn set_signature(signature: Span<felt252>)
```

```rust
// From info.cairo

fn get_execution_info() -> Box<v2::ExecutionInfo>
fn get_caller_address() -> ContractAddress
fn get_contract_address() -> ContractAddress
fn get_block_info() -> Box<BlockInfo>
fn get_tx_info() -> Box<v2::TxInfo>
fn get_block_timestamp() -> u64
fn get_block_number() -> u64 

```
We also use functions from syscall library to deploy and interact with the contract. (see [Syscalls](https://github.com/starkware-libs/cairo/blob/main/corelib/src/starknet/syscalls.cairo))

## Testing Smart Contracts with Native Test Runner

Let's look at how we can test our `PizzaFactory` contract using Native Test Runner

Full overview of our test contract:

```rust
{{#include ../listings/ch17-starknet-smart-contracts-security/listing_02_pizza_factory_native/src/tests/native_test_overview.cairo}}
```

The flow of the deployment process is as follows:

1. Create a `calldata` array for `PizzaFactory` constructor arguments
2. Extract `class_hash` variable from `PizzaFactory::TEST_CLASS_HASH`
3. Use the `deploy_syscall` function to deploy our contract and destructure `contract_address` from `deploy_syscall` function
4. Attach `contract_address` to the `IPizzaFactoryDispatcher` struct
5. Use `IPizzaFactoryDispatcher` to test the individual contract functions

Note that for every individual test function, we use our `deploy` helper function to deploy an instance of the `PizzaFactory` contract.

Let's dive deeper into each test functions

### `test_deploy()`

```rust
{{#include ../listings/ch17-starknet-smart-contracts-security/listing_02_pizza_factory_native/src/tests/native_test.cairo:test_1}}
```

On here, we first create an instance of contract with the `owner` address.
We will then, set the dispatcher to the `contract` variable.

We then use `.get_owner()` function to assert that the owner of the contract is the same as the owner we passed in.

### `test_set_as_new_owner() && test_set_not_owner()`

```rust
{{#include ../listings/ch17-starknet-smart-contracts-security/listing_02_pizza_factory_native/src/tests/native_test.cairo:test_2}}
```

The first function, `test_set_as_new_owner`, we declare two different contract addresses.

We first deploy with the contract with the `owner` address and we validate to see if the contract owner is the same as the `owner` address.
Then, we change the owner address to `new_owner` and we validate to see if the owner address has been changed.

Second function, `test_set_not_owner`, we are utilizing the `[should_panic]` attribute to expect the test function to panic since `make_pizza` function can only be called by the contract owner. In this case, the test will panic since we set the caller to be `not_owner` address.

### `test_pizza_creation()`

```rust
{{#include ../listings/ch17-starknet-smart-contracts-security/listing_02_pizza_factory_native/src/tests/native_test.cairo:test_3}}
```

We are testing the `make_pizza` function and check that the storage variable `pizzas` has been incremented by 1.

Note that `make_pizza` is owner-only function so we have to set the caller address to be the owner address before calling it.

Once all the test cases have successfully passed, you will see the following output:

```bash
running 4 tests
test source::tests::native_test::native_test::test_deploy ... ok (gas usage est.: 242020)
test source::tests::native_test::native_test::test_set_not_owner ... ok (gas usage est.: 252720)
test source::tests::native_test::native_test::test_set_as_new_owner ... ok (gas usage est.: 460760)
test source::tests::native_test::native_test::test_pizza_creation ... ok (gas usage est.: 607720)
test result: ok. 4 passed; 0 failed; 0 ignored; 0 filtered out;
```

## Testing Smart Contracts with Starknet Foundry

Starknet Foundry is a new testing library that allows you to test your Cairo smart contracts with more advanced features.

You can checkout the installation guide from the [Starknet Foundry Documentation](https://foundry-rs.github.io/starknet-foundry/getting-started/installation.html).

This is the command to run your test contract using Starknet Foundry.

```rust
snforge test
```

List of test functions: 


```rust
// From snforge_std

fn test_selector() -> felt252
fn test_address() -> ContractAddress
fn roll(target: CheatTarget, block_number: u64, span: CheatSpan)
fn start_roll(target: CheatTarget, block_number: u64)
fn stop_roll(target: CheatTarget)
fn prank(target: CheatTarget, caller_address: ContractAddress, span: CheatSpan)
fn start_prank(target: CheatTarget, caller_address: ContractAddress)
fn stop_prank(target: CheatTarget)
fn warp(target: CheatTarget, block_timestamp: u64, span: CheatSpan)
fn start_warp(target: CheatTarget, block_timestamp: u64)
fn stop_warp(target: CheatTarget)
fn elect(target: CheatTarget, sequencer_address: ContractAddress, span: CheatSpan)
fn start_elect(target: CheatTarget, sequencer_address: ContractAddress)
fn stop_elect(target: CheatTarget)
fn mock_call<T, impl TSerde: core::serde::serde<T>, impl TDestruct: Destruct<T>>(contract_address: ContractAddress, function_selector: felt252, ret_data: T, n_times: u32)
fn start_mock_call<T, impl TSerde: core::serde::Serde<T>, impl TDestruct: Destruct<T>>(contract_address: ContractAddress, function_selector: felt252, ret_data: T)
fn stop_mock_call(contract_address: ContractAddress, function_selector: felt252)
fn replace_bytecode(contract: ContractAddress, new_calss: ClassHash)
fn validate_cheat_target_and_span(target: @CheatTarget, span: @CheatSpan)
fn validate_cheat_span(span: @CheatSpan)
```

There are also other useful modules including:  

```
mod events;
mod l1_handler;
mod contract_class;
mod tx_info;
mod fork;
mod storage; 
```

Let's look at our test contract:

```rust
{{#include ../listings/ch17-starknet-smart-contracts-security/listing_02_pizza_factory_snfoundry/src/tests/foundry_test_overview.cairo}}
```

The flow of deployment process is as follows:

1. Retrieve contract class hash from `declare` function
2. Create an array of constructor arguments for the contract
3. Deploy the contract using `deploy` method and destructure the contract address and return the address

Let's look at each test function in detail:

### `test_deploy()`

```rust
{{#include ../listings/ch17-starknet-smart-contracts-security/listing_02_pizza_factory_snfoundry/src/tests/foundry_test.cairo:test_1}}
```

After we deploy our contract and setup the dispatcher, we use cheatcodes to manipulate the contract state. We use the `start_prank` cheatcode to target the deployed contract and et the caller address to be the owner's address. We then call the `make_pizza` function and validate to see if the `pizza` count has been incremented by 1.

To learn more about cheatcodes, check out the [Cheatcode Section](https://foundry-rs.github.io/starknet-foundry/testing/using-cheatcodes.html)

### `test_set_as_new_owner()`

```rust
{{#include ../listings/ch17-starknet-smart-contracts-security/listing_02_pizza_factory_snfoundry/src/tests/foundry_test.cairo:test_2}}
```

On here, our goal is to test the `change_owner` function. We deploy the contract and using `stark_prank` cheatcode, we call the `change_owner` function as the owner and we validate to see if the owner has been changed.

### `capture_pizza_emission_event()`

```rust
{{#include ../listings/ch17-starknet-smart-contracts-security/listing_02_pizza_factory_snfoundry/src/tests/foundry_test.cairo:test_3}}
```

On here, we are testing the event emission of the `make_pizza` function. After deployment, we use `stark_prank` cheatcode to target the deployed contract with owner as the caller, we call the `make_pizza` function to validate if the event has been emitted and the pizza count has been incremented by 1.

We use the `spy_events` method to capture contract events and we provide the expected event parameters on `assert_emitted` method.

Lastly, we make sure that the `pizza` storage variable has been incremented by 1.

### `test_set_as_new_owner_direct()`

```rust
{{#include ../listings/ch17-starknet-smart-contracts-security/listing_02_pizza_factory_snfoundry/src/tests/foundry_test.cairo:test_4}}
```

In this test function, we directly create an instance of the contract state using `contract_state_for_testing` function and access the internal functions of the contract instead of declaring/deploying the contract first.

We first have to import the following to properly access the contract state:

```rust
    use pizza::PizzaFactory::ownerContractMemberStateTrait;
    use pizza::PizzaFactory::{InternalTrait};
```

The imports gives us access to our internal functions and the read/write access to `owner` storage variable.

We are grabbing the contract state directly and changing the address of the owner by using `.write` method on our `owner` storage variable. Then, we validate to see whether the owner has been updated.

Once the test cases have successfully passed, you will see the following output:

```bash
Running 4 test(s) from src/
[PASS] source::tests::foundry_test::foundry_test::test_set_as_new_owner_direct (gas: ~129)
[PASS] source::tests::foundry_test::foundry_test::test_deploy (gas: ~366)
[PASS] source::tests::foundry_test::foundry_test::test_set_as_new_owner (gas: ~300)
[PASS] source::tests::foundry_test::foundry_test::capture_pizza_emission_event (gas: ~370)
Tests: 4 passed, 0 failed, 0 skipped, 0 ignored, 0 filtered out
```

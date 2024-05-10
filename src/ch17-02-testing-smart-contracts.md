# Testing Smart Contracts

Testing smart contracts is a critical part of the development process. It is important to ensure that smart contracts behave as expected and that it is secure.

In this section, we will give a brief overview of how to test Cairo smart contracts using Native Test Runner and Starknet Foundry. 

Depending on your use case and the complexity of your contract, you can choose the testing tool that best suits your needs.

- Native Test Runner: For simple and static testing 
- Starknet Foundry: For advanced blockchain simulated testing
 
In this chapter, we will be using an example contract `PizzaFactory` to showcase each testing tool. 

```rust,noplayground
{{#include ../listings/ch17-starknet-smart-contracts-security/listing_02_pizza_factory_native/src/pizza.cairo}}
```

## Introduction to Native Test Runner 

Native Test Runner is a built-in testing tool that comes with `Scarb`, leveraging  `starknet` native libraries which means you can test your cairo contract without any additional installation.

Scarb provides two commands to run your test contract:

```rust,noplayground
scarb cairo-test
scarb test
```

The `scarb cairo-test` command is used to test our contract in Native Test Runner. 

The `scarb test` is a customizable test command and on default, it is configured to use `scarb cairo-test`. 

As an example, we can change the `scarb test` command to use Starknet Foundry by providing the following in `scarb.toml`:  

```toml,noplayground
[scripts]
test = "snforge test"
```

You can learn more about the commands in the [Scarb documentation](https://docs.swmansion.com/scarb/docs/extensions/testing.html)

## Testing Smart Contracts with Native Test Runner

Let's look at how we can test our `PizzaFactory` contract using Native Test Runner.

Full overview of our test module:

```rust,noplayground
{{#include ../listings/ch17-starknet-smart-contracts-security/listing_02_pizza_factory_native/src/tests/native_test_overview.cairo}}
```

The flow of the deployment process is as follows:

1. Create a `calldata` array for `PizzaFactory` constructor arguments
2. Extract `class_hash` variable from `PizzaFactory::TEST_CLASS_HASH`
3. Use the `deploy_syscall` function to deploy our contract and destructure `contract_address` from `deploy_syscall` function
4. Attach `contract_address` to the `IPizzaFactoryDispatcher` struct
5. Use `IPizzaFactoryDispatcher` to test the individual contract functions

Note that for every individual test function, we use our `deploy` helper function to deploy an instance of the `PizzaFactory` contract.

Let's dive deeper into each test functions.

### `test_deploy()`

```rust,noplayground
{{#include ../listings/ch17-starknet-smart-contracts-security/listing_02_pizza_factory_native/src/tests/native_test.cairo:test_1}}
```

On here, we first create an instance of contract with the `owner` address.
We will then, set the dispatcher to the `contract` variable.

We then use `.get_owner()` function to assert that the owner of the contract is the same as the owner we passed in.

### `test_set_as_new_owner() && test_set_not_owner()`

```rust,noplayground
{{#include ../listings/ch17-starknet-smart-contracts-security/listing_02_pizza_factory_native/src/tests/native_test.cairo:test_2}}
```

The first function, `test_set_as_new_owner`, we declare two different contract addresses.

We first deploy with the contract with the `owner` address and we validate to see if the contract owner is the same as the `owner` address.
Then, we change the owner address to `new_owner` and we validate to see if the owner address has been changed.

Second function, `test_set_not_owner`, we are utilizing the `[should_panic]` attribute to expect the test function to panic since `make_pizza` function can only be called by the contract owner. In this case, the test will panic since we set the caller to be `not_owner` address.

### `test_pizza_creation()`

```rust,noplayground
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

To learn more about testing with Native Test Runner, check out the libraries directly!

- [testing.cairo](https://github.com/starkware-libs/cairo/blob/main/corelib/src/starknet/testing.cairo#L13C1-L98C2)
- [info.cairo](https://github.com/starkware-libs/cairo/blob/65b27e7b63dccedeb86514806527449d5da0e3f5/corelib/src/starknet/info.cairo#L45C1-L71C1)
- [syscalls.cairo](https://github.com/starkware-libs/cairo/blob/65b27e7b63dccedeb86514806527449d5da0e3f5/corelib/src/starknet/syscalls.cairo#L6C1-L99C64)

## Testing Smart Contracts with Starknet Foundry

Starknet Foundry is a toolkit for developing starknet contracts. It also provides a set of testing tools for your starknet contracts. 

You can checkout the installation guide from the [Starknet Foundry Documentation](https://foundry-rs.github.io/starknet-foundry/getting-started/installation.html).

This is the command to run your test contract using Starknet Foundry:

```rust,noplayground
snforge test
```

Let's look at our test module:

```rust,noplayground
{{#include ../listings/ch17-starknet-smart-contracts-security/listing_02_pizza_factory_snfoundry/src/tests/foundry_test_overview.cairo}}
```

The flow of deployment process is as follows:

1. Retrieve contract class hash from `declare` function
2. Create an array of constructor arguments for the contract
3. Deploy the contract using `deploy` method and destructure the contract address
4. Attach `contract_address` to the `IPizzaFactoryDispatcher` struct
5. Return both dispatcher and the contract address

Let's look at each test function in detail:

### `test_deploy()`

```rust,noplayground
{{#include ../listings/ch17-starknet-smart-contracts-security/listing_02_pizza_factory_snfoundry/src/tests/foundry_test.cairo:test_1}}
```

After we deploy our contract and setup the dispatcher, we use cheatcodes to manipulate the contract state. We are utilizing `start_prank` to target our contract and set the caller address to be `owner_check`. The first `make_pizza` function call will increment the `pizza` storage variable by 1. However, the second `make_pizza` function call will fail due to being called after `stop_prank` which makes `owner_check` no longer the caller address. Therefore, we expect the test to panic.

### `test_set_as_new_owner()`

```rust,noplayground
{{#include ../listings/ch17-starknet-smart-contracts-security/listing_02_pizza_factory_snfoundry/src/tests/foundry_test.cairo:test_2}}
```

On here, our goal is to test the `change_owner` function. Using `stark_prank`, we call the `change_owner` function as the owner and we validate to see if the owner has been changed.

### `capture_pizza_emission_event()`

```rust,noplayground
{{#include ../listings/ch17-starknet-smart-contracts-security/listing_02_pizza_factory_snfoundry/src/tests/foundry_test.cairo:test_3}}
```

On here, we are testing the event emission of the `make_pizza` function. We use `stark_prank` to target the deployed contract with owner as the caller, we call the `make_pizza` function to validate if the event has been emitted and the pizza count has been incremented by 1.

We use the `spy_events` method to capture contract events and we provide the expected event parameters on `assert_emitted` method.

Lastly, we make sure that the `pizza` storage variable has been incremented by 1.

### `test_set_as_new_owner_direct()`

```rust,noplayground
{{#include ../listings/ch17-starknet-smart-contracts-security/listing_02_pizza_factory_snfoundry/src/tests/foundry_test.cairo:test_4}}
```

In this test function, we directly create an instance of the contract state using `contract_state_for_testing` function and access the internal functions of the contract instead of declaring/deploying the contract first.

We first have to import the following to properly access the contract state:

```rust,noplayground
    use pizza::PizzaFactory::ownerContractMemberStateTrait;
    use pizza::PizzaFactory::{InternalTrait};
```

The imports gives us access to our internal functions and the read/write access to `owner` storage variable.

We are grabbing the contract state directly and changing the address of the owner by using `.write` method on our `owner` storage variable. Then, we validate to see whether the owner has been updated.

Once the test cases have successfully passed, you will see the following output:

```bash,noplayground
Running 4 test(s) from src/
[PASS] source::tests::foundry_test::foundry_test::test_set_as_new_owner_direct (gas: ~129)
[PASS] source::tests::foundry_test::foundry_test::test_deploy (gas: ~366)
[PASS] source::tests::foundry_test::foundry_test::test_set_as_new_owner (gas: ~300)
[PASS] source::tests::foundry_test::foundry_test::capture_pizza_emission_event (gas: ~370)
Tests: 4 passed, 0 failed, 0 skipped, 0 ignored, 0 filtered out
```

To learn more, check out the official [Starknet Foundry documentation](https://foundry-rs.github.io/starknet-foundry/index.html)
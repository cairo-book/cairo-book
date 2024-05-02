# Testing Smart Contracts

Testing smart contracts is a critical part of the development process. It is important to ensure that the smart contract behaves as expected and that it is secure.

In this section, we will give a brief overview of how to test Cairo smart contracts using Native Test Runner and Starknet Foundry

We will be testing the following `PizzaFactory` contract:

```rust
use starknet::ContractAddress;

#[starknet::interface]
pub trait IPizzaFactory<TContractState> {
    fn increase_pepperoni(ref self: TContractState, amount: u32);
    fn increase_pineapple(ref self: TContractState, amount: u32);
    fn make_pizza(ref self: TContractState);
    fn count_pizza(self: @TContractState) -> u32;
    fn get_owner(self: @TContractState) -> ContractAddress;
    fn change_owner(ref self: TContractState, new_owner: ContractAddress);
}

#[starknet::contract]
pub mod PizzaFactory {
    use super::IPizzaFactory;
    use starknet::ContractAddress;
    use starknet::get_caller_address;

    #[storage]
    pub struct Storage {
        pepperoni: u32,
        pineapple: u32,
        owner: ContractAddress,
        pizzas: u32
    }

    #[constructor]
    pub fn constructor(ref self: ContractState, owner: ContractAddress) {
        self.pepperoni.write(10);
        self.pineapple.write(10);
        self.owner.write(owner);
    }


    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {
        PizzaEmission: PizzaEmission
    }

    #[derive(Drop, starknet::Event)]
    pub struct PizzaEmission {
        pub counter: u32
    }

    #[abi(embed_v0)]
    pub impl PizzaFactoryimpl of super::IPizzaFactory<ContractState> {
        fn increase_pepperoni(ref self: ContractState, amount: u32) {
            assert(amount != 0, 'Amount cannot be 0');
            self.pepperoni.write(self.pepperoni.read() + amount);
        }

        fn increase_pineapple(ref self: ContractState, amount: u32) {
            assert(amount != 0, 'Amount cannot be 0');
            self.pineapple.write(self.pineapple.read() + amount);
        }

        fn make_pizza(ref self: ContractState) {
            assert(self.pepperoni.read() > 0, 'Not enough pepperoni');
            assert(self.pineapple.read() > 0, 'Not enough pineapple');

            let caller: ContractAddress = get_caller_address();
            let owner: ContractAddress = self.get_owner();

            assert(caller == owner, 'Only the owner can make pizza');

            self.pepperoni.write(self.pepperoni.read() - 1);
            self.pineapple.write(self.pineapple.read() - 1);
            self.pizzas.write(self.pizzas.read() + 1);

            self.emit(PizzaEmission { counter: self.pizzas.read()});
        }

        fn get_owner(self: @ContractState) -> ContractAddress {
            self.owner.read()
        }

        fn change_owner(ref self: ContractState, new_owner: ContractAddress) {
            self.set_owner(new_owner);
        }

        fn count_pizza(self: @ContractState) -> u32 {
            self.pizzas.read()
        }
    }

    #[generate_trait]
    pub impl InternalImpl of InternalTrait {
        fn set_owner(ref self: ContractState, new_owner: ContractAddress) {
            let caller: ContractAddress = get_caller_address();
            assert(caller == self.get_owner(), 'Only owner can change');

            self.owner.write(new_owner);
        }
    }
}
```

We will first start with Native Test Runner.

## Testing Smart Contracts with Native Test Runner

Native Test Runner is a built-in testing tool with `Scarb` and with usage from native libraries from `starknet` which means you can test your cairo contract without any additional installation.

This is the command to run your test contract.

```cairo
scarb cairo-test
```

Let's look at how we can test our `PizzaFactory` contract using Native Test Runner

Full overview of our test contract:

```rust
#[test]
mod native_test {
    use source::pizza::{
        IPizzaFactory, PizzaFactory, IPizzaFactoryDispatcher, IPizzaFactoryDispatcherTrait
    };

    use starknet::{
        ContractAddress, get_caller_address, get_contract_address, contract_address_const
    };

    use starknet::SyscallResultTrait;
    use starknet::syscalls::deploy_syscall;

    use starknet::testing::{set_contract_address};


    fn deploy(owner_address: ContractAddress) -> IPizzaFactoryDispatcher {
        let mut calldata = array![];
        owner_address.serialize(ref calldata);

        let class_hash = PizzaFactory::TEST_CLASS_HASH.try_into().unwrap();

        let (contract_address, _) = deploy_syscall(class_hash, 0, calldata.span(), false)
            .unwrap_syscall();

        IPizzaFactoryDispatcher { contract_address }
    }

    #[test]
    #[available_gas(20000000)]
    fn test_deploy() {
        let owner = contract_address_const::<1>();
        let contract = deploy(owner);

        assert(contract.get_owner() == owner, 'wrong owner');
    }

    #[test]
    #[available_gas(20000000)]
    fn test_set_as_new_owner() {
        let owner = contract_address_const::<1>();
        let new_owner = contract_address_const::<2>();
        let contract = deploy(owner);
        assert(contract.get_owner() == owner, 'incorrect owner');

        set_contract_address(owner);
        contract.change_owner(new_owner);

        assert(contract.get_owner() == new_owner, 'incorrect owner');
    }

    #[test]
    #[should_panic]
    #[available_gas(20000000)]
    fn test_set_not_owner() {
        let owner = contract_address_const::<1>();
        let not_owner = contract_address_const::<2>();

        let contract = deploy(owner);
        assert(contract.get_owner() == not_owner, 'incorrect owner');

        set_contract_address(not_owner);
        contract.make_pizza();
    }

    #[test]
    #[available_gas(20000000)]
    fn test_pizza_creation() {
        let owner = contract_address_const::<1>();
        let contract = deploy(owner);
        assert(contract.get_owner() == owner, 'incorrect owner');

        set_contract_address(owner);
        contract.make_pizza();
        assert(contract.count_pizza() == 1, 'incorrect pizza count')
    }
}
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

    #[test]
    #[available_gas(20000000)]
    fn test_deploy() {
        let owner = contract_address_const::<1>();
        let contract = deploy(owner);

        assert(contract.get_owner() == owner, 'wrong owner');
    }

```

On here, we first create an instance of contract with the `owner` address.
We will then, set the dispatcher to the `contract` variable.

We then use `.get_owner()` function to assert that the owner of the contract is the same as the owner we passed in.

### `test_set_as_new_owner() && test_set_not_owner()`

```rust
    #[test]
    #[available_gas(20000000)]
    fn test_set_as_new_owner() {
        let owner = contract_address_const::<1>();
        let new_owner = contract_address_const::<2>();
        let contract = deploy(owner);
        assert(contract.get_owner() == owner, 'incorrect owner');

        set_contract_address(owner);
        contract.change_owner(new_owner);

        assert(contract.get_owner() == new_owner, 'incorrect owner');
    }

    #[test]
    #[should_panic]
    #[available_gas(20000000)]
    fn test_set_not_owner() {
        let owner = contract_address_const::<1>();
        let not_owner = contract_address_const::<2>();

        let contract = deploy(owner);
        assert(contract.get_owner() == not_owner, 'incorrect owner');

        set_contract_address(not_owner);
        contract.make_pizza();
    }
```

The first function, `test_set_as_new_owner`, we declare two different contract addresses.

We first deploy with the contract with the `owner` address and we validate to see if the contract owner is the same as the `owner` address.
Then, we change the owner address to `new_owner` and we validate to see if the owner address has been changed.

Second function, `test_set_not_owner`, we are utilizing the `[should_panic]` attribute to expect the test function to panic since `make_pizza` function can only be called by the contract owner. In this case, the test will panic since we set the caller to be `not_owner` address.

### `test_pizza_creation()`

```rust
    #[test]
    #[available_gas(20000000)]
    fn test_pizza_creation() {
        let owner = contract_address_const::<1>();
        let contract = deploy(owner);
        assert(contract.get_owner() == owner, 'incorrect owner');

        set_contract_address(owner);
        contract.make_pizza();
        assert(contract.count_pizza() == 1, 'incorrect pizza count')
    }
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

Let's look at our test contract:

```rust
#[test]
mod foundry_test {
    use starknet::{ContractAddress, contract_address_const};

    use snforge_std::{
        declare, ContractClassTrait, ContractClass, start_prank, stop_prank, CheatTarget, Event,
        SpyOn, EventSpy, EventAssertions, spy_events, EventFetcher
    };

    use source::pizza::{
        IPizzaFactoryDispatcher, IPizzaFactorySafeDispatcher, IPizzaFactoryDispatcherTrait
    };

    use source::pizza;

    use core::traits::{TryInto, Into};
    use core::num::traits::Zero;

    use pizza::PizzaFactory::ownerContractMemberStateTrait;
    use pizza::PizzaFactory::{InternalTrait};

    fn deploy_contract(name: ByteArray) -> ContractAddress {
        let contract = declare(name).unwrap();
        let owner: ContractAddress = contract_address_const::<'owner'>();

        let mut constructor_calldata = array![owner.into()];

        let (contract_address, _) = contract.deploy(@constructor_calldata).unwrap();

        contract_address
    }

    #[test]
    fn test_deploy() {
        let contract_address = deploy_contract("PizzaFactory");

        let dispatcher = IPizzaFactoryDispatcher { contract_address };

        let owner_check: ContractAddress = contract_address_const::<'owner'>();

        assert(dispatcher.get_owner() == owner_check, 'owner is not the same');

        start_prank(CheatTarget::One(contract_address), owner_check);

        dispatcher.make_pizza();

        assert(dispatcher.count_pizza() == 1, 'pizza count is not 1');
    }


    #[test]
    fn test_set_as_new_owner() {
        let contract_address = deploy_contract("PizzaFactory");

        let dispatcher = IPizzaFactoryDispatcher { contract_address };

        let owner_check: ContractAddress = contract_address_const::<'owner'>();
        let new_owner: ContractAddress = contract_address_const::<'new_owner'>();
        assert(dispatcher.get_owner() == owner_check, 'owner is not the same');

        start_prank(CheatTarget::One(contract_address), owner_check);

        dispatcher.change_owner(new_owner);

        assert(dispatcher.get_owner() == new_owner, 'owner is not the same');
    }

    #[test]
    fn capture_pizza_emission_event() {
        let contract_address = deploy_contract("PizzaFactory");

        let dispatcher = IPizzaFactoryDispatcher { contract_address };

        let owner = dispatcher.get_owner();

        start_prank(CheatTarget::One(contract_address), owner);

        let mut spy = spy_events(SpyOn::One(contract_address));

        dispatcher.make_pizza();

        assert(spy.events.len() == 1, 'events length is not 1');

        spy
            .assert_emitted(
                @array![
                    (
                        contract_address,
                        pizza::PizzaFactory::Event::PizzaEmission(
                            pizza::PizzaFactory::PizzaEmission { counter: dispatcher.count_pizza() }
                        )
                    )
                ]
            );

        assert(dispatcher.count_pizza() == 1, 'pizza count is not 1');
    }
    #[test]
    fn test_set_as_new_owner_direct() {
        let mut state = pizza::PizzaFactory::contract_state_for_testing();
        let owner: ContractAddress = contract_address_const::<'owner'>();
        state.owner.write(owner);
        assert(state.owner.read() == owner, 'owner is not the same');
    }
}
```

The flow of deployment process is as follows:

1. Retrieve contract class hash from `declare` function
2. Create an array of constructor arguments for the contract
3. Deploy the contract using `deploy` method and destructure the contract address and return the address

Let's look at each test function in detail:

### `test_deploy()`

```rust
    #[test]
    fn test_deploy() {
        let contract_address = deploy_contract("PizzaFactory");

        let dispatcher = IPizzaFactoryDispatcher { contract_address };

        let owner_check: ContractAddress = contract_address_const::<'owner'>();

        assert(dispatcher.get_owner() == owner_check, 'owner is not the same');

        start_prank(CheatTarget::One(contract_address), owner_check);

        dispatcher.make_pizza();

        assert(dispatcher.count_pizza() == 1, 'pizza count is not 1');
    }
```

After we deploy our contract and setup the dispatcher, we use cheatcodes to manipulate the contract state. We use the `start_prank` cheatcode to target the deployed contract and et the caller address to be the owner's address. We then call the `make_pizza` function and validate to see if the `pizza` count has been incremented by 1.

To learn more about cheatcodes, check out the [Cheatcode Section](https://foundry-rs.github.io/starknet-foundry/testing/using-cheatcodes.html)

### `test_set_as_new_owner()`

```rust
    #[test]
    fn test_set_as_new_owner() {
        let contract_address = deploy_contract("PizzaFactory");

        let dispatcher = IPizzaFactoryDispatcher { contract_address };

        let owner_check: ContractAddress = contract_address_const::<'owner'>();
        let new_owner: ContractAddress = contract_address_const::<'new_owner'>();
        assert(dispatcher.get_owner() == owner_check, 'owner is not the same');

        start_prank(CheatTarget::One(contract_address), owner_check);

        dispatcher.change_owner(new_owner);

        assert(dispatcher.get_owner() == new_owner, 'owner is not the same');
    }
```

On here, our goal is to test the `change_owner` function. We deploy the contract and using `stark_prank` cheatcode, we call the `change_owner` function as the owner and we validate to see if the owner has been changed.

### `capture_pizza_emission_event()`

```rust
    #[test]
    fn capture_pizza_emission_event() {
        let contract_address = deploy_contract("PizzaFactory");

        let dispatcher = IPizzaFactoryDispatcher { contract_address };

        let owner = dispatcher.get_owner();

        start_prank(CheatTarget::One(contract_address), owner);

        let mut spy = spy_events(SpyOn::One(contract_address));

        dispatcher.make_pizza();

        spy
            .assert_emitted(
                @array![
                    (
                        contract_address,
                        pizza::PizzaFactory::Event::PizzaEmission(
                            pizza::PizzaFactory::PizzaEmission { counter: dispatcher.count_pizza() }
                        )
                    )
                ]
            );

        assert(dispatcher.count_pizza() == 1, 'pizza count is not 1');
    }
```

On here, we are testing the event emission of the `make_pizza` function. After deployment, we use `stark_prank` cheatcode to target the deployed contract with owner as the caller, we call the `make_pizza` function to validate if the event has been emitted and the pizza count has been incremented by 1.

We use the `spy_events` method to capture contract events and we provide the expected event parameters on `assert_emitted` method.

Lastly, we make sure that the `pizza` storage variable has been incremented by 1.

### `test_set_as_new_owner_direct()`

```rust
    #[test]
    fn test_set_as_new_owner_direct() {
        let mut state = pizza::PizzaFactory::contract_state_for_testing();
        let owner: ContractAddress = contract_address_const::<'owner'>();
        state.owner.write(owner);
        assert(state.owner.read() == owner, 'owner is not the same');
    }
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

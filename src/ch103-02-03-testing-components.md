# Testing Components

Testing components is a bit different than testing contracts.
Contracts need to be tested against a specific state, which can be achieved by either deploying the contract in a test, or by simply getting the `ContractState` object and modifying it in the context of your tests.

Components are a generic construct, meant to be integrated in contracts, that can't be deployed on their own and don't have a `ContractState` object that we could use. So how do we test them?

Let's consider that we want to test a very simple component called "Counter", that will allow each contract to have a counter that can be incremented. The component is defined in Listing 17-2:

```cairo, noplayground
#[starknet::component]
pub mod CounterComponent {
    use core::starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess};

    #[storage]
    pub struct Storage {
        value: u32,
    }

    #[embeddable_as(CounterImpl)]
    impl Counter<
        TContractState, +HasComponent<TContractState>,
    > of super::ICounter<ComponentState<TContractState>> {
        fn get_counter(self: @ComponentState<TContractState>) -> u32 {
            self.value.read()
        }

        fn increment(ref self: ComponentState<TContractState>) {
            self.value.write(self.value.read() + 1);
        }
    }
}
```

<span class="caption">Listing 17-2: A simple Counter component</span>

## Testing the Component by Deploying a Mock Contract

The easiest way to test a component is to integrate it within a mock contract. This mock contract is only used for testing purposes, and only integrates the component you want to test. This allows you to test the component in the context of a contract, and to use a Dispatcher to call the component's entry points.

We can define such a mock contract as follows:

```cairo, noplayground
#[starknet::contract]
mod MockContract {
    use super::counter::CounterComponent;

    component!(path: CounterComponent, storage: counter, event: CounterEvent);

    #[storage]
    struct Storage {
        #[substorage(v0)]
        counter: CounterComponent::Storage,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        CounterEvent: CounterComponent::Event,
    }

    #[abi(embed_v0)]
    impl CounterImpl = CounterComponent::CounterImpl<ContractState>;
}
```

This contract is entirely dedicated to testing the `Counter` component. It embeds the component with the `component!` macro, exposes the component's entry points by annotating the impl aliases with `#[abi(embed_v0)]`.

We also need to define an interface that will be required to interact externally with this mock contract.

```cairo, noplayground
#[starknet::interface]
pub trait ICounter<TContractState> {
    fn get_counter(self: @TContractState) -> u32;
    fn increment(ref self: TContractState);
}
```

We can now write tests for the component by deploying this mock contract and calling its entry points, as we would with a typical contract.

```cairo, noplayground
use super::MockContract;
use super::counter::{ICounterDispatcher, ICounterDispatcherTrait};
use core::starknet::syscalls::deploy_syscall;
use core::starknet::SyscallResultTrait;

fn setup_counter() -> ICounterDispatcher {
    let (address, _) = deploy_syscall(
        MockContract::TEST_CLASS_HASH.try_into().unwrap(), 0, array![].span(), false,
    )
        .unwrap_syscall();
    ICounterDispatcher { contract_address: address }
}

#[test]
fn test_constructor() {
    let counter = setup_counter();
    assert_eq!(counter.get_counter(), 0);
}

#[test]
fn test_increment() {
    let counter = setup_counter();
    counter.increment();
    assert_eq!(counter.get_counter(), 1);
}
```

## Testing Components Without Deploying a Contract

In [Components under the hood][components inner working], we saw that components leveraged genericity to define storage and logic that could be embedded in multiple contracts. If a contract embeds a component, a `HasComponent` trait is created in this contract, and the component methods are made available.

This informs us that if we can provide a concrete `TContractState` that implements the `HasComponent` trait to the `ComponentState` struct, we should be able to directly invoke the methods of the component using this concrete `ComponentState` object, without having to deploy a mock. This is an essential feature that developers can leverage.

When it comes to [composability and components][composability and components], the number of components we implement will likely be directly proportional to the size and complexity of the project. It is possible to test all the components to ensure their initializers, events, internal, and external functions are working as expected. Although we still require a mock, there is no need fo deployment and thus we would struggle to implement dispatchers in this section.

Let's see how we can do that by using type aliases. We still need to define a mock contract - for this case, we will use the ownable_component we created in the previous section [composability and components][composability and components]. For easy reference, the ownable_component is shown below:

```cairo, noplayground
use starknet::ContractAddress;

#[starknet::interface]
trait IOwnable<TContractState> {
    fn owner(self: @TContractState) -> ContractAddress;
    fn transfer_ownership(ref self: TContractState, new_owner: ContractAddress);
    fn renounce_ownership(ref self: TContractState);
}

pub mod Errors {
    pub const ZERO_ADDRESS_OWNER: felt252 = 'New owner is the zero address';
    pub const NOT_OWNER: felt252 = 'Not owner';
    pub const ZERO_ADDRESS_CALLER: felt252 = 'Caller is the zero address';
}

#[starknet::component]
pub mod ownable_component {
    use core::starknet::{ContractAddress, get_caller_address};
    use core::starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess};
    use super::Errors;
    use core::num::traits::Zero;

    #[storage]
    pub struct Storage {
        owner: ContractAddress,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {
        OwnershipTransferred: OwnershipTransferred,
    }

    #[derive(Drop, starknet::Event)]
    pub struct OwnershipTransferred {
        pub previous_owner: ContractAddress,
        pub new_owner: ContractAddress,
    }

    #[embeddable_as(Ownable)]
    pub impl OwnableImpl<
        TContractState, +HasComponent<TContractState>,
    > of super::IOwnable<ComponentState<TContractState>> {
        fn owner(self: @ComponentState<TContractState>) -> ContractAddress {
            self.owner.read()
        }

        fn transfer_ownership(
            ref self: ComponentState<TContractState>, new_owner: ContractAddress,
        ) {
            assert(!new_owner.is_zero(), Errors::ZERO_ADDRESS_OWNER);
            self.assert_only_owner();
            self._transfer_ownership(new_owner);
        }

        fn renounce_ownership(ref self: ComponentState<TContractState>) {
            self.assert_only_owner();
            self._transfer_ownership(Zero::zero());
        }
    }

    #[generate_trait]
    pub impl InternalImpl<
        TContractState, +HasComponent<TContractState>,
    > of InternalTrait<TContractState> {
        fn initializer(ref self: ComponentState<TContractState>, owner: ContractAddress) {
            self._transfer_ownership(owner);
        }

        fn assert_only_owner(self: @ComponentState<TContractState>) {
            let owner: ContractAddress = self.owner.read();
            let caller: ContractAddress = get_caller_address();
            assert(!caller.is_zero(), Errors::ZERO_ADDRESS_CALLER);
            assert(caller == owner, Errors::NOT_OWNER);
        }

        fn _transfer_ownership(
            ref self: ComponentState<TContractState>, new_owner: ContractAddress,
        ) {
            let previous_owner: ContractAddress = self.owner.read();
            self.owner.write(new_owner);
            self
                .emit(
                    OwnershipTransferred { previous_owner: previous_owner, new_owner: new_owner },
                );
        }
    }
}

```

We still need a mock contract, only this time, we will skip the deployment step. This means that we can get away with not defining any trait or impl for our mock contract. Below is a simple mock that embeds the `ownable_component` and facilitates the testing process.

```cairo, noplayground
#[starknet::contract]
pub mod OwnableMock {
    use contracts::components::ownable::ownable_component;

    component!(path: ownable_component, storage: ownable, event: OwnableEvent);

    #[abi(embed_v0)]
    impl OwnableImpl = ownable_component::Ownable<ContractState>;

    impl OwnableInternalImpl = ownable_component::InternalImpl<ContractState>;

    #[storage]
    struct Storage {
        counter: u128,
        #[substorage(v0)]
        ownable: ownable_component::Storage,
    }


    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {
        OwnableEvent: ownable_component::Event,
    }
}

```

To proceed with the testing process, first, we need to define a concrete implementation of the generic `ComponentState` type using a type alias. We will use the `OwnableMock::ContractState` type to do so.

```cairo, noplayground
use ownable_component::InternalTrait;
use contracts::components::ownable::ownable_component;
use ownable_component::{OwnableImpl};
use contracts::test::mocks::ownable::OwnableMock;
use snforge_std::{test_address, start_cheat_caller_address};
use core::num::traits::Zero;
use starknet::{ContractAddress};

type ComponentState = ownable_component::ComponentState<OwnableMock::ContractState>;
```
We will then define and initialize the component's state using its initializer. There is access to both the contract's state and component's state. We will define both for future tests

```cairo, noplayground
fn COMPONENT_STATE() -> ComponentState {
    ownable_component::component_state_for_testing()
} 

fn CONTRACT_STATE() -> OwnableMock::ContractState {
    OwnableMock::contract_state_for_testing()
}

fn setup_function() -> ComponentState {
    let mut state = COMPONENT_STATE();
    state.initializer(FIRST_OWNER.try_into().unwrap());
    state
}
```

We defined the _ComponentState_ type as an alias of the `CounterComponent::ComponentState<OwnableMock::ContractState>` type. By passing the `OwnableMock::ContractState` type as a concrete type for `ComponentState`, we aliased a concrete implementation of the `ComponentState` struct to _ComponentState_.

Because `OwnableMock` embeds `ownable_component`, the methods of `ownable_component` defined in the `OwnableImpl` and `InternalImpl` blocks can now be used on a `ComponentState` (aliased) object.

Now that we have made these methods available, we need to instantiate an object of type _ComponentState_, that we will use to test the component. We can do so by calling the `component_state_for_testing` function, which automatically infers that it should return an object of type _ComponentState_.

Let's summarize what we've done so far:

- We defined a mock contract that embeds the component we want to test.
- We defined a concrete implementation of `ComponentState<TContractState>` using a type alias with `OwnableMock::ContractState`, that we named `ComponentState`.
- We defined a function that uses `component_state_for_testing` to return a _ComponentState_ object.


> **NOTE:** _ComponentState_ is the alias while `ComponentState` is the component itself. I have used the same name as it is the good convention to know the state we are working with.


We can now write tests for the component by calling its functions directly, without having to deploy a mock contract. This approach is more lightweight than the previous one, and it allows testing internal functions of the component that are not exposed to the outside world trivially.

```cairo, noplayground
// test functions
#[test]
fn test_initializer_owner() {
    let mut component_state = COMPONENT_STATE();
    let owner = FIRST_OWNER.try_into().unwrap();

    let current_owner = component_state.owner.read();
    assert!(current_owner.is_zero());

    component_state.initializer(owner);
    let new_owner: ContractAddress = component_state.owner.read();
    assert_eq!(new_owner, owner);
}

#[test]
fn test_assert_only_owner() {
    let state = setup_function();
    start_cheat_caller_address(test_address(), FIRST_OWNER.try_into().unwrap());
    state.assert_only_owner();
}

#[test]
fn test__transfer_ownership() {
    let mut component_state = setup_function();
    let first_owner = component_state.owner.read();
    let second_owner: ContractAddress = SECOND_OWNER.try_into().unwrap();
    component_state._transfer_ownership(second_owner);
    println!("Previous Owner: {:?}", first_owner);
    println!("New Owner: {:?}", second_owner);
    let current_owner = component_state.owner.read();
    assert_eq!(current_owner, second_owner);
}

#[test]
fn test_renounce_ownership() {
    let mut component_state = setup_function();
    let contract_address = test_address();
    let first_owner = component_state.owner.read();
    start_cheat_caller_address(contract_address, first_owner);
    component_state.renounce_ownership();
    println!("Previous Owner: {:?}", first_owner);
    println!("New Owner: {:?}", component_state.owner());
    assert!(component_state.owner().is_zero());
} 
```

The full test code

```cairo, noplayground
use ownable_component::InternalTrait;
use contracts::components::ownable::ownable_component;
use ownable_component::{OwnableImpl};
use contracts::test::mocks::ownable::OwnableMock;
use snforge_std::{test_address, start_cheat_caller_address};
use core::num::traits::Zero;
use starknet::{ContractAddress};

const FIRST_OWNER: felt252 = 0x05FB10d2d3db05a1E8b32945b2639DcE6b7E99fc7b27AB7964F5fD267F8f3A95;
const SECOND_OWNER: felt252 = 0x03354A8398e0cF848817F96E3Cc96C860342f184Fd5D2d59D45868b6bd1DE0a7;

// setting up types and states
type ComponentState = ownable_component::ComponentState<OwnableMock::ContractState>;

fn COMPONENT_STATE() -> ComponentState {
    ownable_component::component_state_for_testing()
} 

fn CONTRACT_STATE() -> OwnableMock::ContractState {
    OwnableMock::contract_state_for_testing()
}

fn setup_function() -> ComponentState {
    let mut state = COMPONENT_STATE();
    state.initializer(FIRST_OWNER.try_into().unwrap());
    state
}

// test functions
#[test]
fn test_initializer_owner() {
    let mut component_state = COMPONENT_STATE();
    let owner = FIRST_OWNER.try_into().unwrap();

    let current_owner = component_state.owner.read();
    assert!(current_owner.is_zero());

    component_state.initializer(owner);
    let new_owner: ContractAddress = component_state.owner.read();
    assert_eq!(new_owner, owner);
}

#[test]
fn test_assert_only_owner() {
    let state = setup_function();
    start_cheat_caller_address(test_address(), FIRST_OWNER.try_into().unwrap());
    state.assert_only_owner();
}

#[test]
fn test__transfer_ownership() {
    let mut component_state = setup_function();
    let first_owner = component_state.owner.read();
    let second_owner: ContractAddress = SECOND_OWNER.try_into().unwrap();
    component_state._transfer_ownership(second_owner);
    println!("Previous Owner: {:?}", first_owner);
    println!("New Owner: {:?}", second_owner);
    let current_owner = component_state.owner.read();
    assert_eq!(current_owner, second_owner);
}

#[test]
fn test_renounce_ownership() {
    let mut component_state = setup_function();
    let contract_address = test_address();
    let first_owner = component_state.owner.read();
    start_cheat_caller_address(contract_address, first_owner);
    component_state.renounce_ownership();
    println!("Previous Owner: {:?}", first_owner);
    println!("New Owner: {:?}", component_state.owner());
    assert!(component_state.owner().is_zero());
}
```

The result of the tests

```sh, noplayground
Collected 4 test(s) from contracts package
Running 4 test(s) from src/
Previous Owner: 2705158968017049126835271109420878898303234110662881980182880007268537940629
New Owner: 1451095717265679489962247702232587843827880064103521056910519710091057160359
[PASS] contracts::test::tests::test_ownable::test_assert_only_owner (gas: ~131)
[PASS] contracts::test::tests::test_ownable::test__transfer_ownership (gas: ~254)
Previous Owner: 2705158968017049126835271109420878898303234110662881980182880007268537940629
New Owner: 0
[PASS] contracts::test::tests::test_ownable::test_initializer_owner (gas: ~130)
[PASS] contracts::test::tests::test_ownable::test_renounce_ownership (gas: ~66)
Tests: 4 passed, 0 failed,
```

In this subsection, we explored yet another efficient way to test Starknet components - without deploying a mock contract. By leveraging Foundry's testing framework, cheat codes, and test addresses, developers can ensure the correctness of their smart contracts by testing every component individually embedded in the contract. 

The provided code samples illustrate these techniques in practice, showcasing how to validate the components' logic, modify the state, and simulate interactions to debug effectively.

[components inner working]: ./ch103-02-01-under-the-hood.md
[composability and components]: ./ch103-02-00-composability-and-components.md

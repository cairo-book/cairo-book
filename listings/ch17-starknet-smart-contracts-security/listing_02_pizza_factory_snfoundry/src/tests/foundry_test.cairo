use core::starknet::{ContractAddress, contract_address_const};
use snforge_std::{declare, start_cheat_caller_address, stop_cheat_caller_address, spy_events, load};
use source::pizza::{IPizzaFactoryDispatcher, IPizzaFactoryDispatcherTrait, PizzaFactory};
use source::pizza::PizzaFactory::{Event as PizzaEvents, PizzaEmission, InternalTrait};
//ANCHOR: import_internal

//ANCHOR_END: import_internal


use core::starknet::storage::StoragePointerReadAccess;



fn owner() -> ContractAddress {
    contract_address_const::<'owner'>()
}

//ANCHOR: deployment
fn deploy_pizza_factory() -> (IPizzaFactoryDispatcher, ContractAddress) {
    let contract = declare("PizzaFactory");
    let owner: ContractAddress = contract_address_const::<'owner'>();
    let constructor_calldata = array![owner.into()];
    let contract_address = contract.deploy(constructor_calldata).unwrap();
    let dispatcher = IPizzaFactoryDispatcher { contract_address };
    (dispatcher, contract_address)
}
//ANCHOR_END: deployment

//ANCHOR: test_constructor
#[test]
fn test_constructor() {
    let (pizza_factory, pizza_factory_address) = deploy_pizza_factory();

    let pepperoni_count = load(pizza_factory_address, selector!("pepperoni"), 1);
    let pineapple_count = load(pizza_factory_address, selector!("pineapple"), 1);
    assert_eq!(pepperoni_count[0], 10, "Pepperoni count should be 10");
    assert_eq!(pineapple_count[0], 10, "Pineapple count should be 10");
    assert_eq!(pizza_factory.get_owner(), owner(), "Owner should be set correctly");
}
//ANCHOR_END: test_constructor

//ANCHOR: test_owner
#[test]
fn test_change_owner_should_change_owner() {
    let (pizza_factory, pizza_factory_address) = deploy_pizza_factory();

    let new_owner: ContractAddress = contract_address_const::<'new_owner'>();
    assert_eq!(pizza_factory.get_owner(), owner(), "Initial owner should be set correctly");

    start_cheat_caller_address(pizza_factory_address, owner());

    pizza_factory.change_owner(new_owner);

    assert_eq!(pizza_factory.get_owner(), new_owner, "Owner should be changed to new_owner");
}

#[test]
#[should_panic(expected: ('Only the owner can set ownership',))]
fn test_change_owner_should_panic_when_not_owner() {
    let (pizza_factory, pizza_factory_address) = deploy_pizza_factory();
    let not_owner = contract_address_const::<'not_owner'>();
    start_cheat_caller_address(pizza_factory_address, not_owner);
    pizza_factory.change_owner(not_owner);
    stop_cheat_caller_address(pizza_factory_address);
}
//ANCHOR_END: test_owner

//ANCHOR: test_make_pizza
#[test]
#[should_panic(expected: ('Only the owner can make pizza',))]
fn test_make_pizza_should_panic_when_not_owner() {
    let (pizza_factory, pizza_factory_address) = deploy_pizza_factory();
    let not_owner = contract_address_const::<'not_owner'>();
    start_cheat_caller_address(pizza_factory_address, not_owner);

    pizza_factory.make_pizza();
}

#[test]
fn test_make_pizza_should_increment_pizza_counter() {
    let (pizza_factory, pizza_factory_address) = deploy_pizza_factory();
    start_cheat_caller_address(pizza_factory_address, owner());
    let _spy = spy_events(pizza_factory_address);

    pizza_factory.make_pizza();

    assert_eq!(pizza_factory.count_pizza(), 1, "Pizza counter should be incremented to 1");
}
//ANCHOR_END: test_make_pizza

//ANCHOR: test_internals
#[test]
fn test_set_as_new_owner_direct() {
    let mut state = PizzaFactory::contract_state_for_testing();
    let owner: ContractAddress = contract_address_const::<'owner'>();
    state.set_owner(owner);
    assert_eq!(state.owner.read(), owner, "Owner should be set correctly");
}
//ANCHOR_END: test_internals





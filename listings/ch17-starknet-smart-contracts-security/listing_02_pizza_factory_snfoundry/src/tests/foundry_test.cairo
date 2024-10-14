use source::pizza::{
    IPizzaFactoryDispatcher, IPizzaFactoryDispatcherTrait
};
use starknet::{ContractAddress, syscalls::deploy_syscall};
use snforge_std::{declare, ContractClassTrait};

// Helper function to get a consistent owner address
fn owner() -> ContractAddress {
    starknet::contract_address_const::<0x123456>()
}

// Helper function to deploy the PizzaFactory contract
fn deploy_pizza_factory() -> IPizzaFactoryDispatcher {
    let contract_class = declare("PizzaFactory");
    let contract_address = contract_class.deploy(@array![owner().into()]).unwrap();
    IPizzaFactoryDispatcher { contract_address }
}

#[test]
fn test_initial_state() {
    let pizza_factory = deploy_pizza_factory();
    
    assert(pizza_factory.get_owner() == owner(), 'Incorrect initial owner');
    assert(pizza_factory.count_pizza() == 0, 'Initial pizza count should be 0');
}

#[test]
fn test_increase_pepperoni() {
    let pizza_factory = deploy_pizza_factory();
    
    pizza_factory.increase_pepperoni(5);
    pizza_factory.make_pizza();
    assert(pizza_factory.count_pizza() == 1, 'Pizza count should be 1');
}

#[test]
fn test_increase_pineapple() {
    let pizza_factory = deploy_pizza_factory();
    
    pizza_factory.increase_pineapple(5);
    pizza_factory.make_pizza();
    assert(pizza_factory.count_pizza() == 1, 'Pizza count should be 1');
}

#[test]
fn test_change_owner() {
    let pizza_factory = deploy_pizza_factory();
    let new_owner = starknet::contract_address_const::<0x789abc>();
    
    pizza_factory.change_owner(new_owner);
    assert(pizza_factory.get_owner() == new_owner, 'Owner should be changed');
}

#[test]
fn test_make_multiple_pizzas() {
    let pizza_factory = deploy_pizza_factory();
    
    pizza_factory.increase_pepperoni(10);
    pizza_factory.increase_pineapple(10);
    
    pizza_factory.make_pizza();
    pizza_factory.make_pizza();
    pizza_factory.make_pizza();
    
    assert(pizza_factory.count_pizza() == 3, 'Pizza count should be 3');
}

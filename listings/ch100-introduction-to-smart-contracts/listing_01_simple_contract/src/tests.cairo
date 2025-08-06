use snforge_std::{ContractClassTrait, DeclareResultTrait, declare};
use super::{ISimpleStorageDispatcher, ISimpleStorageDispatcherTrait};

fn deploy_contract() -> ISimpleStorageDispatcher {
    let contract = declare("SimpleStorage").unwrap().contract_class();
    let constructor_calldata = array![];
    let (contract_address, _) = contract.deploy(@constructor_calldata).unwrap();
    ISimpleStorageDispatcher { contract_address }
}

#[test]
fn test_get_initial_value() {
    let dispatcher = deploy_contract();
    let value = dispatcher.get();
    assert_eq!(value, 0);
}

#[test]
fn test_set_and_get() {
    let dispatcher = deploy_contract();

    let test_value = 42_u128;
    dispatcher.set(test_value);

    let stored_value = dispatcher.get();
    assert_eq!(stored_value, test_value);
}

#[test]
fn test_set_multiple_times() {
    let dispatcher = deploy_contract();

    dispatcher.set(10);
    assert_eq!(dispatcher.get(), 10);

    dispatcher.set(20);
    assert_eq!(dispatcher.get(), 20);

    dispatcher.set(30);
    assert_eq!(dispatcher.get(), 30);
}

#[test]
fn test_set_max_value() {
    let dispatcher = deploy_contract();

    let max_value = 0xffffffffffffffffffffffffffffffff_u128;
    dispatcher.set(max_value);

    let stored_value = dispatcher.get();
    assert_eq!(stored_value, max_value);
}

#[test]
fn test_set_zero_after_non_zero() {
    let dispatcher = deploy_contract();

    dispatcher.set(100);
    assert_eq!(dispatcher.get(), 100);

    dispatcher.set(0);
    assert_eq!(dispatcher.get(), 0);
}

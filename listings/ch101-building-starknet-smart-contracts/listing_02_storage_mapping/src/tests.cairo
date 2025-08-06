use snforge_std::{
    ContractClassTrait, DeclareResultTrait, declare, start_cheat_caller_address,
    stop_cheat_caller_address,
};
use starknet::ContractAddress;
use super::{IUserValuesDispatcher, IUserValuesDispatcherTrait};

fn deploy_contract() -> IUserValuesDispatcher {
    let contract = declare("UserValues").unwrap().contract_class();
    let (contract_address, _) = contract.deploy(@array![]).unwrap();
    IUserValuesDispatcher { contract_address }
}

#[test]
fn test_get_initial_value() {
    let dispatcher = deploy_contract();
    let user_address: ContractAddress = 0x123.try_into().unwrap();

    let value = dispatcher.get(user_address);
    assert_eq!(value, 0);
}

#[test]
fn test_set_and_get() {
    let dispatcher = deploy_contract();
    let user_address: ContractAddress = 0x456.try_into().unwrap();

    start_cheat_caller_address(dispatcher.contract_address, user_address);
    let test_value = 42_u64;
    dispatcher.set(test_value);
    stop_cheat_caller_address(dispatcher.contract_address);

    let stored_value = dispatcher.get(user_address);
    assert_eq!(stored_value, test_value);
}

#[test]
fn test_multiple_users() {
    let dispatcher = deploy_contract();
    let user1_address: ContractAddress = 0x789.try_into().unwrap();
    let user2_address: ContractAddress = 0xabc.try_into().unwrap();
    let user3_address: ContractAddress = 0xdef.try_into().unwrap();

    start_cheat_caller_address(dispatcher.contract_address, user1_address);
    dispatcher.set(100);
    stop_cheat_caller_address(dispatcher.contract_address);

    start_cheat_caller_address(dispatcher.contract_address, user2_address);
    dispatcher.set(200);
    stop_cheat_caller_address(dispatcher.contract_address);

    start_cheat_caller_address(dispatcher.contract_address, user3_address);
    dispatcher.set(300);
    stop_cheat_caller_address(dispatcher.contract_address);

    assert_eq!(dispatcher.get(user1_address), 100);
    assert_eq!(dispatcher.get(user2_address), 200);
    assert_eq!(dispatcher.get(user3_address), 300);
}

#[test]
fn test_update_value() {
    let dispatcher = deploy_contract();
    let user_address: ContractAddress = 0x111.try_into().unwrap();

    start_cheat_caller_address(dispatcher.contract_address, user_address);

    dispatcher.set(50);
    assert_eq!(dispatcher.get(user_address), 50);

    dispatcher.set(75);
    assert_eq!(dispatcher.get(user_address), 75);

    dispatcher.set(100);
    assert_eq!(dispatcher.get(user_address), 100);

    stop_cheat_caller_address(dispatcher.contract_address);
}

#[test]
fn test_set_max_value() {
    let dispatcher = deploy_contract();
    let user_address: ContractAddress = 0x222.try_into().unwrap();

    start_cheat_caller_address(dispatcher.contract_address, user_address);
    let max_value = 0xffffffffffffffff_u64;
    dispatcher.set(max_value);
    stop_cheat_caller_address(dispatcher.contract_address);

    let stored_value = dispatcher.get(user_address);
    assert_eq!(stored_value, max_value);
}

#[test]
fn test_set_zero_after_non_zero() {
    let dispatcher = deploy_contract();
    let user_address: ContractAddress = 0x333.try_into().unwrap();

    start_cheat_caller_address(dispatcher.contract_address, user_address);

    dispatcher.set(1000);
    assert_eq!(dispatcher.get(user_address), 1000);

    dispatcher.set(0);
    assert_eq!(dispatcher.get(user_address), 0);

    stop_cheat_caller_address(dispatcher.contract_address);
}

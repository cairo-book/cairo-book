use snforge_std::{
    ContractClassTrait, DeclareResultTrait, declare, start_cheat_caller_address,
    stop_cheat_caller_address,
};
use starknet::ContractAddress;
use super::{INameRegistryDispatcher, INameRegistryDispatcherTrait};

fn deploy_contract() -> (INameRegistryDispatcher, ContractAddress) {
    let owner_address: ContractAddress = 0x123.try_into().unwrap();
    let owner_name = 'Alice';

    let contract = declare("NameRegistry").unwrap().contract_class();
    let mut constructor_calldata = array![];

    constructor_calldata.append(owner_address.into());
    constructor_calldata.append(owner_name);

    let (contract_address, _) = contract.deploy(@constructor_calldata).unwrap();
    (INameRegistryDispatcher { contract_address }, owner_address)
}

#[test]
fn test_constructor_sets_owner_name() {
    let (dispatcher, owner_address) = deploy_contract();

    let owner_name = dispatcher.get_name(owner_address);
    assert_eq!(owner_name, 'Alice');
}

#[test]
fn test_store_and_get_name() {
    let (dispatcher, _) = deploy_contract();

    let user_address: ContractAddress = 0x456.try_into().unwrap();
    let user_name = 'Bob';

    start_cheat_caller_address(dispatcher.contract_address, user_address);
    dispatcher.store_name(user_name);
    stop_cheat_caller_address(dispatcher.contract_address);

    let stored_name = dispatcher.get_name(user_address);
    assert_eq!(stored_name, user_name);
}

#[test]
fn test_store_multiple_names() {
    let (dispatcher, _) = deploy_contract();

    let user1_address: ContractAddress = 0x789.try_into().unwrap();
    let user1_name = 'Charlie';

    let user2_address: ContractAddress = 0xabc.try_into().unwrap();
    let user2_name = 'David';

    start_cheat_caller_address(dispatcher.contract_address, user1_address);
    dispatcher.store_name(user1_name);
    stop_cheat_caller_address(dispatcher.contract_address);

    start_cheat_caller_address(dispatcher.contract_address, user2_address);
    dispatcher.store_name(user2_name);
    stop_cheat_caller_address(dispatcher.contract_address);

    assert_eq!(dispatcher.get_name(user1_address), user1_name);
    assert_eq!(dispatcher.get_name(user2_address), user2_name);
}

#[test]
fn test_update_name() {
    let (dispatcher, _) = deploy_contract();

    let user_address: ContractAddress = 0xdef.try_into().unwrap();
    let initial_name = 'Eve';
    let updated_name = 'Eva';

    start_cheat_caller_address(dispatcher.contract_address, user_address);
    dispatcher.store_name(initial_name);
    dispatcher.store_name(updated_name);
    stop_cheat_caller_address(dispatcher.contract_address);

    let stored_name = dispatcher.get_name(user_address);
    assert_eq!(stored_name, updated_name);
}

#[test]
fn test_get_name_for_unregistered_address() {
    let (dispatcher, _) = deploy_contract();

    let unregistered_address: ContractAddress = 0x999.try_into().unwrap();
    let name = dispatcher.get_name(unregistered_address);

    assert_eq!(name, 0);
}

#[test]
fn test_store_empty_name() {
    let (dispatcher, _) = deploy_contract();

    let user_address: ContractAddress = 0xfff.try_into().unwrap();
    let empty_name = 0;

    start_cheat_caller_address(dispatcher.contract_address, user_address);
    dispatcher.store_name(empty_name);
    stop_cheat_caller_address(dispatcher.contract_address);

    let stored_name = dispatcher.get_name(user_address);
    assert_eq!(stored_name, empty_name);
}

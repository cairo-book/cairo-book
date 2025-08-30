use snforge_std::{
    ContractClassTrait, DeclareResultTrait, declare, start_cheat_caller_address,
    stop_cheat_caller_address,
};
use starknet::ContractAddress;
use super::SimpleStorage::Expiration;
use super::{ISimpleStorageDispatcher, ISimpleStorageDispatcherTrait};

fn deploy_contract() -> (ISimpleStorageDispatcher, ContractAddress) {
    let owner_address: ContractAddress = 0x123.try_into().unwrap();
    let owner_name = 'Alice';

    let contract = declare("SimpleStorage").unwrap().contract_class();
    let mut constructor_calldata = array![];

    constructor_calldata.append(owner_address.into());
    constructor_calldata.append(owner_name);

    let (contract_address, _) = contract.deploy(@constructor_calldata).unwrap();
    (ISimpleStorageDispatcher { contract_address }, owner_address)
}

#[test]
fn test_get_owner_name() {
    let (dispatcher, _) = deploy_contract();

    let owner_name = dispatcher.get_owner_name();
    assert_eq!(owner_name, 'Alice');
}

#[test]
fn test_default_expiration() {
    let (dispatcher, _) = deploy_contract();

    let expiration = dispatcher.get_expiration();
    match expiration {
        Expiration::Infinite => {},
        Expiration::Finite(_) => panic!("Default expiration should be Infinite"),
    }
}

#[test]
fn test_change_expiration_as_owner() {
    let (dispatcher, owner_address) = deploy_contract();

    start_cheat_caller_address(dispatcher.contract_address, owner_address);
    let new_expiration = Expiration::Finite(1000_u64);
    dispatcher.change_expiration(new_expiration);
    stop_cheat_caller_address(dispatcher.contract_address);

    let expiration = dispatcher.get_expiration();
    match expiration {
        Expiration::Finite(time) => assert_eq!(time, 1000_u64),
        Expiration::Infinite => panic!("Expiration should be Finite"),
    }
}

#[test]
#[should_panic]
fn test_change_expiration_as_non_owner() {
    let (dispatcher, _) = deploy_contract();

    let non_owner: ContractAddress = 0x456.try_into().unwrap();
    start_cheat_caller_address(dispatcher.contract_address, non_owner);
    let new_expiration = Expiration::Finite(500_u64);
    dispatcher.change_expiration(new_expiration);
    stop_cheat_caller_address(dispatcher.contract_address);
}

#[test]
fn test_change_expiration_multiple_times() {
    let (dispatcher, owner_address) = deploy_contract();

    start_cheat_caller_address(dispatcher.contract_address, owner_address);

    dispatcher.change_expiration(Expiration::Finite(100_u64));
    let expiration = dispatcher.get_expiration();
    match expiration {
        Expiration::Finite(time) => assert_eq!(time, 100_u64),
        Expiration::Infinite => panic!("Should be Finite"),
    }

    dispatcher.change_expiration(Expiration::Finite(200_u64));
    let expiration = dispatcher.get_expiration();
    match expiration {
        Expiration::Finite(time) => assert_eq!(time, 200_u64),
        Expiration::Infinite => panic!("Should be Finite"),
    }

    dispatcher.change_expiration(Expiration::Infinite);
    let expiration = dispatcher.get_expiration();
    match expiration {
        Expiration::Infinite => {},
        Expiration::Finite(_) => panic!("Should be Infinite"),
    }

    stop_cheat_caller_address(dispatcher.contract_address);
}

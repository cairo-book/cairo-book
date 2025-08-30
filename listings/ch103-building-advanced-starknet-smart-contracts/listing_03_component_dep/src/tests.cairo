// Since IOwnable is defined inside the component, we need to access it through the component
use listing_03_component_dep::owner::{IOwnableDispatcher, IOwnableDispatcherTrait};
use snforge_std::{
    ContractClassTrait, DeclareResultTrait, declare, start_cheat_caller_address,
    stop_cheat_caller_address,
};
use starknet::ContractAddress;

fn deploy_contract() -> (IOwnableDispatcher, ContractAddress) {
    let owner_address: ContractAddress = 0x123.try_into().unwrap();

    let contract = declare("OwnableCounter").unwrap().contract_class();

    // Deploy with owner initialization in mind
    let constructor_args = @array![owner_address.into()];
    let (deployed_address, _) = contract.deploy(constructor_args).unwrap();

    (IOwnableDispatcher { contract_address: deployed_address }, owner_address)
}

#[test]
fn test_initial_owner() {
    let (dispatcher, owner_address) = deploy_contract();

    let current_owner = dispatcher.owner();
    assert_eq!(current_owner, owner_address);
}

#[test]
fn test_transfer_ownership() {
    let (dispatcher, owner_address) = deploy_contract();
    let new_owner: ContractAddress = 0x789.try_into().unwrap();

    start_cheat_caller_address(dispatcher.contract_address, owner_address);
    dispatcher.transfer_ownership(new_owner);
    stop_cheat_caller_address(dispatcher.contract_address);

    let current_owner = dispatcher.owner();
    assert_eq!(current_owner, new_owner);
}

#[test]
#[should_panic]
fn test_transfer_ownership_as_non_owner() {
    let (dispatcher, _) = deploy_contract();

    let non_owner: ContractAddress = 0x456.try_into().unwrap();
    let new_owner: ContractAddress = 0x789.try_into().unwrap();

    start_cheat_caller_address(dispatcher.contract_address, non_owner);
    dispatcher.transfer_ownership(new_owner);
    stop_cheat_caller_address(dispatcher.contract_address);
}

#[test]
#[should_panic]
fn test_transfer_ownership_to_zero() {
    let (dispatcher, owner_address) = deploy_contract();
    let zero_address: ContractAddress = 0x0.try_into().unwrap();

    start_cheat_caller_address(dispatcher.contract_address, owner_address);
    dispatcher.transfer_ownership(zero_address);
    stop_cheat_caller_address(dispatcher.contract_address);
}

#[test]
fn test_renounce_ownership() {
    let (dispatcher, owner_address) = deploy_contract();

    start_cheat_caller_address(dispatcher.contract_address, owner_address);
    dispatcher.renounce_ownership();
    stop_cheat_caller_address(dispatcher.contract_address);

    let current_owner = dispatcher.owner();
    let zero_address: ContractAddress = 0x0.try_into().unwrap();
    assert_eq!(current_owner, zero_address);
}

#[test]
#[should_panic]
fn test_renounce_ownership_as_non_owner() {
    let (dispatcher, _) = deploy_contract();

    let non_owner: ContractAddress = 0x456.try_into().unwrap();

    start_cheat_caller_address(dispatcher.contract_address, non_owner);
    dispatcher.renounce_ownership();
    stop_cheat_caller_address(dispatcher.contract_address);
}

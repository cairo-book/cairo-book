use snforge_std::{
    ContractClassTrait, DeclareResultTrait, declare, mock_call, start_cheat_caller_address,
    stop_cheat_caller_address,
};
use starknet::ContractAddress;
use super::{ITokenWrapperDispatcher, ITokenWrapperDispatcherTrait};

fn deploy_wrapper() -> ITokenWrapperDispatcher {
    let contract = declare("TokenWrapper").unwrap().contract_class();
    let (contract_address, _) = contract.deploy(@array![]).unwrap();
    ITokenWrapperDispatcher { contract_address }
}

#[test]
fn test_token_name() {
    let wrapper = deploy_wrapper();

    // Mock ERC20 token address
    let token_address: ContractAddress = 0x123.try_into().unwrap();

    // Mock the name() call on the token
    mock_call(token_address, selector!("name"), 'TestToken', 1);

    let name = wrapper.token_name(token_address);
    assert_eq!(name, 'TestToken');
}

#[test]
fn test_transfer_token() {
    let wrapper = deploy_wrapper();

    // Setup addresses
    let token_address: ContractAddress = 0x456.try_into().unwrap();
    let sender: ContractAddress = 0x789.try_into().unwrap();
    let recipient: ContractAddress = 0xabc.try_into().unwrap();
    let amount = 1000_u256;

    // Mock the transfer_from call to return true
    start_cheat_caller_address(wrapper.contract_address, sender);
    mock_call(token_address, selector!("transfer_from"), true, 1);

    let result = wrapper.transfer_token(token_address, recipient, amount);

    stop_cheat_caller_address(wrapper.contract_address);

    assert!(result);
}

#[test]
fn test_transfer_token_failure() {
    let wrapper = deploy_wrapper();

    // Setup addresses
    let token_address: ContractAddress = 0x456.try_into().unwrap();
    let sender: ContractAddress = 0x789.try_into().unwrap();
    let recipient: ContractAddress = 0xabc.try_into().unwrap();
    let amount = 1000_u256;

    // Mock the transfer_from call to return false
    start_cheat_caller_address(wrapper.contract_address, sender);
    mock_call(token_address, selector!("transfer_from"), false, 1);

    let result = wrapper.transfer_token(token_address, recipient, amount);

    stop_cheat_caller_address(wrapper.contract_address);

    assert!(!result);
}

#[test]
fn test_multiple_token_names() {
    let wrapper = deploy_wrapper();

    // Mock multiple ERC20 tokens
    let token1: ContractAddress = 0x111.try_into().unwrap();
    let token2: ContractAddress = 0x222.try_into().unwrap();
    let token3: ContractAddress = 0x333.try_into().unwrap();

    // Mock the name() calls
    mock_call(token1, selector!("name"), 'Token1', 1);
    mock_call(token2, selector!("name"), 'Token2', 1);
    mock_call(token3, selector!("name"), 'Token3', 1);

    assert_eq!(wrapper.token_name(token1), 'Token1');
    assert_eq!(wrapper.token_name(token2), 'Token2');
    assert_eq!(wrapper.token_name(token3), 'Token3');
}

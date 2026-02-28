// Fork testing examples
// NOTE: These tests require RPC access and are marked with #[ignore]
// to prevent CI failures. Run locally with: snforge test --ignored

use snforge_std::{ContractClassTrait, DeclareResultTrait, declare};
use starknet::ContractAddress;
use super::{
    IDeployedProtocolDispatcher, IDeployedProtocolDispatcherTrait, IMyContractDispatcher,
    IMyContractDispatcherTrait,
};

// ANCHOR: fork_test_basic
// For example only - replace addresses with real deployed contracts
#[test]
#[fork("MAINNET")]
#[ignore] // Requires RPC access - run with: snforge test --ignored
fn test_reads_from_deployed_protocol() {
    // Replace 0x123 with an actual deployed contract address (e.g., Pragma oracle)
    let oracle_address: ContractAddress = 0x123.try_into().unwrap();
    let token_address: ContractAddress = 0x456.try_into().unwrap();

    // Create dispatcher to interact with deployed contract
    let oracle = IDeployedProtocolDispatcher { contract_address: oracle_address };

    // Call the real deployed contract - reads actual on-chain state
    let price = oracle.get_price(token_address);

    // Assert on actual mainnet data
    assert!(price > 0, "Price should be positive");
}
// ANCHOR_END: fork_test_basic

// ANCHOR: fork_test_deploy_and_interact
// For example only - replace addresses with real deployed contracts
#[test]
#[fork("MAINNET")]
#[ignore] // Requires RPC access
fn test_my_contract_with_deployed_oracle() {
    // Deploy your contract in the forked environment
    let contract_class = declare("MyContract").unwrap().contract_class();
    let (contract_address, _) = contract_class.deploy(@array![]).unwrap();
    let my_contract = IMyContractDispatcher { contract_address };

    // Replace 0x123 with actual Pragma oracle address on mainnet
    let oracle_address: ContractAddress = 0x123.try_into().unwrap();
    my_contract.set_oracle(oracle_address);

    // Your contract now interacts with the real oracle
    let token: ContractAddress = 0x456.try_into().unwrap();
    let value = my_contract.get_token_value(token, 100);

    // Verify the integration works with real protocol behavior
    assert!(value > 0, "Value should be positive based on real oracle price");
}
// ANCHOR_END: fork_test_deploy_and_interact

// ANCHOR: fork_test_historical
// For example only - demonstrates testing against historical state
#[test]
#[fork("MAINNET")]
#[ignore] // Requires RPC access
fn test_historical_state() {
    // At block 500000, we know certain conditions existed
    // Useful for: reproducing bugs, testing known market conditions,
    // verifying behavior with historical data

    // Replace with actual contract address
    let oracle_address: ContractAddress = 0x123.try_into().unwrap();
    let oracle = IDeployedProtocolDispatcher { contract_address: oracle_address };

    // Read state at this historical block
    let reserve = oracle.get_reserve();

    // Assert on known historical state
    assert!(reserve > 0, "Reserve should exist at this block");
}
// ANCHOR_END: fork_test_historical



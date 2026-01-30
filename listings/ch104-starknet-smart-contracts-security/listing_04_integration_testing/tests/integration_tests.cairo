use snforge_std::{
    ContractClassTrait, DeclareResultTrait, declare, start_cheat_caller_address,
    stop_cheat_caller_address,
};
use starknet::ContractAddress;
use listing_04_integration_testing::token::{ITokenDispatcher, ITokenDispatcherTrait};
use listing_04_integration_testing::staking::{IStakingDispatcher, IStakingDispatcherTrait};

fn user() -> ContractAddress {
    'user'.try_into().unwrap()
}

// ANCHOR: setup
fn deploy_token_and_staking() -> (ITokenDispatcher, IStakingDispatcher) {
    // Deploy the token contract
    let token_class = declare("Token").unwrap().contract_class();
    let (token_address, _) = token_class.deploy(@array![]).unwrap();
    let token = ITokenDispatcher { contract_address: token_address };

    // Deploy the staking contract with the token address
    let staking_class = declare("Staking").unwrap().contract_class();
    let (staking_address, _) = staking_class.deploy(@array![token_address.into()]).unwrap();
    let staking = IStakingDispatcher { contract_address: staking_address };

    (token, staking)
}
// ANCHOR_END: setup

// ANCHOR: test_staking_flow
#[test]
fn test_staking_flow() {
    let (token, staking) = deploy_token_and_staking();
    let user = user();

    // Mint tokens to user
    token.mint(user, 1000);

    // User approves staking contract to spend tokens
    start_cheat_caller_address(token.contract_address, user);
    token.approve(staking.contract_address, 500);
    stop_cheat_caller_address(token.contract_address);

    // User stakes tokens
    start_cheat_caller_address(staking.contract_address, user);
    staking.stake(500);
    stop_cheat_caller_address(staking.contract_address);

    // Verify both contracts updated correctly
    assert_eq!(token.balance_of(user), 500);
    assert_eq!(token.balance_of(staking.contract_address), 500);
    assert_eq!(staking.staked_amount(user), 500);
}
// ANCHOR_END: test_staking_flow

// ANCHOR: test_multiple_stakers
#[test]
fn test_multiple_stakers() {
    let (token, staking) = deploy_token_and_staking();
    let user1: ContractAddress = 'user1'.try_into().unwrap();
    let user2: ContractAddress = 'user2'.try_into().unwrap();

    // Setup: mint and approve for both users
    token.mint(user1, 1000);
    token.mint(user2, 500);

    start_cheat_caller_address(token.contract_address, user1);
    token.approve(staking.contract_address, 1000);
    stop_cheat_caller_address(token.contract_address);

    start_cheat_caller_address(token.contract_address, user2);
    token.approve(staking.contract_address, 500);
    stop_cheat_caller_address(token.contract_address);

    // User1 stakes
    start_cheat_caller_address(staking.contract_address, user1);
    staking.stake(600);
    stop_cheat_caller_address(staking.contract_address);

    // User2 stakes
    start_cheat_caller_address(staking.contract_address, user2);
    staking.stake(300);
    stop_cheat_caller_address(staking.contract_address);

    // Verify individual stakes and total
    assert_eq!(staking.staked_amount(user1), 600);
    assert_eq!(staking.staked_amount(user2), 300);
    assert_eq!(staking.total_staked(), 900);
}
// ANCHOR_END: test_multiple_stakers

// ANCHOR: test_stake_without_approval
#[test]
#[should_panic(expected: "Insufficient allowance")]
fn test_stake_fails_without_approval() {
    let (token, staking) = deploy_token_and_staking();
    let user = user();

    // Mint tokens but don't approve
    token.mint(user, 1000);

    // Try to stake without approval - should fail
    start_cheat_caller_address(staking.contract_address, user);
    staking.stake(500);
}
// ANCHOR_END: test_stake_without_approval

// ANCHOR: test_withdraw
#[test]
fn test_withdraw_flow() {
    let (token, staking) = deploy_token_and_staking();
    let user = user();

    // Setup: mint, approve, and stake
    token.mint(user, 1000);
    start_cheat_caller_address(token.contract_address, user);
    token.approve(staking.contract_address, 500);
    stop_cheat_caller_address(token.contract_address);

    start_cheat_caller_address(staking.contract_address, user);
    staking.stake(500);

    // Withdraw half
    staking.withdraw(250);
    stop_cheat_caller_address(staking.contract_address);

    // Verify balances
    assert_eq!(staking.staked_amount(user), 250);
    assert_eq!(staking.total_staked(), 250);
    assert_eq!(token.balance_of(user), 750); // 500 remaining + 250 withdrawn
}
// ANCHOR_END: test_withdraw

// ANCHOR: test_multi_contract_state
/// When one action affects multiple contracts, verify ALL affected state.
/// This test demonstrates checking state changes across contracts after a
/// single operation.
#[test]
fn test_stake_updates_both_contracts() {
    let (token, staking) = deploy_token_and_staking();
    let user = user();

    // Setup
    token.mint(user, 1000);
    start_cheat_caller_address(token.contract_address, user);
    token.approve(staking.contract_address, 1000);
    stop_cheat_caller_address(token.contract_address);

    // Capture state BEFORE the cross-contract operation
    let user_balance_before = token.balance_of(user);
    let staking_balance_before = token.balance_of(staking.contract_address);
    let staked_before = staking.staked_amount(user);
    let total_staked_before = staking.total_staked();

    // Single action that affects multiple contracts
    start_cheat_caller_address(staking.contract_address, user);
    staking.stake(400);
    stop_cheat_caller_address(staking.contract_address);

    // Verify BOTH contracts updated correctly
    // Token contract state changed:
    assert_eq!(token.balance_of(user), user_balance_before - 400);
    assert_eq!(token.balance_of(staking.contract_address), staking_balance_before + 400);
    // Staking contract state changed:
    assert_eq!(staking.staked_amount(user), staked_before + 400);
    assert_eq!(staking.total_staked(), total_staked_before + 400);
}
// ANCHOR_END: test_multi_contract_state

// ANCHOR: cheatcode_cleanup
/// IMPORTANT: Why we use stop_cheat_caller_address in integration tests
///
/// In integration tests, one contract calls another. If you don't stop the
/// cheatcode, it affects ALL calls to that contract - including internal
/// cross-contract calls.
///
/// Example of what goes wrong without cleanup:
/// 1. start_cheat_caller_address(token, user) - token sees caller as "user"
/// 2. staking.stake(100) - staking calls token.transfer_from()
/// 3. Inside transfer_from, get_caller_address() returns "user" (wrong!)
///    It should return "staking contract" since staking is calling token
///
/// The pattern: always stop the cheatcode before cross-contract calls.
#[test]
fn test_cheatcode_cleanup_pattern() {
    let (token, staking) = deploy_token_and_staking();
    let user = user();

    token.mint(user, 1000);

    // Step 1: User approves staking contract
    start_cheat_caller_address(token.contract_address, user);
    token.approve(staking.contract_address, 500);
    // CRITICAL: Stop cheating before the cross-contract call
    stop_cheat_caller_address(token.contract_address);

    // Step 2: User calls staking, which internally calls token
    // Now when staking calls token.transfer_from(), the caller is correctly
    // seen as the staking contract (not user)
    start_cheat_caller_address(staking.contract_address, user);
    staking.stake(500);
    stop_cheat_caller_address(staking.contract_address);

    assert_eq!(staking.staked_amount(user), 500);
}
// ANCHOR_END: cheatcode_cleanup

use snforge_std::{
    ContractClassTrait, DeclareResultTrait, declare, start_cheat_caller_address,
    stop_cheat_caller_address,
};
use starknet::{ContractAddress, contract_address_const};
use crate::simple_token::{ISimpleTokenDispatcher, ISimpleTokenDispatcherTrait};

fn owner() -> ContractAddress {
    contract_address_const::<'owner'>()
}

fn deploy_token(initial_supply: u256) -> ISimpleTokenDispatcher {
    let contract = declare("SimpleToken").unwrap().contract_class();
    let owner = owner();
    let constructor_calldata = array![
        owner.into(), initial_supply.low.into(), initial_supply.high.into(),
    ];
    let (contract_address, _) = contract.deploy(@constructor_calldata).unwrap();
    ISimpleTokenDispatcher { contract_address }
}

// ANCHOR: example_test
// A simple example-based test
#[test]
fn test_transfer_updates_balances() {
    let token = deploy_token(1000);
    let recipient = contract_address_const::<'recipient'>();

    start_cheat_caller_address(token.contract_address, owner());
    token.transfer(recipient, 100);
    stop_cheat_caller_address(token.contract_address);

    assert_eq!(token.balance_of(owner()), 900);
    assert_eq!(token.balance_of(recipient), 100);
}
// ANCHOR_END: example_test

// ANCHOR: fuzz_balance_invariant
/// Invariant: Transfer preserves total supply
/// For any valid transfer, total_supply before == total_supply after
#[test]
#[fuzzer(runs: 100, seed: 12345)]
fn test_fuzz_transfer_preserves_total_supply(amount: u64) {
    // Setup: deploy with enough balance for any fuzzed amount
    let initial_supply: u256 = 0xFFFFFFFFFFFFFFFF; // max u64 as u256
    let token = deploy_token(initial_supply);
    let recipient = contract_address_const::<'recipient'>();

    let supply_before = token.total_supply();

    // Transfer a fuzzed amount
    start_cheat_caller_address(token.contract_address, owner());
    token.transfer(recipient, amount.into());
    stop_cheat_caller_address(token.contract_address);

    let supply_after = token.total_supply();

    // INVARIANT: total supply must not change
    assert_eq!(supply_before, supply_after, "Total supply changed after transfer!");
}
// ANCHOR_END: fuzz_balance_invariant

// ANCHOR: fuzz_balance_conservation
/// Invariant: Transfer conserves balances
/// sender_balance_before + recipient_balance_before ==
/// sender_balance_after + recipient_balance_after
#[test]
#[fuzzer(runs: 100, seed: 54321)]
fn test_fuzz_transfer_conserves_balances(amount: u64) {
    let initial_supply: u256 = 0xFFFFFFFFFFFFFFFF;
    let token = deploy_token(initial_supply);
    let recipient = contract_address_const::<'recipient'>();

    let sender_before = token.balance_of(owner());
    let recipient_before = token.balance_of(recipient);
    let sum_before = sender_before + recipient_before;

    start_cheat_caller_address(token.contract_address, owner());
    token.transfer(recipient, amount.into());
    stop_cheat_caller_address(token.contract_address);

    let sender_after = token.balance_of(owner());
    let recipient_after = token.balance_of(recipient);
    let sum_after = sender_after + recipient_after;

    // INVARIANT: sum of involved balances must not change
    assert_eq!(sum_before, sum_after, "Balance conservation violated!");
}
// ANCHOR_END: fuzz_balance_conservation

// ANCHOR: fuzz_roundtrip
/// Property: Transfer round-trip
/// If A transfers X to B, and B transfers X back to A, balances return to original
#[test]
#[fuzzer(runs: 100, seed: 11111)]
fn test_fuzz_transfer_roundtrip(amount: u64) {
    let initial_supply: u256 = 0xFFFFFFFFFFFFFFFF;
    let token = deploy_token(initial_supply);
    let alice = owner();
    let bob = contract_address_const::<'bob'>();

    let alice_initial = token.balance_of(alice);
    let bob_initial = token.balance_of(bob);

    // Alice -> Bob
    start_cheat_caller_address(token.contract_address, alice);
    token.transfer(bob, amount.into());
    stop_cheat_caller_address(token.contract_address);

    // Bob -> Alice
    start_cheat_caller_address(token.contract_address, bob);
    token.transfer(alice, amount.into());
    stop_cheat_caller_address(token.contract_address);

    // PROPERTY: Balances should return to original
    assert_eq!(token.balance_of(alice), alice_initial, "Alice balance not restored");
    assert_eq!(token.balance_of(bob), bob_initial, "Bob balance not restored");
}
// ANCHOR_END: fuzz_roundtrip



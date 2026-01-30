use snforge_std::{ContractClassTrait, DeclareResultTrait, L1HandlerTrait, declare};
use starknet::{ContractAddress, contract_address_const};

use crate::bridge::{IBridgeDispatcher, IBridgeDispatcherTrait};

// ANCHOR: constants
// The L1 bridge address (Ethereum address as felt252)
const VALID_L1_BRIDGE: felt252 = 0x1234567890ABCDEF;
// An unauthorized L1 address
const INVALID_L1_ADDRESS: felt252 = 0xDEADBEEF;
// ANCHOR_END: constants

fn deploy_bridge() -> (IBridgeDispatcher, ContractAddress) {
    let contract = declare("Bridge").unwrap().contract_class();
    let constructor_calldata = array![VALID_L1_BRIDGE];
    let (contract_address, _) = contract.deploy(@constructor_calldata).unwrap();
    (IBridgeDispatcher { contract_address }, contract_address)
}

// ANCHOR: test_valid_deposit
#[test]
fn test_l1_handler_valid_deposit() {
    let (bridge, bridge_address) = deploy_bridge();
    let recipient = contract_address_const::<'recipient'>();

    // Initial balance should be zero
    assert_eq!(bridge.get_balance(recipient), 0);

    // Create an L1Handler to simulate message from L1
    let l1_handler = L1HandlerTrait::new(bridge_address, selector!("handle_deposit"));

    // Serialize the payload: (recipient, amount_low, amount_high)
    let amount: u256 = 1000;
    let payload = array![recipient.into(), amount.low.into(), amount.high.into()];

    // Execute the L1 handler with the VALID L1 bridge address
    l1_handler.execute(VALID_L1_BRIDGE, payload.span()).unwrap();

    // Verify the deposit was credited
    assert_eq!(bridge.get_balance(recipient), 1000);
}
// ANCHOR_END: test_valid_deposit

// ANCHOR: test_unauthorized_rejected
#[test]
fn test_l1_handler_rejects_unauthorized_sender() {
    let (bridge, bridge_address) = deploy_bridge();
    let recipient = contract_address_const::<'recipient'>();

    let l1_handler = L1HandlerTrait::new(bridge_address, selector!("handle_deposit"));

    let amount: u256 = 1000;
    let payload = array![recipient.into(), amount.low.into(), amount.high.into()];

    // Attempt to execute from an UNAUTHORIZED address
    // This MUST fail - if it doesn't, the bridge is vulnerable!
    let result = l1_handler.execute(INVALID_L1_ADDRESS, payload.span());

    // Verify the call failed (is_err() returns true)
    assert!(result.is_err(), "Should reject unauthorized sender");

    // Verify balance wasn't credited
    assert_eq!(bridge.get_balance(recipient), 0, "Balance should remain zero");
}
// ANCHOR_END: test_unauthorized_rejected

// ANCHOR: test_multiple_senders
#[test]
fn test_l1_handler_rejects_zero_address() {
    let (bridge, bridge_address) = deploy_bridge();
    let recipient = contract_address_const::<'recipient'>();

    let l1_handler = L1HandlerTrait::new(bridge_address, selector!("handle_deposit"));

    let amount: u256 = 1000;
    let payload = array![recipient.into(), amount.low.into(), amount.high.into()];

    // Zero address should also be rejected
    let result = l1_handler.execute(0, payload.span());

    // Verify the call failed
    assert!(result.is_err(), "Should reject zero address sender");

    // Verify balance wasn't credited
    assert_eq!(bridge.get_balance(recipient), 0, "Balance should remain zero");
}
// ANCHOR_END: test_multiple_senders

// ANCHOR: test_multiple_deposits
#[test]
fn test_l1_handler_accumulates_deposits() {
    let (bridge, bridge_address) = deploy_bridge();
    let recipient = contract_address_const::<'recipient'>();

    // First deposit
    let l1_handler1 = L1HandlerTrait::new(bridge_address, selector!("handle_deposit"));
    let amount1: u256 = 500;
    let payload1 = array![recipient.into(), amount1.low.into(), amount1.high.into()];
    l1_handler1.execute(VALID_L1_BRIDGE, payload1.span()).unwrap();

    // Second deposit (create new handler instance)
    let l1_handler2 = L1HandlerTrait::new(bridge_address, selector!("handle_deposit"));
    let amount2: u256 = 300;
    let payload2 = array![recipient.into(), amount2.low.into(), amount2.high.into()];
    l1_handler2.execute(VALID_L1_BRIDGE, payload2.span()).unwrap();

    // Total should be accumulated
    assert_eq!(bridge.get_balance(recipient), 800);
}
// ANCHOR_END: test_multiple_deposits

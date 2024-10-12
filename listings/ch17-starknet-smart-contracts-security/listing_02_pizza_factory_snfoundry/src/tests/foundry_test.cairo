use source::pizza::{
    PizzaFactory, PizzaFactory::{Event as PizzaEvents, PizzaEmission}
};
//ANCHOR: import_internal
use source::pizza::PizzaFactory::{InternalTrait};
//ANCHOR_END: import_internal

use core::starknet::{ContractAddress, contract_address_const};
use core::starknet::storage::StoragePointerReadAccess;

use snforge_std::{
    declare, start_cheat_caller_address,
    EventSpyAssertionsTrait, spy_events, load,
};

fn owner() -> ContractAddress {
    contract_address_const::<'owner'>()
}

//ANCHOR: test_internals
#[test]
fn test_set_as_new_owner_direct() {
    let mut state = PizzaFactory::contract_state_for_testing();
    let owner: ContractAddress = contract_address_const::<'owner'>();
    state.set_owner(owner);
    assert_eq!(state.owner.read(), owner);
}
//ANCHOR_END: test_internals

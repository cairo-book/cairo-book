//ANCHOR: import
use core::pedersen::PedersenTrait;
use core::hash::{HashStateTrait, HashStateExTrait};
//ANCHOR_END: import

//ANCHOR: structure
#[derive(Drop, Hash)]
struct StructForHash {
    first: felt252,
    second: felt252,
    third: (u32, u32),
    last: bool,
}
//ANCHOR_END: structure

//ANCHOR: main
fn main() -> (felt252, felt252) {
    let base_value_to_hash: felt252 = 0;
    let value_to_update_state: felt252 = 1;

    let struct_to_hash = StructForHash { first: 0, second: 1, third: (1, 2), last: false };

    // hash1 is the result of hashing two felt252
    let hash1 = PedersenTrait::new(base_value_to_hash).update(value_to_update_state).finalize();
    // hash2 is the result of hashing a struct with a base state of 0
    let hash2 = PedersenTrait::new(0).update_with(struct_to_hash).finalize();

    (hash1, hash2)
}
//ANCHOR_END: main



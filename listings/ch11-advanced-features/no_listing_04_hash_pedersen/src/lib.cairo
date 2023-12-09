//ANCHOR: import
use core::pedersen::PedersenTrait;
use core::poseidon::PoseidonTrait;
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
fn main() -> felt252 {
    let struct_to_hash = StructForHash { first: 0, second: 1, third: (1, 2), last: false };

    let hash = PedersenTrait::new(0).update_with(struct_to_hash).finalize();
    hash
}
//ANCHOR_END: main



//ANCHOR: import
use pedersen::PedersenTrait;
use poseidon::PoseidonTrait;
use hash::{HashStateTrait, HashStateExTrait};
//ANCHOR_END: import

//ANCHOR: structure
#[derive(Drop, Hash)]
struct StructForHash {
    first: felt252,
    second: felt252,
    third: (u32, u32),
    last: bool,
}

//ANCHOR: main
fn main() -> felt252 {
    let struct_to_hash = StructForHash { first: 0, second: 1, third: (1, 2), last: false };

    let hash = PoseidonTrait::new().update_with(struct_to_hash).finalize();
    hash
}
//ANCHOR_END: main



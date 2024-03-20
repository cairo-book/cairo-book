//ANCHOR: import
use core::pedersen::PedersenTrait;
use core::hash::{HashStateTrait, HashStateExTrait};
//ANCHOR_END: import

//ANCHOR: structure
#[derive(Drop, Hash, Serde, Copy)]
struct StructForHash {
    first: felt252,
    second: felt252,
    third: (u32, u32),
    last: bool,
}
//ANCHOR_END: structure

//ANCHOR: main
fn main() -> (felt252, felt252) {
    let struct_to_hash = StructForHash { first: 0, second: 1, third: (1, 2), last: false };

    // hash1 is the result of hashing a struct with a base state of 0
    let hash1 = PedersenTrait::new(0).update_with(struct_to_hash).finalize();

    let mut serialized_struct: Array<felt252> = ArrayTrait::new();
    Serde::serialize(@struct_to_hash, ref serialized_struct);
    let first_element = serialized_struct.pop_front().unwrap();
    let mut state = PedersenTrait::new(first_element);

    while let Option::Some(value) = serialized_struct.pop_front() {
        state = state.update(value);
    };

    // hash2 is the result of hashing only the fields of the struct
    let hash2 = state.finalize();

    (hash1, hash2)
}
//ANCHOR_END: main



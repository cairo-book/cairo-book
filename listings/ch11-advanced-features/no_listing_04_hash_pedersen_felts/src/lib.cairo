//ANCHOR: import
use core::pedersen::PedersenTrait;
use core::hash::{HashStateTrait, HashStateExTrait};
//ANCHOR_END: import

//ANCHOR: main
fn main() -> felt252 {
    let param1: felt252 = 'param1';
    let param2: felt252 = 'param2';
    let hash = PedersenTrait::new(param1).update_with(param2).finalize();
    hash
}
//ANCHOR_END: main



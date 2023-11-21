//ANCHOR: import
use pedersen::PedersenTrait;
use poseidon::PoseidonTrait;
use hash::{HashStateTrait, HashStateExTrait};
//ANCHOR_END: import

//ANCHOR: structure 
#[derive(Drop,Hash)]
struct StructForHash {
    first: felt252,
    second: felt252,
    third: (u32,u32),
    last : bool,
    
}
//ANCHOR_END: structure 

fn hash_poseidon() {

    //ANCHOR: example_poseidon
    let struct_to_hash = StructForHash {first : 0, second : 1, third : (1,2), last : false};

    let hash = PoseidonTrait::new().update_with(struct_to_hash).finalize();
    //ANCHOR_END: example_poseidon
}

fn hash_perdersen() {

    //ANCHOR: example_perdersen
    let struct_to_hash = StructForHash {first : 0, second : 1, third : (1,2), last : false};

    let hash = PedersenTrait::new(0).update_with(struct_to_hash).finalize();
    //ANCHOR_END: example_perdersen
}





#[derive(PartialEq, Drop)]
struct A {
    item: felt252,
}

fn main() {
    let first_struct = A { item: 2 };
    let second_struct = A { item: 2 };
    assert!(first_struct == second_struct, "Structs are different");
}

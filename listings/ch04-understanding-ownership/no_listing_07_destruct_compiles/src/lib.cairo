use core::dict::Felt252Dict;

#[derive(Destruct)]
struct A {
    dict: Felt252Dict<u128>,
}

#[executable]
fn main() {
    A { dict: Default::default() }; // No error here
}

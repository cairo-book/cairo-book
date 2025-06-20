//TAG: does_not_compile
use core::dict::Felt252Dict;

struct A {
    dict: Felt252Dict<u128>,
}

#[executable]
fn main() {
    A { dict: Default::default() };
}

//TAG: does_not_compile
use core::dict::Felt252Dict;

struct A {
    dict: Felt252Dict<u128>,
}

fn main() {
    A { dict: Default::default() };
}

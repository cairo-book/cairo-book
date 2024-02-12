// TAG: does_not_compile
// ANCHOR: all
struct A {
    dict: Felt252Dict<u128>
}

fn main() {
    A { dict: Default::default() };
}
// ANCHOR_END: all



//TAG: does_not_compile

struct A {
    dict: Felt252Dict<u128>
}

fn main() {
    A { dict: Default::default() };
}

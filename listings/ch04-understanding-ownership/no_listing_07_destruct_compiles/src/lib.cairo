#[derive(Destruct)]
struct A {
    dict: Felt252Dict<u128>
}

fn main() {
    A { dict: Default::default() }; // No error here
}

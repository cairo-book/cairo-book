use dict::Felt252DictTrait;

#[derive(Destruct)]
struct A {
    dict: Felt252Dict<u128>
}

fn main() {
    A { dict: Felt252DictTrait::new() }; // No error here
}

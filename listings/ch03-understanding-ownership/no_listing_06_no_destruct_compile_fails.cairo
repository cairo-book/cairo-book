use dict::Felt252DictTrait;

struct A {
    dict: Felt252Dict<u128>
}

fn main() {
    A { dict: Felt252DictTrait::new() };
}

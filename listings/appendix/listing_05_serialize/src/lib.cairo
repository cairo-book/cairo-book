#[derive(Serde, Drop)]
struct A {
    item_one: felt252,
    item_two: felt252,
}

fn main() {
    let first_struct = A { item_one: 2, item_two: 99, };
    let mut output_array = array![];
    let serialized = first_struct.serialize(ref output_array);
    panic(output_array);
}

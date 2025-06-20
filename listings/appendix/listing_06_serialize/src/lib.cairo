// TAG: does_not_run

#[derive(Serde, Drop)]
struct A {
    item_one: felt252,
    item_two: felt252,
}

#[executable]
fn main() {
    let first_struct = A { item_one: 2, item_two: 99 };
    let mut output_array = array![];
    first_struct.serialize(ref output_array);
    panic(output_array);
}

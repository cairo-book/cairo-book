#[derive(Clone, Drop)]
struct A {
    item: felt252
}

fn main() {
    let first_struct = A { item: 2 };
    let second_struct = first_struct.clone();
    assert!(second_struct.item == 2, "Not equal");
}

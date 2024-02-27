#[derive(Copy, Drop)]
struct A {
    item: felt252
}

fn main() {
    let first_struct = A { item: 2 };
    let second_struct = first_struct;
    // Copy Trait prevents first_struct from moving into second_struct
    assert!(second_struct.item == 2, "Not equal");
    assert!(first_struct.item == 2, "Not Equal");
}

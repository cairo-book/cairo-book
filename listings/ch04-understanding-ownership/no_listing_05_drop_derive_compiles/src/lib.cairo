#[derive(Drop)]
struct A {}

#[executable]
fn main() {
    A {}; // Now there is no error.
}

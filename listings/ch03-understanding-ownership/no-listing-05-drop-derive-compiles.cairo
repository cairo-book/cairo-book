#[derive(Drop)]
struct A {}

fn main() {
    A {}; // Now there is no error.
}

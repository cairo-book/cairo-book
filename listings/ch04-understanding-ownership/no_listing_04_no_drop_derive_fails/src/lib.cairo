//TAG: does_not_compile
struct A {}

#[executable]
fn main() {
    A {}; // error: Variable not dropped.
}

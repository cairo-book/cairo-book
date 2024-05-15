//TAG: does_not_compile
struct A {}

fn main() {
    A {}; // error: Variable not dropped.
}

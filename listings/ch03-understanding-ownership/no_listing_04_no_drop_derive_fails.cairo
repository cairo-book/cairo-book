//TAG: does_not_compile
struct A {}

fn main() {
    A {}; // error: Value not dropped.
}

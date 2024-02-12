// TAG: does_not_compile
// ANCHOR: all
struct A {}

fn main() {
    A {}; // error: Value not dropped.
}
// ANCHOR_END: all



// TAGS: does_not_compile, ignore_fmt
// ANCHOR: all
struct A {}

fn main() {
    A {}; // error: Value not dropped.
}
// ANCHOR_END: all


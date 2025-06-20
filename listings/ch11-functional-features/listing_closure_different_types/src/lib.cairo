//TAG: does_not_compile
#[executable]
fn main() {
    // ANCHOR: here
    let example_closure = |x| x;

    let s = example_closure(5_u64);
    let n = example_closure(5_u32);
    // ANCHOR_END: here
}

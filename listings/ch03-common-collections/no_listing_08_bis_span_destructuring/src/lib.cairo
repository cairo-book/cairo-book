// ANCHOR: let_else
fn sum_of_three(span: Span<u64>) -> u64 {
    let [a, b, c] = span else {
        panic!("expected exactly three elements");
    };
    *a + *b + *c
}
// ANCHOR_END: let_else

// ANCHOR: match
fn describe(span: Span<u64>) -> ByteArray {
    match span {
        [] => "nothing",
        [single] => format!("just {}", *single),
        [first, second] => format!("{} and {}", *first, *second),
        _ => "too many to list",
    }
}
// ANCHOR_END: match

#[executable]
fn main() {
    println!("{}", sum_of_three(array![10, 20, 30].span()));
    println!("{}", describe(array![].span()));
    println!("{}", describe(array![7].span()));
    println!("{}", describe(array![7, 8].span()));
    println!("{}", describe(array![7, 8, 9].span()));
}

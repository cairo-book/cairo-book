fn add_two(a: u32) -> u32 {
    a + 3
}

// ANCHOR: here
#[test]
fn it_adds_two() {
    assert_eq!(4, add_two(2), "Expected {}, got add_two(2)={}", 4, add_two(2));
}
// ANCHOR_END: here



fn add_two(a: u32) -> u32 {
    a + 2
}

#[test]
fn it_adds_two() {
    assert_eq!(4, add_two(2));
}

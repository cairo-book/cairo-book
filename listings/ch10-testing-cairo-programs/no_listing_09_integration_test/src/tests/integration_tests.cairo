use adder::it_adds_two;

#[test]
fn internal() {
    assert!(it_adds_two(2, 2) == 4, "internal_adder failed");
}

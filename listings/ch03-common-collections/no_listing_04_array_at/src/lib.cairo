fn main() {
    let mut a = ArrayTrait::new();
    a.append(0);
    a.append(1);

    // using `at()` method
    assert(*a.at(0) == 0, 'item mismatch on index 0');
    // using subscripting operator
    assert(*a[1] == 1, 'item mismatch on index 1');
}

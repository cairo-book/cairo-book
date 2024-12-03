fn main() {
    let mut a = ArrayTrait::new();
    a.append(0);
    a.append(1);

    let first = *a.at(0);
    let second = *a.at(1);
    // using `at()` method
    assert(first == 0, 'item mismatch on index 0');
    // using subscripting operator
    assert(second == 1, 'item mismatch on index 1');
}

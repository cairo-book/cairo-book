fn main() {
    let mut a = ArrayTrait::new();
    a.append(0);
    a.append(1);

    // using the `at()` method
    let first = *a.at(0);
    assert!(first == 0);
    // using the subscripting operator
    let second = *a[1];
    assert!(second == 1);
}

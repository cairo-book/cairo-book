fn main() {
    let mut a = ArrayTrait::new();
    a.append(0);
    a.append(1);

    // The first element of the array 'a', accessed using the .at() method.
    let first = *a.at(0);
    // The second element of the array 'a', accessed using the .at() method.
    let second = *a.at(1);
    // using `at()` method
    assert(*a.at(0) == 0, 'item mismatch on index 0');
    // using subscripting operator
    assert(*a[1] == 1, 'item mismatch on index 1');
}

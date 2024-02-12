fn find_value_recursive(mut arr: Span<felt252>, value: felt252, index: usize) -> Option<usize> {
    match arr.pop_front() {
        Option::Some(index_value) => { if (*index_value == value) {
            return Option::Some(index);
        } },
        Option::None => { return Option::None; },
    };

    return find_value_recursive(arr, value, index + 1);
}

fn find_value_iterative(mut arr: Span<felt252>, value: felt252) -> Option<usize> {
    let mut index = 0;

    loop {
        match arr.pop_front() {
            Option::Some(array_value) => if (*array_value == value) {
                break Option::Some(index);
            },
            Option::None => { break Option::None; },
        }
        index += 1;
    }
}

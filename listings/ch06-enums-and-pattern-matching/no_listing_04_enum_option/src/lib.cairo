fn find_value_recursive(mut arr: Span<felt252>, value: felt252, index: usize) -> Option<usize> {
    match arr.pop_front() {
        Option::Some(index_value) => { if (*index_value == value) {
            return Option::Some(index);
        } },
        Option::None => { return Option::None; },
    };

    find_value_recursive(arr, value, index + 1)
}

fn find_value_iterative(mut arr: Span<felt252>, value: felt252) -> Option<usize> {
    let mut result = Option::None;
    let mut index = 0;

    while let Option::Some(array_value) = arr.pop_front() {
        if (*array_value == value) {
            result = Option::Some(index);
            break;
        };

        index += 1;
    };

    result
}

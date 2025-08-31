fn find_value_recursive(mut arr: Span<felt252>, value: felt252, index: usize) -> Option<usize> {
    match arr.pop_front() {
        Some(index_value) => { if (*index_value == value) {
            return Some(index);
        } },
        None => { return None; },
    }

    find_value_recursive(arr, value, index + 1)
}

fn find_value_iterative(mut arr: Span<felt252>, value: felt252) -> Option<usize> {
    for (idx, array_value) in arr.into_iter().enumerate() {
        if (*array_value == value) {
            return Some(idx);
        }
    }
    None
}

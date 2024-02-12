fn find_value_recursive(arr: @Array<felt252>, value: felt252, index: usize) -> Option<usize> {
    if index >= arr.len() {
        return Option::None;
    }

    if *arr.at(index) == value {
        return Option::Some(index);
    }

    find_value_recursive(arr, value, index + 1)
}

fn find_value_iterative(arr: @Array<felt252>, value: felt252) -> Option<usize> {
    let length = arr.len();
    let mut index = 0;
    let mut found: Option<usize> = Option::None;

    while index < length {
        if *arr.at(index) == value {
            found = Option::Some(index);
            break;
        }
        index += 1;
    };
    return found;
}

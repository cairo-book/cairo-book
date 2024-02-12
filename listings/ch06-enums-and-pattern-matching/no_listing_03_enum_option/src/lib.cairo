fn find_value_recursive(mut arr: Span<felt252>, value: felt252, index: usize) -> Option<usize> {
    let mut found: Option<usize> = Option::None;

    match arr.pop_front() {
        Option::Some(index_value) => {
            if (*index_value == value) {
                found = Option::Some(index)
            } else {
                find_value_recursive(arr, value, index + 1);
            }
        },
        Option::None => {},
    };

    found
}

fn find_value_iterative(mut arr: Span<felt252>, value: felt252) -> Option<usize> {
    let mut index = 0;
    let mut found: Option<usize> = Option::None;

    loop {
        match arr.pop_front() {
            Option::Some(array_value) => if (*array_value == value) {
                found = Option::Some(index)
            },
            Option::None => {break;},
        }
        index += 1;
    };

    found
}

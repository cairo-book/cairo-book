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
    loop {
        if index < length {
            if *arr.at(index) == value {
                found = Option::Some(index);
                break;
            }
        } else {
            break;
        }
        index += 1;
    };
    return found;
}

#[cfg(test)]
mod tests {
    use debug::PrintTrait;
    use super::{find_value_recursive, find_value_iterative};

    #[test]
    #[available_gas(999999)]
    fn test_increase_amount() {
        let mut my_array = ArrayTrait::new();
        my_array.append(3);
        my_array.append(7);
        my_array.append(2);
        my_array.append(5);

        let value_to_find = 7;
        let result = find_value_recursive(@my_array, value_to_find, 0);
        let result_i = find_value_iterative(@my_array, value_to_find);

        match result {
            Option::Some(index) => { if index == 1 {
                'it worked'.print();
            } },
            Option::None => { 'not found'.print(); },
        }
        match result_i {
            Option::Some(index) => { if index == 1 {
                'it worked'.print();
            } },
            Option::None => { 'not found'.print(); },
        }
    }
}

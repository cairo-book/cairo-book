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

#[cfg(test)]
mod tests {
    use super::{find_value_recursive, find_value_iterative};

    #[test]
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
            Option::Some(index) => {
                if index == 1 {
                    println!("found recursively at index {}", index);
                }
            },
            Option::None => { println!("not found"); },
        }
        match result_i {
            Option::Some(index) => {
                if index == 1 {
                    println!("found iteratively at index {}", index);
                }
            },
            Option::None => { println!("not found"); },
        }
    }
}

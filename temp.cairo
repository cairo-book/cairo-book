use array::ArrayTrait;
use debug::PrintTrait;
fn find_value_recursive(
    arr: @Array<felt252>, value: felt252, index: usize
) -> Option<usize> {

    match gas::withdraw_gas() {
        Option::Some(_) => {},
        Option::None(_) => {
            let mut data = ArrayTrait::new();
            data.append('OOG');
            panic(data);
        },
    }

    if index >= arr.len() {
        return Option::None(());
    }

    if *arr.at(index) == value {
        return Option::Some(index);
    }

    find_value_recursive(arr, value, index + 1_usize)
}

#[test]
#[available_gas(999999)]
fn test_increase_amount() {
    let mut my_array = ArrayTrait::new();
    my_array.append(3);
    my_array.append(7);
    my_array.append(2);
    my_array.append(5);

    let value_to_find = 7;
    let result = find_value_recursive(@my_array, value_to_find, 0_usize);

    match result {
        Option::Some(index) => {
            if index == 1_usize {
                'it worked'.print();
            }
        },
        Option::None(()) => {
            'not found'.print();
        },
    }
}

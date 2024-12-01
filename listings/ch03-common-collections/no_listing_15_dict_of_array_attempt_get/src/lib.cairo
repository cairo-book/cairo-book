//TAG: does_not_compile
use core::nullable::{match_nullable, FromNullableResult};
use core::dict::Felt252Dict;

fn main() {
    let arr = array![20, 19, 26];
    let mut dict: Felt252Dict<Nullable<Array<u8>>> = Default::default();
    dict.insert(0, NullableTrait::new(arr));
    println!("Array: {:?}", get_array_entry(ref dict, 0));
}

fn get_array_entry(ref dict: Felt252Dict<Nullable<Array<u8>>>, index: felt252) -> Span<u8> {
    let val = dict.get(0); // This will cause a compiler error
    let arr = match match_nullable(val) {
        FromNullableResult::Null => panic!("No value!"),
        FromNullableResult::NotNull(val) => val.unbox(),
    };
    arr.span()
}

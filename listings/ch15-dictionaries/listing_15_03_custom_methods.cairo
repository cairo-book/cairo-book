// ANCHOR: imports
use dict::Felt252DictTrait;
use dict::Felt252DictEntryTrait;
// ANCHOR_END: imports

use debug::PrintTrait;

// ANCHOR: custom_get
fn custom_get<T, impl TDefault: Felt252DictValue<T>, impl TDrop: Drop<T>, impl TCopy: Copy<T>>(
    ref dict: Felt252Dict<T>, key: felt252
) -> T {
    // Get the new entry and the previous value held at `key`
    let (entry, prev_value) = dict.entry(key);

    // Store the value to return
    let return_value = prev_value;

    // Store back the entry in the dictionary, getting ownership back of the dictionary
    dict = entry.finalize(prev_value);

    // Return the read value
    return_value
}
// ANCHOR_END: custom_get

// ANCHOR: custom_insert
fn custom_insert<
    T,
    impl TDefault: Felt252DictValue<T>,
    impl TDestruct: Destruct<T>,
    impl TPrint: PrintTrait<T>,
    impl TDrop: Drop<T>
>(
    ref dict: Felt252Dict<T>, key: felt252, value: T
) {
    // We first get the last entry associated with `key`
    let (entry, _prev_value) = dict.entry(key);

    // We insert `entry` back in the dictionary with the new value
    dict = entry.finalize(value);
}
// ANCHOR_END: custom_insert

// ANCHOR: main
fn main() {
    let mut dict: Felt252Dict<u64> = Felt252DictTrait::new();

    custom_insert(ref dict, '0', 100);

    let val = custom_get(ref dict, '0');

    assert(val == 100, 'Expecting 100');
}
// ANCHOR_END: main

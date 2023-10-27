// ANCHOR: imports
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

    // Update the entry with `prev_value` and get back ownership of the dictionary
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
    // Get the last entry associated with `key`
    // Notice that if `key` does not exists, _prev_value will
    // be the default value of T.
    let (entry, _prev_value) = dict.entry(key);

    // Insert `entry` back in the dictionary with the updated value,
    // and receive ownership of the dictionary
    dict = entry.finalize(value);
}
// ANCHOR_END: custom_insert

// ANCHOR: main
fn main() {
    let mut dict: Felt252Dict<u64> = Default::default();

    custom_insert(ref dict, '0', 100);

    let val = custom_get(ref dict, '0');

    assert(val == 100, 'Expecting 100');
}
// ANCHOR_END: main



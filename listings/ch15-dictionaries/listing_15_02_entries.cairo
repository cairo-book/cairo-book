// ANCHOR: struct
struct Entry<T> {
   key: felt252,
   previous_value: T,
   new_value: T,
}
// ANCHOR_END: struct

use dict::Felt252DictTrait;

fn main() {
    let mut balances: Felt252Dict<u64> = Felt252DictTrait::new();
    // ANCHOR: inserts
    balances.insert('Alex', 100_u64);
    balances.insert('Maria', 50_u64);
    balances.insert('Alex', 200_u64);
    balances.get('Maria');
    // ANCHOR_END: inserts
}

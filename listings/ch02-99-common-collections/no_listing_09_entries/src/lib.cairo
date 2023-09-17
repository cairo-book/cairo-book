// ANCHOR: struct
struct Entry<T> {
    key: felt252,
    previous_value: T,
    new_value: T,
}
// ANCHOR_END: struct

fn main() {
    let mut balances: Felt252Dict<u64> = Default::default();
    // ANCHOR: inserts
    balances.insert('Alex', 100_u64);
    balances.insert('Maria', 50_u64);
    balances.insert('Alex', 200_u64);
    balances.get('Maria');
// ANCHOR_END: inserts
}

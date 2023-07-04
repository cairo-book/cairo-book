use dict::Felt252DictTrait;

fn main() {
    let mut balances: Felt252Dict<u64> = Felt252DictTrait::new();

    // Insert Alex with 100 balance
    balances.insert('Alex', 100);
    // Check that Alex has indeed 100 asociated with him
    let alex_balance = balances.get('Alex');
    assert(alex_balance == 100, 'Alex balance is not 100');

    // Insert Alex again, this time with 200 balance
    balances.insert('Alex', 200);
    // Check the new balance is correct
    let alex_balance_2 = balances.get('Alex');
    assert(alex_balance_2 == 200, 'Alex balance is not 200');
}

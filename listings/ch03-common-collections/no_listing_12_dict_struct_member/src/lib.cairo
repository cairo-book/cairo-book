// ANCHOR: struct
struct UserDatabase<T> {
    users_amount: u64,
    balances: Felt252Dict<T>,
}
// ANCHOR_END: struct

// ANCHOR: trait
trait UserDatabaseTrait<T> {
    fn new() -> UserDatabase<T>;
    fn add_user<impl TDrop: Drop<T>>(ref self: UserDatabase<T>, name: felt252, balance: T);
    fn get_balance<impl TCopy: Copy<T>>(ref self: UserDatabase<T>, name: felt252) -> T;
}
// ANCHOR_END: trait

// ANCHOR: impl
impl UserDatabaseImpl<T, impl TDefault: Felt252DictValue<T>> of UserDatabaseTrait<T> {
    // Creates a database
    fn new() -> UserDatabase<T> {
        UserDatabase { users_amount: 0, balances: Default::default() }
    }

    // Get the user's balance
    fn get_balance<impl TCopy: Copy<T>>(ref self: UserDatabase<T>, name: felt252) -> T {
        self.balances.get(name)
    }

    // Add a user
    fn add_user<impl TDrop: Drop<T>>(ref self: UserDatabase<T>, name: felt252, balance: T) {
        self.balances.insert(name, balance);
        self.users_amount += 1;
    }
}
// ANCHOR_END: impl

// ANCHOR: destruct
impl UserDatabaseDestruct<
    T, impl TDrop: Drop<T>, impl TDefault: Felt252DictValue<T>
> of Destruct<UserDatabase<T>> {
    fn destruct(self: UserDatabase<T>) nopanic {
        self.balances.squash();
    }
}
// ANCHOR_END: destruct

// ANCHOR: main
fn main() {
    let mut db = UserDatabaseTrait::new();

    db.add_user('Alex', 100);
    db.add_user('Maria', 80);

    db.add_user('Alex', 40);
    db.add_user('Maria', 0);

    let alex_latest_balance = db.get_balance('Alex');
    let maria_latest_balance = db.get_balance('Maria');

    assert(alex_latest_balance == 40, 'Expected 40');
    assert(maria_latest_balance == 0, 'Expected 0');
}
// ANCHOR_END: main



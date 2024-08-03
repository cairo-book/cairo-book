use core::dict::Felt252Dict;

// ANCHOR: struct
struct UserDatabase<T> {
    users_updates: u64,
    balances: Felt252Dict<T>,
}
// ANCHOR_END: struct

// ANCHOR: trait
trait UserDatabaseTrait<T> {
    fn new() -> UserDatabase<T>;
    fn update_user<+Drop<T>>(ref self: UserDatabase<T>, name: felt252, balance: T);
    fn get_balance<+Copy<T>>(ref self: UserDatabase<T>, name: felt252) -> T;
}
// ANCHOR_END: trait

// ANCHOR: impl
impl UserDatabaseImpl<T, +Felt252DictValue<T>> of UserDatabaseTrait<T> {
    // Creates a database
    fn new() -> UserDatabase<T> {
        UserDatabase { users_updates: 0, balances: Default::default() }
    }

    // Get the user's balance
    fn get_balance<+Copy<T>>(ref self: UserDatabase<T>, name: felt252) -> T {
        self.balances.get(name)
    }

    // Add a user
    fn update_user<+Drop<T>>(ref self: UserDatabase<T>, name: felt252, balance: T) {
        self.balances.insert(name, balance);
        self.users_updates += 1;
    }
}
// ANCHOR_END: impl

// ANCHOR: destruct
impl UserDatabaseDestruct<T, +Drop<T>, +Felt252DictValue<T>> of Destruct<UserDatabase<T>> {
    fn destruct(self: UserDatabase<T>) nopanic {
        self.balances.squash();
    }
}
// ANCHOR_END: destruct

// ANCHOR: main
fn main() {
    let mut db = UserDatabaseTrait::<u64>::new();

    db.update_user('Alex', 100);
    db.update_user('Maria', 80);

    db.update_user('Alex', 40);
    db.update_user('Maria', 0);

    let alex_latest_balance = db.get_balance('Alex');
    let maria_latest_balance = db.get_balance('Maria');

    assert!(alex_latest_balance == 40, "Expected 40");
    assert!(maria_latest_balance == 0, "Expected 0");
}
// ANCHOR_END: main



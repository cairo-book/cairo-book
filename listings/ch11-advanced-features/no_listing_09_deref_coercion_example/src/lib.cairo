//ANCHOR: UserProfile
// Define a struct for UserProfile
#[derive(Drop)]
struct UserProfile {
    username: felt252,
    email: felt252,
    age: u16,
}
ANCHOR_END: UserProfile

// ANCHOR: Account
// Define a struct for Account which contains UserProfile
struct Account {
    profile: UserProfile,
}
// ANCHOR_END: Account

// ANCHOR: impl
// Implement Deref trait for Account to dereference to UserProfile
impl DerefAccountToUserProfile of Deref<Account> {
    type Target = UserProfile;
    fn deref(self: Account) -> UserProfile {
        // Return the inner profile
        self.profile
    }
}

// Implement DerefMut trait for Account to allow mutable dereference
impl DerefMutAccountToUserProfile of DerefMut<Account> {
    type Target = UserProfile;
    fn deref_mut(ref self: Account) -> UserProfile {
        // Return a mutable reference to the inner profile
        self.profile
    }
}
// ANCHOR_END: impl

// ANCHOR: main
fn main() {
    // Create a new UserProfile
    let profile = UserProfile {
        username: 'john_doe',
        email: 'john@example.com',
        age: 30,
    };

    // Create an Account with the UserProfile
    let account = Account { profile };

    // Access and print the username directly
    print_username(account);

    // Access and print the age directly
    print_age(account);

    // Update the age
    update_age(account);

    // Print the updated age
    print_age(account);
}

#[inline(never)]
fn print_username(account: Account) {
    // Access the username field directly via deref coercion
    let username = account.username;
    println!("Username: {}", username);
}

#[inline(never)]
fn print_age(account: Account) {
    // Access the age field directly via deref coercion
    let age = account.age;
    println!("Age: {}", age);
}

#[inline(never)]
fn update_age(ref account: Account, age: u16) {
    // Mutably access the age field via deref_mut coercion
    account.age = age;
}
// ANCHOR_END: main
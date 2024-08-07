use core::ops::DerefMut;
// ANCHOR: UserProfile
// Define a struct for UserProfile
#[derive(Drop, Copy)]
struct UserProfile {
    username: felt252,
    email: felt252,
    age: u16,
}
// ANCHOR_END: UserProfile

// ANCHOR: Wrapper
// Define a generic wrapper type Wrapper<UserProfile>
#[derive(Drop, Copy)]
struct Wrapper<T> {
    value: T,
}
// ANCHOR_END: Wrapper

// ANCHOR: deref
// Implement Deref trait for Wrapper<UserProfile>
impl DerefWrapper<T> of Deref<Wrapper<T>> {
    type Target = T;
    fn deref(self: Wrapper<T>) -> T {
        // Return the inner value
        self.value
    }
}

// // Implement DerefMut trait for Wrapper<UserProfile>
impl DerefMutWrapper<T, +Copy<T>> of DerefMut<Wrapper<T>> {
    type Target = T;
    fn deref_mut(ref self: Wrapper<T>) -> T {
        // Return a mutable reference to the inner value
        self.value
    }
}
// // ANCHOR_END: deref

// ANCHOR: main
// Example usage
fn main() {
    // Create a new UserProfile
    let mut profile = UserProfile {
        username: 'john_doe',
        email: 'john@example.com',
        age: 30,
    };

    // Wrap the UserProfile in Wrapper
    let mut wrapped_profile = Wrapper{ value: profile };

    // Access and print the username directly
    print_username(wrapped_profile);

    // Access and print the age directly
    print_age(wrapped_profile);

    // Update the age
    update_age(ref wrapped_profile, 25);

    // Print the updated age
    print_age(wrapped_profile);
}

#[inline(never)]
fn print_username(wrapped_profile: Wrapper<UserProfile>) {
    // Access the username field directly via deref coercion
    let username = wrapped_profile.username;
    println!("Username: {}", username);
}

#[inline(never)]
fn print_age(wrapped_profile: Wrapper<UserProfile>) {
    // Access the age field directly via deref coercion
    let age = wrapped_profile.age;
    println!("Age: {}", age);
}

#[inline(never)]
fn update_age(ref wrapped_profile: Wrapper<UserProfile>, age: u16) {
    // Mutably access the UserProfile via deref_mut coercion
    let updated_profile = Wrapper{value: UserProfile{username: wrapped_profile.username, email: wrapped_profile.email, age: age}};
    wrapped_profile = updated_profile;
}
// ANCHOR_END: main
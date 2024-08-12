use core::ops::DerefMut;
// ANCHOR: Wrapper
#[derive(Drop, Copy)]
struct UserProfile {
    username: felt252,
    email: felt252,
    age: u16,
}

#[derive(Drop, Copy)]
struct Wrapper<T> {
    value: T,
}
// ANCHOR_END: Wrapper

// ANCHOR: derefMut
impl DerefMutWrapper<T, +Copy<T>> of DerefMut<Wrapper<T>> {
    type Target = T;
    fn deref_mut(ref self: Wrapper<T>) -> T {
        self.value
    }
}
//ANCHOR_END: derefMut

// ANCHOR: error
fn error() {
    let wrapped_profile = Wrapper {
        value: UserProfile { username: 'john_doe', email: 'john@example.com', age: 30 }
    };
    // Uncommenting the next line will cause a compilation error
// println!("Username: {}", wrapped_profile.username);
}
// ANCHOR_END: error

// ANCHOR: example
fn example() {
    let mut wrapped_profile = Wrapper {
        value: UserProfile { username: 'john_doe', email: 'john@example.com', age: 30 }
    };

    println!("Username: {}", wrapped_profile.username);
    println!("Current age: {}", wrapped_profile.age);

    // Mutably update the wrapped UserProfile's age
    wrapped_profile.value.age = 35;

    println!("Current age: {}", wrapped_profile.age);
}
// ANCHOR_END: example

fn main() {
    error();
    example();
}

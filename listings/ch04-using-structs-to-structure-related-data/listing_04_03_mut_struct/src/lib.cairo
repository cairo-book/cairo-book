// ANCHOR: all
#[derive(Copy, Drop)]
struct User {
    active: bool,
    username: felt252,
    email: felt252,
    sign_in_count: u64,
}
// ANCHOR: main
fn main() {
    let mut user1 = User {
        active: true, username: 'someusername123', email: 'someone@example.com', sign_in_count: 1
    };
    user1.email = 'anotheremail@example.com';
}
// ANCHOR_END: main

// ANCHOR: build_user
fn build_user(email: felt252, username: felt252) -> User {
    User { active: true, username: username, email: email, sign_in_count: 1, }
}
// ANCHOR_END: build_user

// ANCHOR: build_user2
fn build_user_short(email: felt252, username: felt252) -> User {
    User { active: true, username, email, sign_in_count: 1, }
}
// ANCHOR_END: build_user2
// ANCHOR_END: all



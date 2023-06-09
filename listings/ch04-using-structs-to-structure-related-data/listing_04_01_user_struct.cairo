// ANCHOR: all
// ANCHOR: user
#[derive(Copy, Drop)]
struct User {
    active: bool,
    username: felt252,
    email: felt252,
    sign_in_count: u64,
}
// ANCHOR_END: user
// ANCHOR: main
fn main() {
    let user1 = User {
        active: true, username: 'someusername123', email: 'someone@example.com', sign_in_count: 1
    };
}
// ANCHOR_END: main

// ANCHOR_END: all



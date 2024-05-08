use core::byte_array;
#[derive(Drop)]
struct User {
    active: bool,
    username: ByteArray,
    email: ByteArray,
    sign_in_count: u64,
}

// ANCHOR: here
fn main() {
    // --snip--
    // ANCHOR_END: here

    let user1 = User {
        email: "someone@example.com", username: "someusername123", active: true, sign_in_count: 1,
    };
    // ANCHOR: here

    let user2 = User {
        active: user1.active,
        username: user1.username,
        email: "another@example.com",
        sign_in_count: user1.sign_in_count,
    };
}
// ANCHOR_END: here

// ANCHOR: enum_example
#[derive(Drop)]
enum Direction {
    North: u128,
    East: u128,
    South: u128,
    West: u128,
}
// ANCHOR_END: enum_example

fn main() {
    // ANCHOR: here
    let direction = Direction::North(10);
    // ANCHOR_END: here
}

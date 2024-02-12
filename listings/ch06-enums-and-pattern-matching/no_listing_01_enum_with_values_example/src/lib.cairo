// ANCHOR: all
// ANCHOR: enum_example
#[derive(Drop)]
enum Direction {
    North: u128,
    East: u128,
    Sout: u128,
    West: u128,
}
// ANCHOR_END: enum_example

fn main() {
    // ANCHOR: here
    let direction = Direction::North(10);
// ANCHOR_END: here
}
// ANCHOR_END: all



// ANCHOR: all
// ANCHOR: enum_example
#[derive(Drop)]
enum Direction {
    North,
    East,
    South,
    West,
}
// ANCHOR_END: enum_example

fn main() {
    // ANCHOR: here
    let direction = Direction::North;
// ANCHOR_END: here
}
// ANCHOR_END: all



#[derive(Copy, Drop)]
struct Rectangle {
    width: u64,
    height: u64,
}

// ANCHOR: here
trait RectangleTrait {
    fn square(size: u64) -> Rectangle;
}

impl RectangleImpl of RectangleTrait {
    fn square(size: u64) -> Rectangle {
        Rectangle { width: size, height: size }
    }
}
// ANCHOR_END: here



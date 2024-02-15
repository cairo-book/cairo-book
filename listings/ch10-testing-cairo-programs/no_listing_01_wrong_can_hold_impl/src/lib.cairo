#[derive(Copy, Drop)]
struct Rectangle {
    width: u64,
    height: u64,
}

trait RectangleTrait {
    fn can_hold(self: @Rectangle, other: @Rectangle) -> bool;
}

// ANCHOR: wrong_impl
impl RectangleImpl of RectangleTrait {
    fn can_hold(self: @Rectangle, other: @Rectangle) -> bool {
        *self.width < *other.width && *self.height > *other.height
    }
}
// ANCHOR_END: wrong_impl



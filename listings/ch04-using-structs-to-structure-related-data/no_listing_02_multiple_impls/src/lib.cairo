#[derive(Copy, Drop)]
struct Rectangle {
    width: u64,
    height: u64,
}

// ANCHOR: here
trait RectangleCalc {
    fn area(self: @Rectangle) -> u64;
}
impl RectangleCalcImpl of RectangleCalc {
    fn area(self: @Rectangle) -> u64 {
        (*self.width) * (*self.height)
    }
}

trait RectangleCmp {
    fn can_hold(self: @Rectangle, other: @Rectangle) -> bool;
}

impl RectangleCmpImpl of RectangleCmp {
    fn can_hold(self: @Rectangle, other: @Rectangle) -> bool {
        *self.width > *other.width && *self.height > *other.height
    }
}
// ANCHOR_END: here



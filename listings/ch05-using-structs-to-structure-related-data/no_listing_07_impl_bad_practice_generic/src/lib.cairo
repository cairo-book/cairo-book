#[derive(Copy, Drop)]
struct Rectangle {
    width: u64,
    height: u64,
}

#[derive(Copy, Drop)]
struct Circle {
    radius: u64,
    center: (u64, u64),
}

//ANCHOR: bad_implementation
trait RectangleTrait {
    fn RectangleArea(self: @Rectangle) -> u64;
    fn CircleArea(self: @Circle) -> u64;
}

impl ShapeImpl of RectangleTrait {
    fn RectangleArea(self: @Rectangle) -> u64 {
        (*self.width) * (*self.height)
    }

    fn CircleArea(self: @Circle) -> u64 {
        (*self.radius) * (*self.radius) * 3
    }
}
//ANCHOR_END: bad_implementation

//ANCHOR: good_implementation
trait ShapeTrait<T> {
    fn area(self: @T) -> u64;
}

impl RectangleImpl of ShapeTrait<Rectangle> {
    fn area(self: @Rectangle) -> u64 {
        (*self.width) * (*self.height)
    }
}

impl CircleImpl of ShapeTrait<Circle> {
    fn area(self: @Circle) -> u64 {
        (*self.radius) * (*self.radius) * 3
    }
}
//ANCHOR_END: good_implementation



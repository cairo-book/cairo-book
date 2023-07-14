use debug::PrintTrait;

#[derive(Copy, Drop)]
struct Rectangle {
    height: u64,
    width: u64,
}

#[derive(Copy, Drop)]
struct Circle {
    radius: u64
}

// Here T is an alias type which will be provided during implementation
trait ShapeGeometry<T> {
    fn boundary(self: T) -> u64;
    fn area(self: T) -> u64;
}

// Implementation RectangleGeometry passes in <Rectangle>
// to implement the trait for that type
impl RectangleGeometry of ShapeGeometry<Rectangle> {
    fn boundary(self: Rectangle) -> u64 {
        2 * (self.height + self.width)
    }
    fn area(self: Rectangle) -> u64 {
        self.height * self.width
    }
}

// We might have another struct Circle
// which can use the same trait spec
impl CircleGeometry of ShapeGeometry<Circle> {
    fn boundary(self: Circle) -> u64 {
        (2 * 314 * self.radius) / 100
    }
    fn area(self: Circle) -> u64 {
        (314 * self.radius * self.radius) / 100
    }
}

fn main() {
    let rect = Rectangle { height: 5, width: 7 };
    rect.area().print(); // 35
    rect.boundary().print(); // 24

    let circ = Circle { radius: 5 };
    circ.area().print(); // 78
    circ.boundary().print(); // 31
}

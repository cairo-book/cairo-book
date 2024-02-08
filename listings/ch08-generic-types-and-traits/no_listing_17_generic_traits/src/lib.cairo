#[derive(Copy, Drop)]
struct Rectangle {
    height: u64,
    width: u64,
}

#[derive(Copy, Drop)]
struct Circle {
    radius: u64
}

mod geometry {
    use super::Rectangle;

    // Here T is an alias type which will be provided during implementation
    pub(crate) trait ShapeGeometry<T> {
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
}

mod circle {
    // We need to import ShapeGeometry trait to be able to to define
    // boundary method for Circle
    use super::geometry::ShapeGeometry;
    use super::Circle;

    // Implementation CircleGeometry passes in <Circle>
    // to implement the imported trait for that type
    impl CircleGeometry of ShapeGeometry<Circle> {
        fn boundary(self: Circle) -> u64 {
            (2 * 314 * self.radius) / 100
        }
        fn area(self: Circle) -> u64 {
            (314 * self.radius * self.radius) / 100
        }
    }
}

use geometry::ShapeGeometry;
use circle::CircleGeometry;

fn main() {
    let rect = Rectangle { height: 5, width: 7 };
    println!("Rectangle area: {}", ShapeGeometry::area(rect)); //35
    println!("Rectangle boundary: {}", ShapeGeometry::boundary(rect)); //24

    let circ = Circle { radius: 5 };
    println!("Circle area: {}", CircleGeometry::area(circ)); //78
    println!("Circle boundary: {}", CircleGeometry::boundary(circ)); //31
}

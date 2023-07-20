use debug::PrintTrait;

#[derive(Drop, Copy)]
struct Rectangle {
    height: u64,
    width: u64,
}

//ANCHOR: trait
trait ShapeGeometry {
    fn boundary(self: Rectangle) -> u64;
    fn area(self: Rectangle) -> u64;
}
//ANCHOR_END: trait

//ANCHOR: impl
impl RectangleGeometry of ShapeGeometry {
    fn boundary(self: Rectangle) -> u64 {
        2 * (self.height + self.width)
    }
    fn area(self: Rectangle) -> u64 {
        self.height * self.width
    }
}
//ANCHOR_END: impl

//ANCHOR: main
fn main() {
    let rect = Rectangle { height: 5, width: 10 }; // Rectangle instantiation

    // First way, as a method on the struct instance
    let area1 = rect.area();
    // Second way, from the implementation
    let area2 = RectangleGeometry::area(rect);
    // Third way, from the trait
    let area3 = ShapeGeometry::area(rect);

    // `area1` has same value as `area2` and `area3`
    area1.print();
    area2.print();
    area3.print();
}
//ANCHOR_END: main



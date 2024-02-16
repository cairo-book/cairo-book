#[derive(Copy, Drop)]
struct Rectangle {
    width: u64,
    height: u64,
}

//ANCHOR: trait_definition
trait RectangleTrait {
    fn area(self: @Rectangle) -> u64;
}
//ANCHOR_END: trait_definition

//ANCHOR: trait_implementation
impl RectangleImpl of RectangleTrait {
    fn area(self: @Rectangle) -> u64 {
        (*self.width) * (*self.height)
    }
}
//ANCHOR_END: trait_implementation

//ANCHOR: reference_impl
trait RectangleTransformTrait {
    fn scale(ref self: Rectangle, factor: u64);
}

impl RectangleTransformImpl of RectangleTransformTrait {
    fn scale(ref self: Rectangle, factor: u64) {
        self.width *= factor;
        self.height *= factor;
    }
}
//ANCHOR_END: reference_impl

//ANCHOR: main
fn main() {
    let rect1 = Rectangle { width: 30, height: 50, };
    println!("Area is {}", rect1.area());
}
//ANCHOR_END: main



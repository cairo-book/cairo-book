#[derive(Copy, Drop)]
struct Rectangle {
    width: u64,
    height: u64,
}

// ANCHOR: trait_impl
trait RectangleTrait {
    fn area(self: @Rectangle) -> u64;
    fn new(width: u64, height: u64) -> Rectangle;
    fn compare(r1: @Rectangle, r2: @Rectangle) -> bool;
}

impl RectangleImpl of RectangleTrait {
    fn area(self: @Rectangle) -> u64 {
        (*self.width) * (*self.height)
    }

    fn new(width: u64, height: u64) -> Rectangle {
        Rectangle { width, height }
    }

    fn compare(r1: @Rectangle, r2: @Rectangle) -> bool {
        let r1_area = r1.area();
        let r2_area = r2.area();

        return r1_area == r2_area;
    }
}
// ANCHOR_END: trait_impl

// ANCHOR: main
fn main() {
    let rect1 = RectangleTrait::new(30, 50);
    let rect2 = RectangleTrait::new(10, 40);

    println!("Are rect1 and rect2 equals ? {}", RectangleTrait::compare(@rect1, @rect2));
}
// ANCHOR_END: main



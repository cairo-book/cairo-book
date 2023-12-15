#[derive(Copy, Drop)]
struct Rectangle {
    width: u64,
    height: u64,
}

trait RectangleTrait {
    fn width(self: @Rectangle) -> bool;
}

impl RectangleImpl of RectangleTrait {
    fn width(self: @Rectangle) -> bool {
        (*self.width) > 0
    }
}

fn main() {
    let rect1 = Rectangle { width: 30, height: 50, };
    println!("Width: {}", rect1.width);
}

//ANCHOR:all
//ANCHOR: here
use debug::PrintTrait;

struct Rectangle {
    width: u64,
    height: u64,
}

fn main() {
    let rectangle = Rectangle { width: 30, height: 10, };
    rectangle.print();
}
//ANCHOR_END: here

impl RectanglePrintImpl of PrintTrait<Rectangle> {
    fn print(self: Rectangle) {
        self.width.print();
        self.height.print();
    }
}
//ANCHOR_END:all



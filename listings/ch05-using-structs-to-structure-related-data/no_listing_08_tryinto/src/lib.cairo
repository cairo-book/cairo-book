// Compiler automatically imports the core library, so you can omit this import
use core::traits::TryInto;

#[derive(Drop)]
struct Rectangle {
    width: u64,
    height: u64,
}

#[derive(Drop, PartialEq)]
struct Square {
    side_length: u64,
}

impl RectangleIntoSquare of TryInto<Rectangle, Square> {
    fn try_into(self: Rectangle) -> Option<Square> {
        if self.height == self.width {
            Option::Some(Square { side_length: self.height })
        } else {
            Option::None
        }
    }
}

fn main() {
    let rectangle = Rectangle { width: 8, height: 8 };
    let result: Option<Square> = rectangle.try_into();
    let expected: Option<Square> = Option::Some(Square { side_length: 8 });
    assert!(result == expected, "conversion failed");

    let rectangle = Rectangle { width: 5, height: 8 };
    let result: Option<Square> = rectangle.try_into();
    let expected: Option<Square> = Option::None;
    assert!(result == expected, "try_into should return Option::None");
}

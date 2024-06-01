#[derive(Copy, Drop)]
struct Rectangle {
    width: u64,
    height: u64,
}

impl PartialEqImpl of PartialEq<Rectangle> {
    fn eq(lhs: @Rectangle, rhs: @Rectangle) -> bool {
        (*lhs.width) * (*lhs.height) == (*rhs.width) * (*rhs.height)
    }

    fn ne(lhs: @Rectangle, rhs: @Rectangle) -> bool {
        (*lhs.width) * (*lhs.height) != (*rhs.width) * (*rhs.height)
    }
}

fn main() {
    let rect1 = Rectangle { width: 30, height: 50 };
    let rect2 = Rectangle { width: 50, height: 30 };

    println!("Are rect1 and rect2 equal? {}", rect1 == rect2);
}

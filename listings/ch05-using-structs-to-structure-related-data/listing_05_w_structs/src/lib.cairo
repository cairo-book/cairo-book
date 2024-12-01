struct Rectangle {
    width: u64,
    height: u64,
}

fn main() {
    let rectangle = Rectangle { width: 30, height: 10 };
    let area = area(rectangle);
    println!("Area is {}", area);
}

fn area(rectangle: Rectangle) -> u64 {
    rectangle.width * rectangle.height
}

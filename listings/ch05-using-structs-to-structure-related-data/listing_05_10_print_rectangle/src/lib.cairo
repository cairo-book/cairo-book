//ANCHOR:all
//ANCHOR: here
#[derive(Drop)]
struct Rectangle {
    width: u64,
    height: u64,
}

fn main() {
    let rectangle = Rectangle { width: 30, height: 10, };
    println!("Width is {}", rectangle.width);
    println!("Height is {}", rectangle.height);
}
//ANCHOR_END: here

//ANCHOR_END:all



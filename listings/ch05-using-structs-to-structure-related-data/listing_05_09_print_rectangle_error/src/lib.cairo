//TAG: does_not_compile
//ANCHOR:all
//ANCHOR: here
#[derive(Drop)]
struct Rectangle {
    width: u64,
    height: u64,
}

fn main() {
    let rectangle = Rectangle { width: 30, height: 10, };
    println!("Rectangle width and height are {}", rectangle);
}
//ANCHOR_END: here

//ANCHOR_END:all



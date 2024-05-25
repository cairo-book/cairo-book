//ANCHOR:all
fn main() {
    let width = 30;
    let height = 10;
    let area = area(width, height);
    println!("Area is {}", area);
}

//ANCHOR: here
fn area(width: u64, height: u64) -> u64 {
    //ANCHOR_END: here
    width * height
}
//ANCHOR_END:all



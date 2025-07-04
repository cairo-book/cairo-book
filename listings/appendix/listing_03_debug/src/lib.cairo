#[derive(Copy, Drop, Debug)]
struct Point {
    x: u8,
    y: u8,
}

#[executable]
fn main() {
    let p = Point { x: 1, y: 3 };
    println!("{:?}", p);
}

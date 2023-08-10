use debug::PrintTrait;
fn main() {
    let rectangle = (30, 10);
    let area = area(rectangle);
    area.print(); // print out the area
}

fn area(dimension: (u64, u64)) -> u64 {
    let (x, y) = dimension;
    x * y
}

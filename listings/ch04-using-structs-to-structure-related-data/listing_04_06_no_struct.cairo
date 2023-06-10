use debug::PrintTrait;
fn main() {
    let width1 = 30;
    let height1 = 10;
    let area = area(width1, height1);
    area.print();
}

fn area(width: u64, height: u64) -> u64 {
    width * height
}
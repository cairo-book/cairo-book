#[derive(Drop)]
struct Rectangle {
    height: u64,
    width: u64,
}

#[executable]
fn main() {
    let mut rec = Rectangle { height: 3, width: 10 };
    let first_snapshot = @rec; // Take a snapshot of `rec` at this point in time
    rec.height = 5; // Mutate `rec` by changing its height
    let first_area = calculate_area(first_snapshot); // Calculate the area of the snapshot
    let second_area = calculate_area(@rec); // Calculate the current area
    println!("The area of the rectangle when the snapshot was taken is {}", first_area);
    println!("The current area of the rectangle is {}", second_area);
}

fn calculate_area(rec: @Rectangle) -> u64 {
    *rec.height * *rec.width
}

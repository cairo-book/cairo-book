fn get_x() -> Option<u32> {
    Some(5)
}

fn get_y() -> Option<u32> {
    Some(8)
}

#[executable]
fn main() {
    // Using a let chain to combine pattern matching and additional conditions
    if let Some(x) = get_x() && x > 0 && let Some(y) = get_y() && y > 0 {
        let sum: u32 = x + y;
        println!("sum: {}", sum);
        return;
    }
    println!("x or y is not positive");
    // else is not supported yet;
}

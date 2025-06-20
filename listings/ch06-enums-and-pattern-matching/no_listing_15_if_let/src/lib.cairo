#[executable]
fn main() {
    // ANCHOR: here
    let number = Some(5);
    if let Some(max) = number {
        println!("The maximum is configured to be {}", max);
    }
    // ANCHOR_END: here
}

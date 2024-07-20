fn main() {
    // ANCHOR: here
    let number = Option::Some(5);
    if let Option::Some(max) = number {
        println!("The maximum is configured to be {}", max);
    }
    // ANCHOR_END: here
}


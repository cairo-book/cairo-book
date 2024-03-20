fn if_let_example() {
    // ANCHOR: if_let_example
    let number = Option::Some(5);
    if let Option::Some(max) = number {
        println!("The maximum is configured to be {}", max);
    }
    // ANCHOR_END: if_let_example
}


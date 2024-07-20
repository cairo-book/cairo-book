fn main() {
    // ANCHOR: match
    let config_max = Option::Some(5);
    match config_max {
        Option::Some(max) => println!("The maximum is configured to be {}", max),
        _ => (),
    }
    // ANCHOR_END: match
}

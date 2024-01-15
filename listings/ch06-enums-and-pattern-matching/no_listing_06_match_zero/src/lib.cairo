// ANCHOR: here
fn did_i_win(value: felt252) {
    match value {
        0 => println!("you won!"),
        1 => println!("nothing happens"),
        _ => println!("you lost...")
    }
}
// ANCHOR_END: here



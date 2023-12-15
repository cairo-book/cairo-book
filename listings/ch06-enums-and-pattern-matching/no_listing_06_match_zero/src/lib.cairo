// ANCHOR: here
fn did_i_win(nb: felt252) {
    match nb {
        0 => println!("You won!"),
        _ => println!("You lost..."),
    }
}
// ANCHOR_END: here



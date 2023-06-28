use debug::PrintTrait;

// ANCHOR: here
fn did_i_win(nb: felt252) {
    match nb {
        0 => ('You won!').print(),
        _ => ('You lost...').print(),
    }
}
// ANCHOR_END: here



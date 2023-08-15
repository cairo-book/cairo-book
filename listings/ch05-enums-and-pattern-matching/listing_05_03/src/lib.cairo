// ANCHOR: all
enum Coin {
    Penny: (),
    Nickel: (),
    Dime: (),
    Quarter: (),
}

// ANCHOR: function
fn value_in_cents(coin: Coin) -> felt252 {
    match coin {
        Coin::Penny(_) => 1,
        Coin::Nickel(_) => 5,
        Coin::Dime(_) => 10,
        Coin::Quarter(_) => 25,
    }
}
// ANCHOR_END: function
// ANCHOR_END: all



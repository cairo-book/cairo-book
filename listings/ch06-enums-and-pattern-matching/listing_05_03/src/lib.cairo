// ANCHOR: all
enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter,
}

// ANCHOR: function
fn value_in_cents(coin: Coin) -> felt252 {
    match coin {
        Coin::Penny => 1,
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter => 25,
    }
}
// ANCHOR_END: function
// ANCHOR_END: all



use debug::PrintTrait;
enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter,
}

// ANCHOR: here
fn value_in_cents(coin: Coin) -> felt252 {
    match coin {
        Coin::Penny => {
            ('Lucky penny!').print();
            1
        },
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter => 25,
    }
}
// ANCHOR_END: here



#[derive(Drop)]
enum UsState {
    Alabama: felt252,
    Alaska: felt252,
}

#[derive(Drop)]
enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter: UsState,
}
// ANCHOR_END: enum_def

// ANCHOR: function
fn value_in_cents(coin: Coin) -> felt252 {
    match coin {
        Coin::Penny => 1,
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter(state) => {
            match state {
                UsState::Alabama => println!("Alabama"),
                UsState::Alaska => println!("Alaska"),
            }
            25
        },
    }
}
// ANCHOR_END: function


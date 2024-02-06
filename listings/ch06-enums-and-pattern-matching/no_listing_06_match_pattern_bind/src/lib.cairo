// ANCHOR: enum_def

#[derive(Drop)]
enum UsState {
    Alabama,
    Alaska,
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
                UsState::Alabama => println!("State quarter from Alabama"),
                UsState::Alaska => println!("State quarter from Alaska"),
            }
            25
        },
    }
}
// ANCHOR_END: function



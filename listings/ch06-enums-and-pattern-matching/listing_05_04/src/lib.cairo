use debug::PrintTrait;

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
            state.print();
            25
        },
    }
}
// ANCHOR_END: function

// ANCHOR: print_impl
impl UsStatePrintImpl of PrintTrait<UsState> {
    fn print(self: UsState) {
        match self {
            UsState::Alabama => ('Alabama').print(),
            UsState::Alaska => ('Alaska').print(),
        }
    }
}
// ANCHOR_END: print_impl



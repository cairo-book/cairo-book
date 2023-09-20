#[derive(Drop)]
enum UsState {
    Alabama: (),
    Alaska: (),
}

#[derive(Drop)]
enum Coin {
    Penny: (),
    Nickel: (),
    Dime: (),
    Quarter: (UsState,),
}

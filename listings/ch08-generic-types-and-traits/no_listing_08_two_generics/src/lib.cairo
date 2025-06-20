#[derive(Drop)]
struct Wallet<T, U> {
    balance: T,
    address: U,
}

#[executable]
fn main() {
    let w = Wallet { balance: 3, address: 14 };
}

#[derive(Drop)]
struct Wallet<T> {
    balance: T,
}

#[executable]
fn main() {
    let w = Wallet { balance: 3 };
}

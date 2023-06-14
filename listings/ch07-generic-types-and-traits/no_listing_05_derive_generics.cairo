#[derive(Drop)]
struct Wallet<T> {
    balance: T
}


fn main() {
    let w = Wallet { balance: 3 };
}

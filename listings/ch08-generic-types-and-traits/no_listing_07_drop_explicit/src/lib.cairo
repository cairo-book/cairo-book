struct Wallet<T> {
    balance: T,
}

impl WalletDrop<T, +Drop<T>> of Drop<Wallet<T>>;

#[executable]
fn main() {
    let w = Wallet { balance: 3 };
}

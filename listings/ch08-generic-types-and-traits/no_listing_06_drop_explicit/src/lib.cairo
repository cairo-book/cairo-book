struct Wallet<T> {
    balance: T
}

impl WalletDrop<T, impl TDrop: Drop<T>> of Drop<Wallet<T>>;

fn main() {
    let w = Wallet { balance: 3 };
}

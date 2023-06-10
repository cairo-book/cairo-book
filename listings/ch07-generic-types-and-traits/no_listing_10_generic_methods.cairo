#[derive(Copy, Drop)]
struct Wallet<T> {
    balance: T
}

trait WalletTrait<T> {
    fn balance(self: @Wallet<T>) -> T;
}

impl WalletImpl<T, impl TCopy: Copy<T>> of WalletTrait<T> {
    fn balance(self: @Wallet<T>) -> T {
        return *self.balance;
    }
}

fn main() {
    let w = Wallet { balance: 50 };
    assert(w.balance() == 50, 0);
}

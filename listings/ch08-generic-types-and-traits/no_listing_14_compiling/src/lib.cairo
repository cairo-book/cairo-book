#[derive(Drop, Copy)]
struct Wallet<T, U> {
    balance: T,
    address: U,
}

// ANCHOR: trait_impl
trait WalletMixTrait<T1, U1> {
    fn mixup<T2, +Drop<T2>, U2, +Drop<U2>>(
        self: Wallet<T1, U1>, other: Wallet<T2, U2>
    ) -> Wallet<T1, U2>;
}

impl WalletMixImpl<T1, +Drop<T1>, U1, +Drop<U1>> of WalletMixTrait<T1, U1> {
    fn mixup<T2, +Drop<T2>, U2, +Drop<U2>>(
        self: Wallet<T1, U1>, other: Wallet<T2, U2>
    ) -> Wallet<T1, U2> {
        Wallet { balance: self.balance, address: other.address }
    }
}
// ANCHOR_END: trait_impl

// ANCHOR: main
fn main() {
    let w1 = Wallet { balance: true, address: 10_u128 };
    let w2 = Wallet { balance: 32, address: 100_u8 };

    let w3 = w1.mixup(w2);

    assert(w3.balance == true, 0);
    assert(w3.address == 100, 0);
}
// ANCHOR_END: main



#[derive(Drop, Copy)]
struct Wallet<T, U> {
    balance: T,
    address: U,
}

// ANCHOR: trait_impl
trait WalletMixTrait<T1, U1> {
    fn mixup<T2, impl T2Drop: Drop<T2>, U2, impl U2Drop: Drop<U2>>(
        self: Wallet<T1, U1>, other: Wallet<T2, U2>
    ) -> Wallet<T1, U2>;
}

impl WalletMixImpl<T1, impl T1Drop: Drop<T1>, U1, impl U1Drop: Drop<U1>> of WalletMixTrait<T1, U1> {
    fn mixup<T2, impl T2Drop: Drop<T2>, U2, impl U2Drop: Drop<U2>>(
        self: Wallet<T1, U1>, other: Wallet<T2, U2>
    ) -> Wallet<T1, U2> {
        Wallet { balance: self.balance, address: other.address }
    }
}
// ANCHOR_END: trait_impl

// ANCHOR: main
fn main() {
    let w1 = Wallet { balance: true, address: 10 };
    let w2 = Wallet { balance: 32, address: 100 };

    let w3 = w1.mixup(w2);

    assert(w3.balance == true, 0);
    assert(w3.address == 100, 0);
}
// ANCHOR_END: main



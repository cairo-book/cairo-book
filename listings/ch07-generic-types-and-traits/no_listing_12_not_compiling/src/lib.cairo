//TAG: does_not_compile
//ANCHOR: struct
struct Wallet<T, U> {
    balance: T,
    address: U,
}
//ANCHOR_END: struct

//ANCHOR:trait_impl
// This does not compile!
trait WalletMixTrait<T1, U1> {
    fn mixup<T2, U2>(self: Wallet<T1, U1>, other: Wallet<T2, U2>) -> Wallet<T1, U2>;
}

impl WalletMixImpl<T1, U1> of WalletMixTrait<T1, U1> {
    fn mixup<T2, U2>(self: Wallet<T1, U1>, other: Wallet<T2, U2>) -> Wallet<T1, U2> {
        Wallet { balance: self.balance, address: other.address }
    }
}
//ANCHOR_END: trait_impl



enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter,
}

// ANCHOR: here
fn vending_machine_accept(coin: Coin) -> bool {
    match coin {
        Coin::Dime | Coin::Quarter => true,
        _ => false,
    }
}
// ANCHOR_END: here

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    #[available_gas(2000000)]
    fn test_vending_machine_accept() {
        assert_eq!(vending_machine_accept(Coin::Penny), false);
        assert_eq!(vending_machine_accept(Coin::Nickel), false);
        assert_eq!(vending_machine_accept(Coin::Dime), true);
        assert_eq!(vending_machine_accept(Coin::Quarter), true);
    }
}

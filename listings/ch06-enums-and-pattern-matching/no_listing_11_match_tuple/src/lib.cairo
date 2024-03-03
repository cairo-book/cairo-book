// ANCHOR: enum_def
#[derive(Drop)]
enum DayType {
    Week,
    Weekend,
    Holiday
}
// ANCHOR_END: enum_def

#[derive(Drop)]
enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter,
}

// ANCHOR: here
fn vending_machine_accept(c: (DayType, Coin)) -> bool {
    match c {
        (DayType::Week, _) => true,
        (_, Coin::Dime) | (_, Coin::Quarter) => true,
        (_, _) => false,
    }
}
// ANCHOR_END: here

#[cfg(test)]
mod test {
    use super::{DayType, Coin, vending_machine_accept};

    #[test]
    #[available_gas(2000000)]
    fn test_vending_machine_accept_week() {
        assert_eq!(vending_machine_accept((DayType::Week, Coin::Penny)), true);
        assert_eq!(vending_machine_accept((DayType::Week, Coin::Nickel)), true);
        assert_eq!(vending_machine_accept((DayType::Week, Coin::Dime)), true);
        assert_eq!(vending_machine_accept((DayType::Week, Coin::Quarter)), true);
    }

    #[test]
    #[available_gas(2000000)]
    fn test_vending_machine_accept_weekend() {
        assert_eq!(vending_machine_accept((DayType::Weekend, Coin::Penny)), false);
        assert_eq!(vending_machine_accept((DayType::Weekend, Coin::Nickel)), false);
        assert_eq!(vending_machine_accept((DayType::Weekend, Coin::Dime)), true);
        assert_eq!(vending_machine_accept((DayType::Weekend, Coin::Quarter)), true);
    }

    #[test]
    #[available_gas(2000000)]
    fn test_vending_machine_accept_holiday() {
        assert_eq!(vending_machine_accept((DayType::Holiday, Coin::Penny)), false);
        assert_eq!(vending_machine_accept((DayType::Holiday, Coin::Nickel)), false);
        assert_eq!(vending_machine_accept((DayType::Holiday, Coin::Dime)), true);
        assert_eq!(vending_machine_accept((DayType::Holiday, Coin::Quarter)), true);
    }
}

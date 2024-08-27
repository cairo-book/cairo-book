const TWO_TEN: u128 = pow!(12, 2);

fn main() {
    println!("{}", TWO_TEN);
}

#[cfg(test)]
mod tests {
    #[test]
    fn test_pow_macro() {
        assert_eq!(super::TWO_TEN, 144);
        assert_eq!(pow!(10, 2), 100);
        assert_eq!(pow!(20, 30), 1073741824000000000000000000000000000000_felt252);
        assert_eq!(
            pow!(2, 255),
            57896044618658097711785492504343953926634992332820282019728792003956564819968_u256
        );
    }
}

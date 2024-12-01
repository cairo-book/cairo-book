const TWO_TEN: u128 = pow!(12, 2);

// ANCHOR: derive_macro
#[derive(Add, AddAssign, Sub, SubAssign, Mul, MulAssign, Div, DivAssign, Debug, Drop, PartialEq)]
pub struct B {
    pub a: u8,
    pub b: u16,
}
// ANCHOR_END: derive_macro

fn main() {
    println!("{}", TWO_TEN);

    // ANCHOR: b_struct
    let b1 = B { a: 1, b: 2 };
    let b2 = B { a: 3, b: 4 };
    let b3 = b1 + b2;
    // ANCHOR_END: b_struct

    println!("{:?}", b3);
}

#[cfg(test)]
mod tests {
    use super::*;

    // ANCHOR: pow_macro
    #[test]
    fn test_pow_macro() {
        assert_eq!(super::TWO_TEN, 144);
        assert_eq!(pow!(10, 2), 100);
        assert_eq!(pow!(20, 30), 1073741824000000000000000000000000000000_felt252);
        assert_eq!(
            pow!(2, 255),
            57896044618658097711785492504343953926634992332820282019728792003956564819968_u256,
        );
    }
    // ANCHOR_END: pow_macro

    #[test]
    fn test_add_derive() {
        let b1 = B { a: 1, b: 2 };
        let b2 = B { a: 3, b: 4 };
        let b3 = b1 + b2;
        assert_eq!(b3, B { a: 4, b: 6 });
    }
}

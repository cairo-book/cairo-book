pub fn add(a: u32, b: u32) -> u32 {
    internal_adder(a, 2)
}

fn internal_adder(a: u32, b: u32) -> u32 {
    a + b
}

#[cfg(test)]
mod tests {
    use super::internal_adder;

    #[test]
    fn add() {
        assert_eq!(4, internal_adder(2, 2));
    }
}

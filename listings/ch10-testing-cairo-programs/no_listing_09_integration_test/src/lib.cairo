pub fn add_two(a: u32) -> u32 {
    internal_adder(a, 2)
}

fn internal_adder(a: u32, b: u32) -> u32 {
    a + b
}

#[cfg(test)]
mod tests {
    #[test]
    fn add() {
        assert_eq!(4, super::it_adds_two(2, 2));
    }
}
pub fn it_adds_two(a: u8, b: u8) -> u8 {
    a + b
}

#[cfg(test)]
mod tests {
    #[test]
    fn add() {
        assert_eq!(4, super::it_adds_two(2, 2));
    }
}

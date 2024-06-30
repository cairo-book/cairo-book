pub fn add_two(a: u32) -> u32 {
    a + 2
}

#[cfg(test)]
mod tests {
    use super::add_two;

    #[test]
    fn it_adds_two() {
        assert_eq!(4, add_two(2));
    }

    #[test]
    fn wrong_check() {
        assert_ne!(0, add_two(2));
    }
}

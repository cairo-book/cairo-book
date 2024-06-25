// TAG: tests_fail
pub fn add_two(a: u32) -> u32 {
    a + 3
}

#[cfg(test)]
mod tests {
    use super::add_two;
    // ANCHOR: here
    #[test]
    fn it_adds_two() {
        assert_eq!(4, add_two(2), "Expected {}, got add_two(2)={}", 4, add_two(2));
    }
// ANCHOR_END: here
}

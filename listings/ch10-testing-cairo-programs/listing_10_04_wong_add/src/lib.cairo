// TAG: tests_fail

// ANCHOR: here
pub fn add_two(a: u32) -> u32 {
    a + 3
}
// ANCHOR_END: here

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_adds_two() {
        assert_eq!(4, add_two(2));
    }
}

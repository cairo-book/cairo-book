//ANCHOR: it_works
pub fn add(left: usize, right: usize) -> usize {
    left + right
}

#[cfg(test)]
mod tests {
    use super::add;

    #[test]
    fn it_works() {
        let result = add(2, 2);
        assert_eq!(result, 4);
    }
}
// ANCHOR_END: it_works

#[cfg(test)]
mod other_tests {
    // ANCHOR: exploration
    #[test]
    fn exploration() {
        let result = 2 + 2;
        assert_eq!(result, 4);
    }
// ANCHOR_END: exploration
}

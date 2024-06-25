pub fn add(left: usize, right: usize) -> usize {
    left + right
}

#[cfg(test)]
mod tests {
    use super::add;

    #[test]
    fn it_works() {
        let result = add(2, 2);
        assert!(result == 4, "result is not 4");
    }

    #[test]
    #[ignore]
    fn expensive_test() { // code that takes an hour to run
    }
}

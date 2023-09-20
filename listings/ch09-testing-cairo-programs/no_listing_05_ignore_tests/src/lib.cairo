#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        let result = 2 + 2;
        assert(result == 4, 'result is not 4');
    }

    #[test]
    #[ignore]
    fn expensive_test() { // code that takes an hour to run
    }
}

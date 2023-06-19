#[cfg(test)]
mod tests {
    // ANCHOR: it_works
    #[test]
    fn it_works() {
        let result = 2 + 2;
        assert(result == 4, 'result is not 4');
    }
    // ANCHOR_END: it_works

    // ANCHOR: exploration
    #[test]
    fn exploration() {
        let result = 2 + 2;
        assert(result == 4, 'result is not 4');
    }
    // ANCHOR_END: exploration

    // ANCHOR: another
    #[test]
    fn another() {
        let result = 2 + 2;
        assert(result == 6, 'Make this test fail');
    }
// ANCHOR_END: another
}

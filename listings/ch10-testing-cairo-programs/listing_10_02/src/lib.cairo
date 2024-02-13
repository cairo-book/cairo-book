//TAG: tests_fail
#[cfg(test)]
mod tests {
    // ANCHOR: exploration-and-another
    #[test]
    fn exploration() {
        let result = 2 + 2;
        assert!(result == 4, "result is not 4");
    }

    #[test]
    fn another() {
        let result = 2 + 2;
        assert!(result == 6, "Make this test fail");
    }
// ANCHOR_END: exploration-and-another
}

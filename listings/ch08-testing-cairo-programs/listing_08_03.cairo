//TAG: tests_fail
#[cfg(test)]
mod tests {
    // ANCHOR: another
    #[test]
    fn another() {
        let result = 2 + 2;
        assert(result == 6, 'Make this test fail');
    }
// ANCHOR_END: another
}

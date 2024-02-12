// TAG: ignore_fmt
// ANCHOR: it_works
#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        let result = 2 + 2;
        assert!(result == 4, "result is not 4");
    }
}
// ANCHOR_END: it_works

#[cfg(test)]
mod other_tests {
    // ANCHOR: exploration
    #[test]
    fn exploration() {
        let result = 2 + 2;
        assert!(result == 4, "result is not 4");
    }
// ANCHOR_END: exploration
}

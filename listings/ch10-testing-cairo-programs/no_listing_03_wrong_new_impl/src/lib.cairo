// TAG: tests_fail

#[derive(Drop)]
struct Guess {
    value: u64,
}

trait GuessTrait {
    fn new(value: u64) -> Guess;
}

// ANCHOR:here
impl GuessImpl of GuessTrait {
    fn new(value: u64) -> Guess {
        if value < 1 {
            panic!("Guess must be >= 1 and <= 100");
        }

        Guess { value }
    }
}
// ANCHOR_END: here

// ANCHOR: test
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    #[should_panic]
    fn greater_than_100() {
        GuessTrait::new(200);
    }
}
// ANCHOR_END: test



#[derive(Copy, Drop)]
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
            panic_with_felt252('Guess must be >= 1');
        } else if value > 100 {
            panic_with_felt252('Guess must be <= 100');
        }

        Guess { value, }
    }
}

#[cfg(test)]
mod tests {
    use super::Guess;
    use super::GuessTrait;

    //ANCHOR: test_panic
    #[test]
    #[should_panic(expected: ('Guess must be <= 100',))]
    fn greater_than_100() {
        GuessTrait::new(200);
    }
//ANCHOR_END: test_panic
}
// ANCHOR_END:here



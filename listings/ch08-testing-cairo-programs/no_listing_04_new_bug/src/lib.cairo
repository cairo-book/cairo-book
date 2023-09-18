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
            let mut data = ArrayTrait::new();
            data.append('Guess must be >= 1');
            panic(data);
        } else if value > 100 {
            let mut data = ArrayTrait::new();
            data.append('Guess must be <= 100');
            panic(data);
        }

        Guess { value, }
    }
}

#[cfg(test)]
mod tests {
    use super::Guess;
    use super::GuessTrait;

    #[test]
    #[should_panic(expected: ('Guess must be <= 100',))]
    fn greater_than_100() {
        GuessTrait::new(200);
    }
}
// ANCHOR_END:here



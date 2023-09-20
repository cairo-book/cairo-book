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
            data.append('Guess must be >= 1 and <= 100');
            panic(data);
        }

        Guess { value, }
    }
}
// ANCHOR_END: here



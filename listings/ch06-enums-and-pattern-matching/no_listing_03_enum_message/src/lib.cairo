// ANCHOR: all

// ANCHOR: message
#[derive(Drop)]
enum Message {
    Quit,
    Echo: felt252,
    Move: (u128, u128),
}
// ANCHOR_END: message

// ANCHOR: trait_impl
trait Processing {
    fn process(self: Message);
}

impl ProcessingImpl of Processing {
    fn process(self: Message) {
        match self {
            Message::Quit => { println!("quitting") },
            Message::Echo(value) => { println!("echoing {}", value) },
            Message::Move((x, y)) => { println!("moving from {} to {}", x, y) },
        }
    }
}
// ANCHOR_END: trait_impl
fn main() {
    // ANCHOR: main
    let msg: Message = Message::Quit;
    msg.process(); // prints "quitting"
    // ANCHOR_END: main
}
//ANCHOR_END: all



// ANCHOR: all
use debug::PrintTrait;
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
            Message::Quit => { 'quitting'.print(); },
            Message::Echo(value) => { value.print(); },
            Message::Move((x, y)) => { 'moving'.print(); },
        }
    }
}
// ANCHOR_END: trait_impl
fn main() {
    // ANCHOR: main
    let msg: Message = Message::Quit;
    msg.process();
// ANCHOR_END: main
}
//ANCHOR_END: all



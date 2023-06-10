use traits::TryInto;
use option::OptionTrait;
fn main() {
    let x: felt252 = 3;
    let y: u32 = x.try_into().unwrap();
}

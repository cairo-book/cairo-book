use debug::PrintTrait;
use traits::Into;
fn main() {
    let x = 2;
    x.print();
    let x: felt252 = x.into(); // converts x to a felt, type annotation is required.
    x.print()
}

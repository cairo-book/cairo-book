//TAG: does_not_compile
use core::debug::PrintTrait;

fn main() {
    let x = 5;
    x.print();
    x = 6;
    x.print();
}

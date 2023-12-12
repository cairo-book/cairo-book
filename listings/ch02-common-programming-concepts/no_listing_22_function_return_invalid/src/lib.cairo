//TAG: does_not_compile
use core::debug::PrintTrait;

fn main() {
    let x = plus_one(5);

    x.print();
}

fn plus_one(x: u32) -> u32 {
    x + 1;
}

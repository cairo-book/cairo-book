//TAG: does_not_compile
use core::debug::PrintTrait;

fn main() {
    let mut x: u64 = 2;
    x.print();
    x = 100_felt252;
    x.print()
}

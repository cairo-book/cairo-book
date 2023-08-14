//TAG: does_not_compile
use debug::PrintTrait;
use traits::Into;
fn main() {
    let mut x: u32 = 2;
    x.print();
    x = 100_felt252;
    x.print()
}

use debug::PrintTrait;

fn main() {
    let x: u64 = 2;
    x.print();
    let x: felt252 = x.into(); // converts x to a felt, type annotation is required.
    x.print()
}

use debug::PrintTrait;
use traits::Into;
fn main() {
    let mut x = 2;
    x.print();
    x = x.into();
    x.print()
}

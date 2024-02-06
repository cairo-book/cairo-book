//TAG: does_not_compile
// ANCHOR: crate
mod garden;

use garden::vegetables::Asparagus;

fn main() {
    let Asparagus = Asparagus {};
}
// ANCHOR_END: crate



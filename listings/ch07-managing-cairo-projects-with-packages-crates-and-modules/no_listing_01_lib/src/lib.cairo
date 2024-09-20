//TAG: does_not_compile
// ANCHOR: crate
pub mod garden;
use crate::garden::vegetables::Asparagus;

fn main() {
    let plant = Asparagus {};
    println!("I'm growing {:?}!", plant);
}
// ANCHOR_END: crate



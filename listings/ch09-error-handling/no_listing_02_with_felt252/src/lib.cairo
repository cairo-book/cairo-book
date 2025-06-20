// TAG: does_not_run

use core::panic_with_felt252;

#[executable]
fn main() {
    panic_with_felt252(2);
}

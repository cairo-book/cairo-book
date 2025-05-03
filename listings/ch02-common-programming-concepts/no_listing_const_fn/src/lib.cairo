use core::num::traits::Pow;

const BYTE_MASK: u16 = 2_u16.pow(8) - 1;

fn main() {
    let my_value = 12345;
    let first_byte = my_value & BYTE_MASK;
    println!("first_byte: {}", first_byte);
}

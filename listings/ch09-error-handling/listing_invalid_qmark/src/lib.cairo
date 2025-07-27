//ANCHOR: main
#[executable]
fn main() {
    let some_num = parse_u8(258)?;
}
//ANCHOR_END: main

fn parse_u8(input: felt252) -> Result<u8, felt252> {
    let input_u256: u256 = input.into();
    if input_u256 < 256 {
        Result::Ok(input.try_into().unwrap())
    } else {
        Result::Err('Invalid Integer')
    }
}

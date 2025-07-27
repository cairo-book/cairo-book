// A hypothetical function that might fail
fn parse_u8(input: felt252) -> Result<u8, felt252> {
    let input_u256: u256 = input.into();
    if input_u256 < 256 {
        Result::Ok(input.try_into().unwrap())
    } else {
        Result::Err('Invalid Integer')
    }
}

//ANCHOR: function
fn mutate_byte(input: felt252) -> Result<u8, felt252> {
    let input_to_u8: u8 = parse_u8(input)?;
    let res = input_to_u8 - 1;
    Ok(res)
}
//ANCHOR_END: function

#[cfg(test)]
mod tests {
    use super::*;
    //ANCHOR: tests
    #[test]
    fn test_function_2() {
        let number: felt252 = 258;
        match mutate_byte(number) {
            Ok(value) => println!("Result: {}", value),
            Err(e) => println!("Error: {}", e),
        }
    }
    //ANCHOR_END: tests
}

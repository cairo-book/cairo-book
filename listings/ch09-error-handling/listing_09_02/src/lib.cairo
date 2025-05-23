fn parse_u8(s: felt252) -> Result<u8, felt252> {
    match s.try_into() {
        Some(value) => Ok(value),
        None => Err('Invalid integer'),
    }
}

//ANCHOR: function
fn do_something_with_parse_u8(input: felt252) -> Result<u8, felt252> {
    let input_to_u8: u8 = parse_u8(input)?;
    // DO SOMETHING
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
        match do_something_with_parse_u8(number) {
            Ok(value) => println!("Result: {}", value),
            Err(e) => println!("Error: {}", e),
        }
    }
    //ANCHOR_END: tests
}

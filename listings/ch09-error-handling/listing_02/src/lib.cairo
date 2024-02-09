//TAG: does_not_compile
//ANCHOR: function
fn do_something_with_parse_u8(input: felt252) -> Result<u8, felt252> {
    let input_to_u8: u8 = parse_u8(input)?;
    // DO SOMETHING
    let res = input_to_u8 - 1;
    Result::Ok(res)
}
//ANCHOR_END: function

#[cfg(test)]
mod tests {
    use super::do_something_with_parse_u8;
    //ANCHOR: tests
    #[test]
    fn test_function_2() {
        let number: felt252 = 258_felt252;
        match do_something_with_parse_u8(number) {
            Result::Ok(value) => println!("Result: {}", value),
            Result::Err(e) => println!("Error: {}", e),
        }
    }
//ANCHOR_END: tests
}


fn parse_u8(s: felt252) -> Result<u8, felt252> {
    match s.try_into() {
        Option::Some(value) => Result::Ok(value),
        Option::None => Result::Err('Invalid integer'),
    }
}

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
    use debug::PrintTrait;
    //ANCHOR: tests
    #[test]
    fn test_function_2() {
        let number: felt252 = 258_felt252;
        match do_something_with_parse_u8(number) {
            Result::Ok(value) => value.print(),
            Result::Err(e) => e.print()
        }
    }
//ANCHOR_END: tests
}


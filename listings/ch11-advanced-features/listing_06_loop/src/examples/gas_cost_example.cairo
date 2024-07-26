fn main() {
    
    let mut pizza_ingredients: Array<felt252> = array!['cheese', 'tomato', 'mushroom', 'pepperoni', 'onion'];

    loop_array(pizza_ingredients.span(), 'onion');
    access_array(pizza_ingredients, 4);

}

fn loop_array(mut data: Span<felt252>, value: felt252) -> bool {

    loop {
        match data.pop_front() {

            Option::Some(data) => { 
                if *data == value {
                break true;
            }},

            Option::None => { break false; },
        };
    }
}

fn access_array(mut data: Array<felt252>, value: u32) -> felt252 {

    let ingredient = *data.at(value);
    ingredient
}

#[cfg(test)]
mod tests {

    use super::{ access_array, loop_array };

    #[test]
    #[available_gas(20000000)]
    // We are searching for `onion` in felt252 value in the array
    fn test_loop_array() {

        let mut pizza_ingredients: Array<felt252> = array!['cheese', 'tomato', 'mushroom', 'pepperoni', 'onion'];
    
        assert_eq!(loop_array(pizza_ingredients.span(), 478593773422), true);
    }

    #[test]
    #[available_gas(20000000)]
    fn test_access_array() {

        let mut pizza_ingredients: Array<felt252> = array!['cheese', 'tomato', 'mushroom', 'pepperoni', 'onion'];
    
        assert_eq!(access_array(pizza_ingredients, 4), 478593773422);
    }   

}
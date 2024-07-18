fn main() {

    let mut pizza_ingredients: Array<felt252> = array!['cheese', 'tomato', 'mushroom', 'pepperoni', 'onion'];

    let mushroom: felt252 = 7887337214842990445;

    let mut result = ArrayTrait::<felt252>::new();

    loop {
        match pizza_ingredients.pop_front() {
            Option::Some(ingredient) => {
                if ingredient == mushroom {
                    result.append(ingredient);
                }
            },
            Option::None => {
                break result; 
            }
        }
    };

    println!("mushroom is at index 0 = {}", result.at(0));

}
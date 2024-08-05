fn main() {
    let mut pizza_ingredients: Array<felt252> = array![
        'cheese', 'tomato', 'mushroom', 'pepperoni', 'onion'
    ];

    let mushroom: felt252 = 7887337214842990445;

    let mut ingredient = ArrayTrait::<felt252>::new();

    let result = append(pizza_ingredients, mushroom, ingredient);

    println!("mushroom is at index 0 = {}", result.at(0));
}

fn append(
    mut pizza_ingredients: Array<felt252>, target: felt252, mut array: Array<felt252>
) -> Array<felt252> {
    loop {
        match pizza_ingredients.pop_front() {
            Option::Some(ingredient) => { if ingredient == target {
                array.append(ingredient);
            } },
            Option::None => {
                println!("Ingredient not found");
                break;
            }
        }
    };

    array
}

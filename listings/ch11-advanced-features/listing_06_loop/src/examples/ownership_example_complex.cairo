fn main() {

    let mut pizza_ingredients: Array<felt252> = array!['cheese', 'tomato', 'mushroom', 'pepperoni', 'onion'];

    let mushroom: felt252 = 7887337214842990445;

<<<<<<< HEAD
    let mut ingredient = ArrayTrait::<felt252>::new();

    append(pizza_ingredients, mushroom, ingredient);

    println!("mushroom is at index 0 = {}", ingredient.at(0));
}

fn append(mut pizza_ingredients: Array<felt252>, target: felt252, mut array: Array<felt252>) {
=======
    let mut result = ArrayTrait::<felt252>::new();
>>>>>>> e6f7ce53baa4b4ea8a31873991384ae09c52dc47

    loop {
        match pizza_ingredients.pop_front() {
            Option::Some(ingredient) => {
<<<<<<< HEAD
                if ingredient == target {
                    array.append(ingredient);
                }
            },
            Option::None => {
                println!("Ingredient not found");
                break; 
            }
        }
    };
=======
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

>>>>>>> e6f7ce53baa4b4ea8a31873991384ae09c52dc47
}
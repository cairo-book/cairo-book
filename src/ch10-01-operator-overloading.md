# Operator Overloading

In Cairo, you can customize the behavior of operators. You can overload an operator and its corresponding traits. This means that these operators can then be used to perform different types of tasks, depending on the arguments passed to them. It can provide you more readable and intuitive syntax when interacting with custom structs. However, operator overloading has to be used judiciously, otherwise it could lead to confusion and make the code harder to maintain.

Let's consider an example where we want to combine two `Potions`. `Potions` have two fields, mana and health. Combining two `Potions` should add their respective fields.

```Rust
struct Potion {
    health: felt252,
    mana: felt252
}

impl PotionAdd of Add<Potion> {
    #[inline(always)]
    fn add(lhs: Potion, rhs: Potion) -> Potion {
        Potion {
            health: lhs.health + rhs.health,
            mana: lhs.mana + rhs.mana,
        }
    }
}

fn main() {
    let health_potion: Potion = Potion { health: 100, mana: 0};
    let mana_potion: Potion = Potion { health: 0, mana: 100};
    let super_potion: Potion = health_potion + mana_potion;
    assert(super_potion.health == 100, '');
    assert(super_potion.mana == 100, '');
}
```

We are overloading the `add` method for the `Potion` struct to make it add both `health` and `mana` of two instances in order to create a new instance.

To overload an operator we have to specify which generic type we are overloading as you can see in the example with `Add<Potion>`.
// ANCHOR: AssociatedConsts
#[derive(Drop)]
struct Warrior {
    name: felt252,
    hp: u32
}

#[derive(Drop)]
struct Wizard {
    name: felt252,
    hp: u32
}

trait Character<T, U> {
    const strength: u32;
    fn fight(self: @T, ref enemy: U);
}

impl WizardCharacter of Character<Wizard, Warrior> {
    const strength: u32 = 50;
    fn fight(self: @Wizard, ref enemy: Warrior) {
        enemy.hp -= Self::strength;
    }
}

impl WarriorCharacter of Character<Warrior, Wizard> {
    const strength: u32 = 100;
    fn fight(self: @Warrior, ref enemy: Wizard) {
        enemy.hp -= Self::strength;
    }
}
// ANCHOR_END: AssociatedConsts

// ANCHOR: Battle
fn main() {
    let mut warrior = Warrior { name: 'Ares', hp: 1000, };
    let mut wizard = Wizard { name: 'Merlin', hp: 1000, };

    while (warrior.hp != 0 && wizard.hp != 0) {
        warrior.fight(ref wizard);
        wizard.fight(ref warrior);
    };

    println!("Ares hp is {}", warrior.hp);
    println!("Merlin hp is {}", wizard.hp);
}
// ANCHOR: End



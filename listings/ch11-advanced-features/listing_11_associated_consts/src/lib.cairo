#[derive(Drop)]
struct Warrior { ... }
#[derive(Drop)]
struct Wizard { ... }

trait Character<T> {
    const hp: u32;
    fn fight(self: T);
}

impl WizardCharacter of Character<Wizard> {
    const hp: u32 = 70;
    fn fight(self: Wizard) { ... } 
}

impl WarriorCharacter of Character<Warrior> {
    const hp: u32 = 100;
    fn fight(self: Warrior) { ... } 
}

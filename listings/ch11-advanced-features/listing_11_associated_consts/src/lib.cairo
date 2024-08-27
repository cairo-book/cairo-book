#[derive(Drop)]
struct Warrior {
    name: ByteArray,
    hp: u128
}

#[derive(Drop)]
struct Wizard {
    name: ByteArray,
    hp: u128
}

trait Character<T> {
    const strength: u32;
    fn fight(self: T);
}

impl WizardCharacter of Character<Wizard> {
    const strength: u32 = 70;
    fn fight(self: Wizard) {}
}

impl WarriorCharacter of Character<Warrior> {
    const strength: u32 = 100;
    fn fight(self: Warrior) {}
}

fn main() {
    let warrior = Warrior { name: "Warrior", hp: 1000, };
    let wizard = Wizard { name: "Wizard", hp: 1000, };

    warrior.fight()
}

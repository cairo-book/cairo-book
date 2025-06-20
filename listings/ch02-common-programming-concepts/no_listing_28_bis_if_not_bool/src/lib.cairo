//TAG: does_not_compile

#[executable]
fn main() {
    let number = 3;

    if number {
        println!("number was three");
    }
}

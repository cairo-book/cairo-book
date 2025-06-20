fn five() -> u32 {
    5
}

#[executable]
fn main() {
    let x = five();
    println!("The value of x is: {}", x);
}

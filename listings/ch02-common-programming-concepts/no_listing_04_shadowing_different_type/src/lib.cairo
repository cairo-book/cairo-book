fn main() {
    let x: u64 = 2;
    println!("x = {} of type u64", x);
    let x: felt252 = x.into(); // converts x to a felt, type annotation is required.
    println!("x = {} of type felt252", x);
}

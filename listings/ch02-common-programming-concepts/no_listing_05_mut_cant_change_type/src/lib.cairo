//TAG: does_not_compile

fn main() {
    let mut x: u64 = 2;
    println!("x = {}", x);
    x = 100_felt252;
    println!("x = {}", x);
}

//TAG: does_not_compile

fn main() {
    let mut x: u64 = 2;
    println!("The value of x is: {}", x);
    x = 'a short string';
    println!("The value of x is: {}", x);
}

// TAGS: does_not_compile, ignore_fmt
// ANCHOR: main
fn main() {
    let mut x: u64 = 2;
    println!("The value of x is: {}", x);
    x = 'a short string';
    println!("The value of x is: {}", x);
}
// ANCHOR_END: main


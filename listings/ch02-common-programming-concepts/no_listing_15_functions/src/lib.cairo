fn another_function() {
    println!("Another function.");
}

#[executable]
fn main() {
    println!("Hello, world!");
    another_function();
}

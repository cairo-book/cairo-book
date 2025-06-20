// TAG: does_not_run

#[executable]
fn main() {
    if true {
        panic!("2");
    }
    println!("This line isn't reached");
}

fn main() {
    let data = array![2];
    if true {
        panic(data);
    }
    println!("This line isn't reached");
}

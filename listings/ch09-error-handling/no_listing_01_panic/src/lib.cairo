fn main() {
    let mut data = ArrayTrait::new();
    data.append(2);
    if true {
        panic(data);
    }
    println!("This line isn't reached");
}

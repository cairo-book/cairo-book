fn main() {
    let b = BoxTrait::new(5_u128);
    println!("b = {}", b.unbox())
}

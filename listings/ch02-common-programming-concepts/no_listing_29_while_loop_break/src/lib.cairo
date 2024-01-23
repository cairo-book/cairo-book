fn main() {
    let mut i: usize = 0;
    while i <= 10 {
        if i == 5 {
            break;
        }
        println!("i = {i}");
        i += 1;
    }
}

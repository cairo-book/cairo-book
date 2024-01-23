fn main() {
    let mut i: usize = 0;
    while i <= 10 {
        if i == 5 {
            i += 1;
            continue;
        }
        println!("i = {i}");
        i += 1;
    }
}

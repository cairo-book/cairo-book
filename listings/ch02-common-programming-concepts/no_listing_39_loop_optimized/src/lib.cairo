fn main() {
    let mut i: usize = 11;
    loop {
        if i == 0 {
            break;
        }
        if i == 5 {
            i -= 1;
            continue;
        }
        println!("i = {}", 11 - i);
        i -= 1;
    }
}

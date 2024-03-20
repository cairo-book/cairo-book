fn main() {
    let mut arr = array![1, 2, 3, 4, 5, 6, 7, 8, 9];
    let mut sum = 0;
    while let Option::Some(value) = arr.pop_front() {
        sum += value;
    };
    println!("{}", sum);
}

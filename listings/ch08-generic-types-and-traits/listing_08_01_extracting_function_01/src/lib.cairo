fn main() {
    let mut number_list: Array<u8> = array![34, 50, 25, 100, 65];

    let mut largest = number_list.pop_front().unwrap();

    while let Option::Some(number) = number_list.pop_front() {
        if number > largest {
            largest = number;
        }
    };

    println!("The largest number is {}", largest);
}

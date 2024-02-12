fn main() {
    let mut number_list: Array<u8> = array![34, 50, 25, 100, 65];

    let mut largest = number_list.pop_front().unwrap();

    loop {
        match number_list.pop_front() {
            Option::Some(number) => { if number > largest {
                largest = number;
            } },
            Option::None => { break; },
        }
    };

    println!("The largest number is {}", largest);
}

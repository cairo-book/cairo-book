fn largest(ref number_list: Array<u8>) -> u8 {
    let mut largest = number_list.pop_front().unwrap();

    loop {
        match number_list.pop_front() {
            Option::Some(number) => { if number > largest {
                largest = number;
            } },
            Option::None => { break; },
        }
    };

    largest
}

fn main() {
    let mut number_list = array![34, 50, 25, 100, 65];

    let result = largest(ref number_list);
    println!("The largest number is {}", result);

    let mut number_list = array![102, 34, 255, 89, 54, 2, 43, 8];

    let result = largest(ref number_list);
    println!("The largest number is {}", result);
}

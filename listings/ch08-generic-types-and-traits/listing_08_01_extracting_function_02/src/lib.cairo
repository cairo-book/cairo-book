#[executable]
fn main() {
    let mut number_list: Array<u8> = array![34, 50, 25, 100, 65];

    let mut largest = number_list.pop_front().unwrap();

    for number in number_list {
        if number > largest {
            largest = number;
        }
    }

    println!("The largest number is {}", largest);

    let mut number_list: Array<u8> = array![102, 34, 255, 89, 54, 2, 43, 8];

    let mut largest = number_list.pop_front().unwrap();

    for number in number_list {
        if number > largest {
            largest = number;
        }
    }

    println!("The largest number is {}", largest);
}

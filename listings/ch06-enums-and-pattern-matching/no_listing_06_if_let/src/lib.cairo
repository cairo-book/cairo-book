fn main() {
    match_example();
}

#[derive(Drop)]
enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter,
}

fn match_example() {
    // ANCHOR: match
    let config_max = Option::Some(5);
    match config_max {
        Option::Some(max) => println!("The maximum is configured to be {}", max),
        _ => (),
    }
    // ANCHOR_END: match
}


fn if_let_example() {
    // ANCHOR: if_let_example
    let number = Option::Some(5);
    if let Option::Some(max) = number {
        println!("The maximum is configured to be {}", max);
    }
    // ANCHOR_END: if_let_example
}

fn coiner_match() {
    // ANCHOR: coiner_match
    let coin = Coin::Quarter;
    let mut count = 0;
    match coin {
        Coin::Quarter => println!("You got a quarter!"),
        _ => count += 1,
    }
    // ANCHOR_END: coiner_match
}

fn coiner() {
    // ANCHOR: coiner
    let coin = Coin::Quarter;
    let mut count = 0;
    if let Coin::Quarter = coin {
        println!("You got a quarter!");
    } else {
        count += 1;
    }
    // ANCHOR_END: coiner
    println!("{}", count);
}
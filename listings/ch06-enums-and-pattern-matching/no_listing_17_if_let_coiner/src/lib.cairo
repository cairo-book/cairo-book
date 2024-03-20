#[derive(Drop)]
enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter,
}

fn main() {
    // ANCHOR: here
    let coin = Coin::Quarter;
    let mut count = 0;
    if let Coin::Quarter = coin {
        println!("You got a quarter!");
    } else {
        count += 1;
    }
    // ANCHOR_END: here
    println!("{}", count);
}


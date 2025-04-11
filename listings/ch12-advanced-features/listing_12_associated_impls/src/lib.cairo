// ANCHOR: main
fn main() {
    let mut arr: Array<felt252> = array![1, 2, 3];

    // Converts the array into an iterator
    let mut iter = arr.into_iter();

    // Uses the iterator to print each element
    loop {
        match iter.next() {
            Some(item) => println!("Item: {}", item),
            None => { break; },
        };
    }
}
// ANCHOR_END: main



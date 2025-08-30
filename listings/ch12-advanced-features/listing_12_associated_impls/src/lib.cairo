// ANCHOR: main
#[executable]
fn main() {
    let mut arr: Array<felt252> = array![1, 2, 3];

    // Converts the array into an iterator
    let mut iter = arr.into_iter();

    // Uses the iterator to print each element
    while let Some(item) = iter.next() {
        println!("Item: {}", item);
    }
}
// ANCHOR_END: main



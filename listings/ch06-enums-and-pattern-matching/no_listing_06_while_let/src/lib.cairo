fn main() {
    let arr = array![1, 2, 3, 4, 5, 6, 7, 8, 9];
    let res = array_sum(arr);
    println!("{}", res);
}

fn array_sum(mut arr: Array<felt252>) -> felt252 {
    // ANCHOR: here
    let mut sum = 0;
    while let Option::Some(x) = arr.pop_front() {
        sum += x;
    };
    sum
    // ANCHOR_END: here
}

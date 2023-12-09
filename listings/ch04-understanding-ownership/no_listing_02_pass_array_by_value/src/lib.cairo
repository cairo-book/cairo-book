//TAG: does_not_run

fn foo(mut arr: Array<u128>) {
    arr.pop_front();
}

fn main() {
    let mut arr = ArrayTrait::<u128>::new();
    foo(arr);
    foo(arr);
}

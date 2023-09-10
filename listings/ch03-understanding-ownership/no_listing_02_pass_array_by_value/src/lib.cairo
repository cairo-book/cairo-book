//TAG: does_not_run

fn foo(arr: Array<u128>) {}

fn bar(arr: Array<u128>) {}

fn main() {
    let mut arr = ArrayTrait::<u128>::new();
    foo(arr);
    bar(arr);
}

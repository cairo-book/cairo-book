//TAG: does_not_run
fn foo(mut arr: Array<u128>) {
    arr.pop_front();
}

#[executable]
fn main() {
    let arr: Array<u128> = array![];
    foo(arr);
    foo(arr);
}

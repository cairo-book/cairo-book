use debug::PrintTrait;

fn main() {
    let mut arr1 = ArrayTrait::<u128>::new();
    let first_snapshot = @arr1; // Take a snapshot of `arr1` at this point in time
    arr1.append(1); // Mutate `arr1` by appending a value
    let first_length = calculate_length(
        first_snapshot
    ); // Calculate the length of the array when the snapshot was taken
    //ANCHOR: function_call
    let second_length = calculate_length(@arr1); // Calculate the current length of the array
    //ANCHOR_END: function_call
    first_length.print();
    second_length.print();
}

fn calculate_length(arr: @Array<u128>) -> usize {
    arr.len()
}

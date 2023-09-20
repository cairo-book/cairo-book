//TAG: does_not_compile

// Specify generic type T between the angulars
fn largest_list<T>(l1: Array<T>, l2: Array<T>) -> Array<T> {
    if l1.len() > l2.len() {
        l1
    } else {
        l2
    }
}

fn main() {
    let mut l1 = ArrayTrait::new();
    let mut l2 = ArrayTrait::new();

    l1.append(1);
    l1.append(2);

    l2.append(3);
    l2.append(4);
    l2.append(5);

    // There is no need to specify the concrete type of T because
    // it is inferred by the compiler
    let l3 = largest_list(l1, l2);
}

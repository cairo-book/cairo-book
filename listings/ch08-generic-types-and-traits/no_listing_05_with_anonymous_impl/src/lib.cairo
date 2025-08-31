fn smallest_element<T, +PartialOrd<T>, +Copy<T>, +Drop<T>>(list: @Array<T>) -> T {
    let mut smallest = *list[0];
    for element in list {
        if *element < smallest {
            smallest = *element;
        }
    }
    smallest
}

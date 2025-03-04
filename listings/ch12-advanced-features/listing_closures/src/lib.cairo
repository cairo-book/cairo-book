//ANCHOR: array_map
#[generate_trait]
impl ArrayExt of ArrayExtTrait {
    // Needed in Cairo 2.10.1 because of a bug in inlining analysis.
    #[inline(never)]
    fn map<T, +Drop<T>, F, +Drop<F>, impl func: core::ops::Fn<F, (T,)>, +Drop<func::Output>>(
        self: Array<T>, f: F,
    ) -> Array<func::Output> {
        let mut output: Array<func::Output> = array![];
        for elem in self {
            output.append(f(elem));
        };
        output
    }
}
//ANCHOR_END: array_map

//ANCHOR: array_filter
#[generate_trait]
impl ArrayFilterExt of ArrayFilterExtTrait {
    // Needed in Cairo 2.10.1 because of a bug in inlining analysis.
    #[inline(never)]
    fn filter<
        T,
        +Copy<T>,
        +Drop<T>,
        F,
        +Drop<F>,
        impl func: core::ops::Fn<F, (T,)>[Output: bool],
        +Drop<func::Output>,
    >(
        self: Array<T>, f: F,
    ) -> Array<T> {
        let mut output: Array<T> = array![];
        for elem in self {
            if f(elem) {
                output.append(elem);
            }
        };
        output
    }
}
//ANCHOR_END: array_filter

fn main() {
    //ANCHOR: basic
    let double = |value| value * 2;
    println!("Double of 2 is {}", double(2_u8));
    println!("Double of 4 is {}", double(4_u8));

    // This won't work because `value` type has been inferred as `u8`.
    //println!("Double of 6 is {}", double(6_u16));

    let sum = |x: u32, y: u32, z: u16| {
        x + y + z.into()
    };
    println!("Result: {}", sum(1, 2, 3));
    //ANCHOR_END: basic

    //ANCHOR: environment
    let x = 8;
    let my_closure = |value| {
        x * (value + 3)
    };

    println!("my_closure(1) = {}", my_closure(1));
    //ANCHOR_END: environment

    //ANCHOR: map_usage
    let double = array![1, 2, 3].map(|item: u32| item * 2);
    let another = array![1, 2, 3].map(|item: u32| {
        let x: u64 = item.into();
        x * x
    });

    println!("double: {:?}", double);
    println!("another: {:?}", another);
    //ANCHOR_END: map_usage

    //ANCHOR: filter_usage
    let even = array![3, 4, 5, 6].filter(|item: u32| item % 2 == 0);
    println!("even: {:?}", even);
    //ANCHOR_END: filter_usage
}

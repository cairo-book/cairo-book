mod integer {
    // ANCHOR: integer_const
    const ONE_HOUR_IN_SECONDS: u32 = 3600;
// ANCHOR_END: integer_const
}

mod consteval {
    // ANCHOR: consteval_const
    const ONE_HOUR_IN_SECONDS: u32 = consteval_int!(60 * 60);
// ANCHOR_END: consteval_const
}

// ANCHOR: complex_const
struct AnyStruct {
    a: u256,
    b: u32
}

enum AnyEnum {
    A: felt252,
    B: (usize, u256)
}

const STRUCT_INSTANCE: AnyStruct = AnyStruct { a: 0, b: 1 };

const ENUM_INSTANCE: AnyEnum = AnyEnum::A('any enum');
// ANCHOR_END: complex_const

// ANCHOR: fixed_size_array_const
const BOOL_FIXED_SIZE_ARRAY: [bool; 2] = [true, false];
// ANCHOR_END: fixed_size_array_const



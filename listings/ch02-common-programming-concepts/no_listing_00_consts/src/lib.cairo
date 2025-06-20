// ANCHOR: const_expressions
struct AnyStruct {
    a: u256,
    b: u32,
}

enum AnyEnum {
    A: felt252,
    B: (usize, u256),
}

const ONE_HOUR_IN_SECONDS: u32 = 3600;
const ONE_HOUR_IN_SECONDS_2: u32 = 60 * 60;
const STRUCT_INSTANCE: AnyStruct = AnyStruct { a: 0, b: 1 };
const ENUM_INSTANCE: AnyEnum = AnyEnum::A('any enum');
const BOOL_FIXED_SIZE_ARRAY: [bool; 2] = [true, false];
// ANCHOR_END: const_expressions



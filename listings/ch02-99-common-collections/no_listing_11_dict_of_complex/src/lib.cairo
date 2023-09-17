// ANCHOR: all

// ANCHOR: imports
use dict::Felt252DictTrait;
use nullable::{nullable_from_box, match_nullable, FromNullableResult};
// ANCHOR_END: imports

// ANCHOR: header
fn main() {
    // Create the dictionary
    let mut d: Felt252Dict<Nullable<Span<felt252>>> = Default::default();

    // Crate the array to insert
    let mut a = ArrayTrait::new();
    a.append(8);
    a.append(9);
    a.append(10);

    // Insert it as a `Span`
    d.insert(0, nullable_from_box(BoxTrait::new(a.span())));
    // ANCHOR_END: header

    // ANCHOR: footer
    // Get value back
    let val = d.get(0);

    // Search the value and assert it is not null
    let span = match match_nullable(val) {
        FromNullableResult::Null(()) => panic_with_felt252('No value found'),
        FromNullableResult::NotNull(val) => val.unbox(),
    };

    // Verify we are having the right values
    assert(*span.at(0) == 8, 'Expecting 8');
    assert(*span.at(1) == 9, 'Expecting 9');
    assert(*span.at(2) == 10, 'Expecting 10');
}
// ANCHOR_END: footer

// ANCHOR_END: all



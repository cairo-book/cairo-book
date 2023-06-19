mod adder {
    mod main {
        fn internal_adder(a: felt252, b: felt252) -> felt252 {
            a + b
        }
    }
}
use adder::main;

//ANCHOR: here
#[test]
fn internal() {
    assert(main::internal_adder(2, 2) == 4, 'internal_adder failed');
}
// ANCHOR_END: here


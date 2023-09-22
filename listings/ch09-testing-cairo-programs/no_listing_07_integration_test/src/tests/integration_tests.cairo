use adder::it_adds_two;

#[test]
#[available_gas(2000000)]
fn internal() {
    assert(it_adds_two(2, 2) == 4, 'internal_adder failed');
}

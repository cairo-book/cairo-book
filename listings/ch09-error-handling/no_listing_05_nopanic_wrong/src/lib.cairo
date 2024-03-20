//TAG: does_not_compile
// ANCHOR: wrong-nopanic
fn function_never_panic() nopanic {
    assert(1 == 1, 'what');
}
// ANCHOR_END: wrong-nopanic



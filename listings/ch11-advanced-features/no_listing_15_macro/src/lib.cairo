// Required for build to work w/ github actions
use no_listing_15_macro::pow;
fn foo() {
    assert(pow!(2, 3) == 8);
}

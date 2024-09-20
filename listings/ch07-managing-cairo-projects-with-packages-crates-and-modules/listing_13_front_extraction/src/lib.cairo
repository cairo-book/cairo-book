//TAG: does_not_compile
// ANCHOR: front-extraction
mod front_of_house;

use crate::front_of_house::hosting;

fn eat_at_restaurant() {
    hosting::add_to_waitlist();
}
// ANCHOR_END: front-extraction



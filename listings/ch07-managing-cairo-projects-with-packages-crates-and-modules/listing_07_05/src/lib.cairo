//TAG: does_not_compile

// ANCHOR: wrong-path
mod front_of_house {
    pub(crate) mod hosting {
        pub(crate) fn add_to_waitlist() {}
    }
}

use restaurant::front_of_house::hosting;

mod customer {
    pub(crate) fn eat_at_restaurant() {
        hosting::add_to_waitlist();
    }
}
// ANCHOR_END: wrong-path



//TAG: does_not_compile
mod front_of_house {
    mod hosting {
        fn add_to_waitlist() {}
    }
}

use restaurant::front_of_house::hosting;

mod customer {
    fn eat_at_restaurant() {
        hosting::add_to_waitlist();
    }
}

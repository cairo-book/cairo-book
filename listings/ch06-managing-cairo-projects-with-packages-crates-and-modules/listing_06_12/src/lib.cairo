//TAG: does_not_compile
mod front_of_house;

use restaurant::front_of_house::hosting;

fn eat_at_restaurant() {
    hosting::add_to_waitlist();
}

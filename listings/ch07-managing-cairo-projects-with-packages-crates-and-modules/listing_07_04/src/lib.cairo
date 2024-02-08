//TAG: does_not_compile
// ANCHOR: use
// Assuming "front_of_house" module is contained in a crate called "restaurant", as mentioned in the section "Defining Modules to Control Scope"
// If the path is created in the same crate, "restaurant" is optional in the use statement

mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {}
    }
}

use restaurant::front_of_house::hosting;

pub fn eat_at_restaurant() {
    hosting::add_to_waitlist(); // ✅ Shorter path
}
// ANCHOR_END: use



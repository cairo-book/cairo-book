//TAG: does_not_compile
// ANCHOR: reexporting
mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {}
    }
}

pub use crate::front_of_house::hosting;

fn eat_at_restaurant() {
    hosting::add_to_waitlist();
}
// ANCHOR_END: reexporting



// ANCHOR: front_of_house
mod front_of_house {
    mod hosting {
        fn add_to_waitlist() {}

        fn seat_at_table() {}
    }

    mod serving {
        fn take_order() {}

        fn serve_order() {}

        fn take_payment() {}
    }
}
// ANCHOR_END: front_of_house

// ANCHOR: back_of_house
mod back_of_house {
    mod cooking {
        fn cook_dish() {}

        fn arrange_on_plate() {}
    }

    mod organizing {
        fn pay_bill() {}

        fn recruit() {}

        fn clean_up() {}
    }
}
// ANCHOR_END: back_of_house



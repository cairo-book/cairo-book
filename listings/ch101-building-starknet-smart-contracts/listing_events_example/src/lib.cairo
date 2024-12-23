#[starknet::interface]
pub trait IEventExample<TContractState> {
    fn add_book(ref self: TContractState, id: u32, title: felt252, author: felt252);
    fn change_book_title(ref self: TContractState, id: u32, new_title: felt252);
    fn change_book_author(ref self: TContractState, id: u32, new_author: felt252);
    fn remove_book(ref self: TContractState, id: u32);
}

//ANCHOR: all
#[starknet::contract]
mod EventExample {
    #[storage]
    struct Storage {}

    //ANCHOR: event
    //ANCHOR: full_events
    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {
        BookAdded: BookAdded,
        #[flat]
        FieldUpdated: FieldUpdated,
        BookRemoved: BookRemoved,
    }
    //ANCHOR_END: event

    #[derive(Drop, starknet::Event)]
    pub struct BookAdded {
        pub id: u32,
        pub title: felt252,
        #[key]
        pub author: felt252,
    }

    #[derive(Drop, starknet::Event)]
    pub enum FieldUpdated {
        Title: UpdatedTitleData,
        Author: UpdatedAuthorData,
    }

    #[derive(Drop, starknet::Event)]
    pub struct UpdatedTitleData {
        #[key]
        pub id: u32,
        pub new_title: felt252,
    }

    #[derive(Drop, starknet::Event)]
    pub struct UpdatedAuthorData {
        #[key]
        pub id: u32,
        pub new_author: felt252,
    }

    #[derive(Drop, starknet::Event)]
    pub struct BookRemoved {
        pub id: u32,
    }
    //ANCHOR_END: full_events

    #[abi(embed_v0)]
    impl EventExampleImpl of super::IEventExample<ContractState> {
        //ANCHOR: emit_event
        fn add_book(ref self: ContractState, id: u32, title: felt252, author: felt252) {
            // ... logic to add a book in the contract storage ...
            self.emit(BookAdded { id, title, author });
        }

        fn change_book_title(ref self: ContractState, id: u32, new_title: felt252) {
            self.emit(FieldUpdated::Title(UpdatedTitleData { id, new_title }));
        }

        fn change_book_author(ref self: ContractState, id: u32, new_author: felt252) {
            self.emit(FieldUpdated::Author(UpdatedAuthorData { id, new_author }));
        }

        fn remove_book(ref self: ContractState, id: u32) {
            self.emit(BookRemoved { id });
        }
        //ANCHOR_END: emit_event

    }
}
//ANCHOR_END: all



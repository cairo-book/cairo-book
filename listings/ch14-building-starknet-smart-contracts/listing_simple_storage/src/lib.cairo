#[starknet::interface]
pub trait ISimpleStorage<TContractState> {
    fn get_owner(self: @TContractState) -> SimpleStorage::Person;
    fn get_owner_name(self: @TContractState) -> felt252;
    fn get_expiration(self: @TContractState) -> SimpleStorage::Expiration;
    fn change_expiration(ref self: TContractState, expiration: SimpleStorage::Expiration);
}

//ANCHOR: all
#[starknet::contract]
mod SimpleStorage {
    use core::starknet::{ContractAddress, get_caller_address};
    use core::starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess};

    //ANCHOR: storage
    #[storage]
    struct Storage {
        owner: Person,
        expiration: Expiration,
    }
    //ANCHOR_END: storage

    //ANCHOR: person
    #[derive(Drop, Serde, starknet::Store)]
    pub struct Person {
        address: ContractAddress,
        name: felt252,
    }
    //ANCHOR_END: person

    //ANCHOR: enum
    #[derive(Copy, Drop, Serde, starknet::Store)]
    pub enum Expiration {
        Finite: u64,
        #[default]
        Infinite,
    }
    //ANCHOR_END: enum

    //ANCHOR: write_owner
    #[constructor]
    fn constructor(ref self: ContractState, owner: Person) {
        self.owner.write(owner);
    }
    //ANCHOR_END: write_owner

    //ANCHOR: impl_public
    #[abi(embed_v0)]
    impl SimpleCounterImpl of super::ISimpleStorage<ContractState> {
        //ANCHOR: read_owner
        fn get_owner(self: @ContractState) -> Person {
            self.owner.read()
        }
        //ANCHOR_END: read_owner

        //ANCHOR: read_owner_name
        fn get_owner_name(self: @ContractState) -> felt252 {
            self.owner.name.read()
        }
        //ANCHOR_END: read_owner_name

        //ANCHOR: enum_read
        fn get_expiration(self: @ContractState) -> Expiration {
            self.expiration.read()
        }
        //ANCHOR_END: enum_read

        //ANCHOR: enum_store
        fn change_expiration(ref self: ContractState, expiration: Expiration) {
            if get_caller_address() != self.owner.address.read() {
                panic!("Only the owner can change the expiration");
            }
            self.expiration.write(expiration);
        }
        //ANCHOR_END: enum_store
    }

    //ANCHOR: owner_address
    fn get_owner_storage_address(self: @ContractState) -> felt252 {
        self.owner.__base_address__
    }

    fn get_owner_name_storage_address(self: @ContractState) -> felt252 {
        self.owner.name.__storage_pointer_address__.into()
    }
    //ANCHOR_END: owner_address

}
//ANCHOR_END: all



//ANCHOR: all
use core::starknet::ContractAddress;

#[starknet::interface]
pub trait INameRegistry<TContractState> {
    fn store_name(ref self: TContractState, name: felt252);
    fn get_name(self: @TContractState, address: ContractAddress) -> felt252;
    fn get_owner(self: @TContractState) -> NameRegistry::Person;
    fn get_owner_name(self: @TContractState) -> felt252;
}

#[starknet::contract]
mod NameRegistry {
    use core::starknet::{ContractAddress, get_caller_address};
    use core::starknet::storage::{
        Map, StoragePathEntry, StoragePointerReadAccess, StoragePointerWriteAccess,
    };

    //ANCHOR: storage
    #[storage]
    struct Storage {
        names: Map::<ContractAddress, felt252>,
        owner: Person,
        total_names: u128,
    }
    //ANCHOR_END: storage

    //ANCHOR: person
    #[derive(Drop, Serde, starknet::Store)]
    pub struct Person {
        address: ContractAddress,
        name: felt252,
    }
    //ANCHOR_END: person

    //ANCHOR: constructor
    #[constructor]
    fn constructor(ref self: ContractState, owner: Person) {
        self.names.entry(owner.address).write(owner.name);
        self.total_names.write(1);
        //ANCHOR: write_owner
        self.owner.write(owner);
        //ANCHOR_END: write_owner
    }
    //ANCHOR_END: constructor

    //ANCHOR: impl_public
    // Public functions inside an impl block
    #[abi(embed_v0)]
    impl NameRegistry of super::INameRegistry<ContractState> {
        //ANCHOR: external
        fn store_name(ref self: ContractState, name: felt252) {
            let caller = get_caller_address();
            self._store_name(caller, name);
        }
        //ANCHOR_END: external

        //ANCHOR: view
        fn get_name(self: @ContractState, address: ContractAddress) -> felt252 {
            //ANCHOR: read
            self.names.entry(address).read()
            //ANCHOR_END: read
        }

        //ANCHOR_END: view
        fn get_owner(self: @ContractState) -> Person {
            //ANCHOR: read_owner
            self.owner.read()
            //ANCHOR_END: read_owner
        }

        fn get_owner_name(self: @ContractState) -> felt252 {
            //ANCHOR: read_owner_name
            self.owner.name.read()
            //ANCHOR_END: read_owner_name
        }
    }
    //ANCHOR_END: impl_public

    //ANCHOR: standalone
    // Standalone public function
    #[external(v0)]
    fn get_contract_name(self: @ContractState) -> felt252 {
        'Name Registry'
    }
    //ANCHOR_END: standalone

    // ANCHOR: state_internal
    // ANCHOR: generate_trait
    // Could be a group of functions about a same topic
    #[generate_trait]
    impl InternalFunctions of InternalFunctionsTrait {
        fn _store_name(ref self: ContractState, user: ContractAddress, name: felt252,) {
            let total_names = self.total_names.read();

            //ANCHOR: write
            self.names.entry(user).write(name);
            //ANCHOR_END: write

            self.total_names.write(total_names + 1);
        }
    }
    // ANCHOR_END: generate_trait

    // Free function
    fn get_owner_storage_address(self: @ContractState) -> felt252 {
        //ANCHOR: owner_address
        self.owner.__base_address__
        //ANCHOR_END: owner_address
    }
    // ANCHOR_END: state_internal
}
//ANCHOR_END: all



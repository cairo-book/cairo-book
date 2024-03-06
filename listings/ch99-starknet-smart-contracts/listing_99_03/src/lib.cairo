//ANCHOR: all
use starknet::ContractAddress;

#[starknet::interface]
pub trait INameRegistry<TContractState> {
    fn store_name(
        ref self: TContractState, name: felt252, registration_type: NameRegistry::RegistrationType
    );
    fn get_name(self: @TContractState, address: ContractAddress) -> felt252;
    fn get_owner(self: @TContractState) -> NameRegistry::Person;
}

#[starknet::contract]
mod NameRegistry {
    use starknet::{ContractAddress, get_caller_address, storage_access::StorageBaseAddress};

    //ANCHOR: storage
    #[storage]
    struct Storage {
        names: LegacyMap::<ContractAddress, felt252>,
        registration_type: LegacyMap::<ContractAddress, RegistrationType>,
        total_names: u128,
        owner: Person
    }
    //ANCHOR_END: storage

    //ANCHOR: event
    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        StoredName: StoredName,
    }

    #[derive(Drop, starknet::Event)]
    struct StoredName {
        #[key]
        user: ContractAddress,
        name: felt252
    }
    //ANCHOR_END: event

    //ANCHOR: person
    #[derive(Drop, Serde, starknet::Store)]
    pub struct Person {
        name: felt252,
        address: ContractAddress
    }
    //ANCHOR_END: person

    //ANCHOR: enum_store
    #[derive(Drop, Serde, starknet::Store)]
    pub enum RegistrationType {
        finite: u64,
        infinite
    }
    //ANCHOR_END: enum_store

    //ANCHOR: constructor
    #[constructor]
    fn constructor(ref self: ContractState, owner: Person) {
        self.names.write(owner.address, owner.name);
        self.total_names.write(1);
        //ANCHOR: write_owner
        self.owner.write(owner);
    //ANCHOR_END: write_owner
    }
    //ANCHOR_END: constructor

    //ANCHOR: impl_public
    // Public functions
    #[abi(embed_v0)]
    impl NameRegistry of super::INameRegistry<ContractState> {
        //ANCHOR: external
        fn store_name(ref self: ContractState, name: felt252, registration_type: RegistrationType) {
            let caller = get_caller_address();
            self._store_name(caller, name, registration_type);
        }
        //ANCHOR_END: external

        //ANCHOR: view
        fn get_name(self: @ContractState, address: ContractAddress) -> felt252 {
            //ANCHOR: read
            let name = self.names.read(address);
            //ANCHOR_END: read
            name
        }

        //ANCHOR_END: view
        fn get_owner(self: @ContractState) -> Person {
            //ANCHOR: read_owner
            let owner = self.owner.read();
            //ANCHOR_END: read_owner
            owner
        }
    }
    //ANCHOR_END: impl_public

    // ANCHOR: state_internal
    // ANCHOR: generate_trait
    // Could be a group of functions about a same topic
    #[generate_trait]
    impl InternalFunctions of InternalFunctionsTrait {
        fn _store_name(
            ref self: ContractState,
            user: ContractAddress,
            name: felt252,
            registration_type: RegistrationType
        ) {
            let mut total_names = self.total_names.read();
            //ANCHOR: write
            self.names.write(user, name);
            //ANCHOR_END: write
            self.registration_type.write(user, registration_type);
            self.total_names.write(total_names + 1);
            //ANCHOR: emit_event
            self.emit(StoredName { user: user, name: name });
        //ANCHOR_END: emit_event
        }
    }
    // ANCHOR_END: generate_trait

    // Free functions
    fn get_contract_name() -> felt252 {
        'Name Registry'
    }

    fn get_owner_storage_address(self: @ContractState) -> StorageBaseAddress {
        //ANCHOR: owner_address
        self.owner.address()
    //ANCHOR_END: owner_address
    }
// ANCHOR_END: state_internal
}
//ANCHOR_END: all



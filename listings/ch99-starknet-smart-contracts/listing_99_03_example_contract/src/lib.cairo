//ANCHOR: all

use starknet::ContractAddress;

#[starknet::interface]
trait INameRegistry<TContractState> {
    fn store_name(ref self: TContractState, name: felt252);
    fn get_name(self: @TContractState, address: ContractAddress) -> felt252;
}


#[starknet::contract]
mod NameRegistry {
    use starknet::{ContractAddress, get_caller_address};

    #[storage]
    struct Storage {
        names: LegacyMap::<ContractAddress, felt252>,
        total_names: u128,
        owner: Person
    }

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
    #[derive(Copy, Drop, Serde, starknet::Store)]
    struct Person {
        name: felt252,
        address: ContractAddress
    }
    //ANCHOR_END: person

    //ANCHOR: constructor
    #[constructor]
    fn constructor(ref self: ContractState, owner: Person) {
        self.names.write(owner.address, owner.name);
        self.total_names.write(1);
        self.owner.write(owner);
    }
    //ANCHOR_END: constructor

    //ANCHOR: impl_public
    #[external(v0)]
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
            let name = self.names.read(address);
            //ANCHOR_END: read
            name
        }
    //ANCHOR_END: view
    }
    //ANCHOR_END: impl_public

    // ANCHOR: state_internal
    #[generate_trait]
    impl InternalFunctions of InternalFunctionsTrait {
        fn _store_name(ref self: ContractState, user: ContractAddress, name: felt252) {
            let mut total_names = self.total_names.read();
            //ANCHOR: write
            self.names.write(user, name);
            //ANCHOR_END: write
            self.total_names.write(total_names + 1);
            //ANCHOR: emit_event
            self.emit(StoredName { user: user, name: name });
        //ANCHOR_END: emit_event

        }
    }
    // ANCHOR_END: state_internal

    // ANCHOR: stateless_internal
    fn _get_contract_name() -> felt252 {
        'Name Registry'
    }
// ANCHOR_END: stateless_internal
}
//ANCHOR_END: all



//ANCHOR: all
#[contract]
mod Example {
    use starknet::get_caller_address;
    use starknet::ContractAddress;

    struct Storage {
        names: LegacyMap::<ContractAddress, felt252>, 
    }

    //ANCHOR: event
    #[event]
    fn StoredName(caller: ContractAddress, name: felt252) {}
    //ANCHOR_END: event

    //ANCHOR: constructor
    #[constructor]
    fn constructor(_name: felt252, _address: ContractAddress) {
        names::write(_address, _name);
    }
    //ANCHOR_END: constructor

    //ANCHOR: external
    #[external]
    fn store_name(_name: felt252) {
        let caller = get_caller_address();
        //ANCHOR: write
        names::write(caller, _name);
        //ANCHOR_END: write
        //ANCHOR: emit_event
        StoredName(caller, _name);
    //ANCHOR_END: emit_event
    }
    //ANCHOR_END: external

    //ANCHOR: view
    #[view]
    fn get_name(_address: ContractAddress) -> felt252 {
        //ANCHOR: read
        let name = names::read(_address);
        //ANCHOR_END: read
        return name;
    }
//ANCHOR_END: view
}
//ANCHOR_END: all



use starknet::ContractAddress;

#[starknet::interface]
pub trait IAddressList<TState> {
    fn register_caller(ref self: TState);
    fn get_n_th_registered_address(self: @TState, index: u64) -> Option<ContractAddress>;
    fn get_all_addresses(self: @TState) -> Array<ContractAddress>;
    fn modify_nth_address(ref self: TState, index: u64, new_address: ContractAddress);
    fn pop_last_registered_address(ref self: TState) -> Option<ContractAddress>;
}

//ANCHOR: contract
#[starknet::contract]
pub mod AddressList {
    use starknet::storage::{
        MutableVecTrait, StoragePointerReadAccess, StoragePointerWriteAccess, Vec, VecTrait,
    };
    use starknet::{ContractAddress, get_caller_address};

    //ANCHOR: storage_vecs
    #[storage]
    struct Storage {
        addresses: Vec<ContractAddress>,
    }
    //ANCHOR_END: storage_vecs

    #[abi(embed_v0)]
    impl AddressListImpl of super::IAddressList<ContractState> {
        //ANCHOR: push
        fn register_caller(ref self: ContractState) {
            let caller = get_caller_address();
            self.addresses.push(caller);
        }
        //ANCHOR_END: push

        //ANCHOR: read
        fn get_n_th_registered_address(
            self: @ContractState, index: u64,
        ) -> Option<ContractAddress> {
            self.addresses.get(index).map(|ptr| ptr.read())
        }

        fn get_all_addresses(self: @ContractState) -> Array<ContractAddress> {
            let mut addresses = array![];
            for i in 0..self.addresses.len() {
                addresses.append(self.addresses[i].read());
            }
            addresses
        }
        //ANCHOR_END: read

        //ANCHOR: modify
        fn modify_nth_address(ref self: ContractState, index: u64, new_address: ContractAddress) {
            self.addresses[index].write(new_address);
        }
        //ANCHOR_END: modify

        //ANCHOR: pop
        fn pop_last_registered_address(ref self: ContractState) -> Option<ContractAddress> {
            self.addresses.pop()
        }
        //ANCHOR_END: pop
    }
}
//ANCHOR_END: contract

#[cfg(test)]
mod tests {
    use snforge_std::{
        ContractClassTrait, DeclareResultTrait, declare, start_cheat_caller_address,
        stop_cheat_caller_address,
    };
    use starknet::ContractAddress;
    use super::{IAddressListDispatcher, IAddressListDispatcherTrait};

    fn deploy_contract() -> IAddressListDispatcher {
        let contract = declare("AddressList").unwrap().contract_class();
        let (contract_address, _) = contract.deploy(@array![]).unwrap();
        IAddressListDispatcher { contract_address }
    }

    #[test]
    fn test_get_out_of_bounds_returns_none() {
        let dispatcher = deploy_contract();
        assert!(dispatcher.get_n_th_registered_address(0).is_none());
    }

    #[test]
    fn test_register_and_get_single() {
        let dispatcher = deploy_contract();

        let user: ContractAddress = 0x111.try_into().unwrap();
        start_cheat_caller_address(dispatcher.contract_address, user);
        dispatcher.register_caller();
        stop_cheat_caller_address(dispatcher.contract_address);

        let first = dispatcher.get_n_th_registered_address(0).unwrap();
        assert_eq!(first, user);
    }

    #[test]
    fn test_register_multiple_and_get_all_in_order() {
        let dispatcher = deploy_contract();

        let a1: ContractAddress = 0xaaa.try_into().unwrap();
        let a2: ContractAddress = 0xbbb.try_into().unwrap();
        let a3: ContractAddress = 0xccc.try_into().unwrap();

        start_cheat_caller_address(dispatcher.contract_address, a1);
        dispatcher.register_caller();
        stop_cheat_caller_address(dispatcher.contract_address);

        start_cheat_caller_address(dispatcher.contract_address, a2);
        dispatcher.register_caller();
        stop_cheat_caller_address(dispatcher.contract_address);

        start_cheat_caller_address(dispatcher.contract_address, a3);
        dispatcher.register_caller();
        stop_cheat_caller_address(dispatcher.contract_address);

        let mut all = dispatcher.get_all_addresses();
        assert_eq!(all.pop_front().unwrap(), a1);
        assert_eq!(all.pop_front().unwrap(), a2);
        assert_eq!(all.pop_front().unwrap(), a3);
        assert!(all.pop_front().is_none());
    }

    #[test]
    fn test_modify_nth_address() {
        let dispatcher = deploy_contract();

        let a1: ContractAddress = 0x101.try_into().unwrap();
        let a2: ContractAddress = 0x202.try_into().unwrap();
        let a3: ContractAddress = 0x303.try_into().unwrap();
        let new_mid: ContractAddress = 0x404.try_into().unwrap();

        start_cheat_caller_address(dispatcher.contract_address, a1);
        dispatcher.register_caller();
        stop_cheat_caller_address(dispatcher.contract_address);

        start_cheat_caller_address(dispatcher.contract_address, a2);
        dispatcher.register_caller();
        stop_cheat_caller_address(dispatcher.contract_address);

        start_cheat_caller_address(dispatcher.contract_address, a3);
        dispatcher.register_caller();
        stop_cheat_caller_address(dispatcher.contract_address);

        // Modify the second entry (index 1)
        dispatcher.modify_nth_address(1, new_mid);

        assert_eq!(dispatcher.get_n_th_registered_address(0).unwrap(), a1);
        assert_eq!(dispatcher.get_n_th_registered_address(1).unwrap(), new_mid);
        assert_eq!(dispatcher.get_n_th_registered_address(2).unwrap(), a3);
    }

    #[test]
    fn test_pop_empty_returns_none() {
        let dispatcher = deploy_contract();
        assert!(dispatcher.pop_last_registered_address().is_none());
    }

    #[test]
    fn test_pop_removes_last_in_lifo_order() {
        let dispatcher = deploy_contract();

        let a1: ContractAddress = 0x111.try_into().unwrap();
        let a2: ContractAddress = 0x222.try_into().unwrap();

        start_cheat_caller_address(dispatcher.contract_address, a1);
        dispatcher.register_caller();
        stop_cheat_caller_address(dispatcher.contract_address);

        start_cheat_caller_address(dispatcher.contract_address, a2);
        dispatcher.register_caller();
        stop_cheat_caller_address(dispatcher.contract_address);

        // First pop returns last pushed (a2)
        assert_eq!(dispatcher.pop_last_registered_address().unwrap(), a2);
        // Index 1 should now be out of bounds
        assert!(dispatcher.get_n_th_registered_address(1).is_none());
        // Index 0 remains a1
        assert_eq!(dispatcher.get_n_th_registered_address(0).unwrap(), a1);

        // Second pop returns a1 and empties the list
        assert_eq!(dispatcher.pop_last_registered_address().unwrap(), a1);
        assert!(dispatcher.get_n_th_registered_address(0).is_none());
        // Further pops return None
        assert!(dispatcher.pop_last_registered_address().is_none());
    }
}

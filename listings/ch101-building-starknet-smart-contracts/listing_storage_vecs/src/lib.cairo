use starknet::ContractAddress;

#[starknet::interface]
trait IAddressList<TState> {
    fn register_caller(ref self: TState);
    fn get_n_th_registered_address(self: @TState, index: u64) -> Option<ContractAddress>;
    fn get_all_addresses(self: @TState) -> Array<ContractAddress>;
    fn modify_nth_address(ref self: TState, index: u64, new_address: ContractAddress);
}

//ANCHOR: contract
#[starknet::contract]
mod AddressList {
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
            if let Some(storage_ptr) = self.addresses.get(index) {
                return Some(storage_ptr.read());
            }
            return None;
        }

        fn get_all_addresses(self: @ContractState) -> Array<ContractAddress> {
            let mut addresses = array![];
            for i in 0..self.addresses.len() {
                addresses.append(self.addresses.at(i).read());
            }
            addresses
        }
        //ANCHOR_END: read

        //ANCHOR: modify
        fn modify_nth_address(ref self: ContractState, index: u64, new_address: ContractAddress) {
            let mut storage_ptr = self.addresses.at(index);
            storage_ptr.write(new_address);
        }
        //ANCHOR_END: modify
    }
}
//ANCHOR_END: contract



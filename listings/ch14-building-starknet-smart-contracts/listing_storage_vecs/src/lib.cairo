use core::starknet::ContractAddress;

#[starknet::interface]
trait IAddressList<TState> {
    fn register_caller(ref self: TState);
    fn get_n_th_registered_address(self: @TState, index: u64) -> ContractAddress;
    fn get_all_addresses(self: @TState) -> Array<ContractAddress>;
}

#[starknet::contract]
mod AddressList {
    use starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess, Vec};
    use core::starknet::ContractAddress;

    #[storage]
    struct Storage {
        addresses: Vec<ContractAddress>,
    }

    impl AddressListImpl of super::IAddressList<ContractState> {
        fn register_caller(ref self: ContractState) {
            let caller = get_caller_address();
            self.addresses.append().write(caller);
        }
        fn get_n_th_registered_address(self: @ContractState, index: u64) -> ContractAddress {
            self.addresses.at(index).read()
        }
        fn get_all_addresses(self: @ContractState) -> Array<ContractAddress> {
            let mut addresses = array![];
            for i in 0..self.addresses.len() {
                addresses.append(self.addresses.at(i).read());
            };
            addresses
        }
    }
}

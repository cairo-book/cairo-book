use starknet::ContractAddress;

#[starknet::interface]
trait IWarehouseContract<TState> {
    fn set_quantity(ref self: TState, item_id: u64, quantity: u64);
    fn get_item_quantity(self: @TState, address: ContractAddress, item_id: u64) -> u64;
}

// ANCHOR: contract
#[starknet::contract]
mod WarehouseContract {
    use starknet::storage::{
        Map, StoragePathEntry, StoragePointerReadAccess, StoragePointerWriteAccess,
    };
    use starknet::{ContractAddress, get_caller_address};

    // ANCHOR: storage
    #[storage]
    struct Storage {
        user_warehouse: Map<ContractAddress, Map<u64, u64>>,
    }
    // ANCHOR_END: storage

    #[abi(embed_v0)]
    impl WarehouseContractImpl of super::IWarehouseContract<ContractState> {
        // ANCHOR: accesses
        fn set_quantity(ref self: ContractState, item_id: u64, quantity: u64) {
            let caller = get_caller_address();
            self.user_warehouse.entry(caller).entry(item_id).write(quantity);
        }

        fn get_item_quantity(self: @ContractState, address: ContractAddress, item_id: u64) -> u64 {
            self.user_warehouse.entry(address).entry(item_id).read()
        }
        // ANCHOR_END: accesses
    }
}
// ANCHOR_END: contract

#[cfg(test)]
mod tests {
    use snforge_std::{
        ContractClassTrait, DeclareResultTrait, declare, start_cheat_caller_address,
        stop_cheat_caller_address,
    };
    use starknet::ContractAddress;
    use super::{IWarehouseContractDispatcher, IWarehouseContractDispatcherTrait};

    fn deploy_contract() -> IWarehouseContractDispatcher {
        let contract = declare("WarehouseContract").unwrap().contract_class();
        let (contract_address, _) = contract.deploy(@array![]).unwrap();
        IWarehouseContractDispatcher { contract_address }
    }

    #[test]
    fn test_default_quantity_is_zero() {
        let dispatcher = deploy_contract();
        let user: ContractAddress = 0x111.try_into().unwrap();
        assert_eq!(dispatcher.get_item_quantity(user, 1), 0);
    }

    #[test]
    fn test_set_and_get_quantity_for_caller() {
        let dispatcher = deploy_contract();
        let user: ContractAddress = 0x222.try_into().unwrap();

        start_cheat_caller_address(dispatcher.contract_address, user);
        dispatcher.set_quantity(10, 42);
        stop_cheat_caller_address(dispatcher.contract_address);

        assert_eq!(dispatcher.get_item_quantity(user, 10), 42);
        // Different item id should remain zero
        assert_eq!(dispatcher.get_item_quantity(user, 11), 0);
    }

    #[test]
    fn test_quantities_are_per_user() {
        let dispatcher = deploy_contract();
        let user1: ContractAddress = 0xabc.try_into().unwrap();
        let user2: ContractAddress = 0xdef.try_into().unwrap();

        start_cheat_caller_address(dispatcher.contract_address, user1);
        dispatcher.set_quantity(1, 10);
        stop_cheat_caller_address(dispatcher.contract_address);

        start_cheat_caller_address(dispatcher.contract_address, user2);
        dispatcher.set_quantity(1, 7);
        stop_cheat_caller_address(dispatcher.contract_address);

        assert_eq!(dispatcher.get_item_quantity(user1, 1), 10);
        assert_eq!(dispatcher.get_item_quantity(user2, 1), 7);
        // Ensure other item for user1 remains zero
        assert_eq!(dispatcher.get_item_quantity(user1, 2), 0);
    }

    #[test]
    fn test_update_quantity_overwrites_value() {
        let dispatcher = deploy_contract();
        let user: ContractAddress = 0x303.try_into().unwrap();

        start_cheat_caller_address(dispatcher.contract_address, user);
        dispatcher.set_quantity(5, 1);
        dispatcher.set_quantity(5, 99);
        stop_cheat_caller_address(dispatcher.contract_address);

        assert_eq!(dispatcher.get_item_quantity(user, 5), 99);
    }
}

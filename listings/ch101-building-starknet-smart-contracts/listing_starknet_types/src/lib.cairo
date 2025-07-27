// ANCHOR: contract_address
use starknet::{ContractAddress, get_caller_address};

#[starknet::interface]
pub trait IAddressExample<TContractState> {
    fn get_owner(self: @TContractState) -> ContractAddress;
    fn transfer_ownership(ref self: TContractState, new_owner: ContractAddress);
}

#[starknet::contract]
mod AddressExample {
    use starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess};
    use super::{ContractAddress, get_caller_address};

    #[storage]
    struct Storage {
        owner: ContractAddress,
    }

    #[constructor]
    fn constructor(ref self: ContractState, initial_owner: ContractAddress) {
        self.owner.write(initial_owner);
    }

    #[abi(embed_v0)]
    impl AddressExampleImpl of super::IAddressExample<ContractState> {
        fn get_owner(self: @ContractState) -> ContractAddress {
            self.owner.read()
        }

        fn transfer_ownership(ref self: ContractState, new_owner: ContractAddress) {
            let caller = get_caller_address();
            assert!(caller == self.owner.read(), "Only owner can transfer");
            self.owner.write(new_owner);
        }
    }
}
// ANCHOR_END: contract_address

// ANCHOR: storage_address
#[starknet::contract]
mod StorageExample {
    use starknet::storage_access::StorageAddress;

    #[storage]
    struct Storage {
        value: u256,
    }

    // This is an internal function that demonstrates StorageAddress usage
    // In practice, you rarely need to work with StorageAddress directly
    fn read_from_storage_address(address: StorageAddress) -> felt252 {
        starknet::syscalls::storage_read_syscall(0, address).unwrap()
    }
}
// ANCHOR_END: storage_address

// ANCHOR: eth_address
use starknet::EthAddress;

#[starknet::interface]
pub trait IEthAddressExample<TContractState> {
    fn set_l1_contract(ref self: TContractState, l1_contract: EthAddress);
    fn send_message_to_l1(ref self: TContractState, recipient: EthAddress, amount: felt252);
}

#[starknet::contract]
mod EthAddressExample {
    use starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess};
    use starknet::syscalls::send_message_to_l1_syscall;
    use super::EthAddress;

    #[storage]
    struct Storage {
        l1_contract: EthAddress,
    }

    #[abi(embed_v0)]
    impl EthAddressExampleImpl of super::IEthAddressExample<ContractState> {
        fn set_l1_contract(ref self: ContractState, l1_contract: EthAddress) {
            self.l1_contract.write(l1_contract);
        }

        fn send_message_to_l1(ref self: ContractState, recipient: EthAddress, amount: felt252) {
            // Send a message to L1 with recipient and amount
            let payload = array![recipient.into(), amount];
            send_message_to_l1_syscall(self.l1_contract.read().into(), payload.span()).unwrap();
        }
    }

    #[l1_handler]
    fn handle_message_from_l1(ref self: ContractState, from_address: felt252, amount: felt252) {
        // Verify the message comes from the expected L1 contract
        assert!(from_address == self.l1_contract.read().into(), "Invalid L1 sender");
        // Process the message...
    }
}
// ANCHOR_END: eth_address

// ANCHOR: class_hash
use starknet::ClassHash;

#[starknet::interface]
pub trait IClassHashExample<TContractState> {
    fn get_implementation_hash(self: @TContractState) -> ClassHash;
    fn upgrade(ref self: TContractState, new_class_hash: ClassHash);
}

#[starknet::contract]
mod ClassHashExample {
    use starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess};
    use starknet::syscalls::replace_class_syscall;
    use super::ClassHash;

    #[storage]
    struct Storage {
        implementation_hash: ClassHash,
    }

    #[constructor]
    fn constructor(ref self: ContractState, initial_class_hash: ClassHash) {
        self.implementation_hash.write(initial_class_hash);
    }

    #[abi(embed_v0)]
    impl ClassHashExampleImpl of super::IClassHashExample<ContractState> {
        fn get_implementation_hash(self: @ContractState) -> ClassHash {
            self.implementation_hash.read()
        }

        fn upgrade(ref self: ContractState, new_class_hash: ClassHash) {
            replace_class_syscall(new_class_hash).unwrap();
            self.implementation_hash.write(new_class_hash);
        }
    }
}
// ANCHOR_END: class_hash

// ANCHOR: block_tx_info
#[starknet::interface]
pub trait IBlockInfo<TContractState> {
    fn get_block_info(self: @TContractState) -> (u64, u64);
    fn get_tx_info(self: @TContractState) -> (ContractAddress, felt252);
}

#[starknet::contract]
mod BlockInfoExample {
    use starknet::{get_block_info, get_tx_info};
    use super::ContractAddress;

    #[storage]
    struct Storage {}

    #[abi(embed_v0)]
    impl BlockInfoImpl of super::IBlockInfo<ContractState> {
        fn get_block_info(self: @ContractState) -> (u64, u64) {
            let block_info = get_block_info();
            (block_info.block_number, block_info.block_timestamp)
        }

        fn get_tx_info(self: @ContractState) -> (ContractAddress, felt252) {
            let tx_info = get_tx_info();

            // Access transaction details
            let sender = tx_info.account_contract_address;
            let tx_hash = tx_info.transaction_hash;

            (sender, tx_hash)
        }
    }
}
// ANCHOR_END: block_tx_info



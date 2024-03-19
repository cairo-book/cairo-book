//ANCHOR:here
use starknet::ContractAddress;

#[starknet::interface]
trait IRaffle<TContractState> {
    fn enter_raffle(ref self: TContractState, amount: u128);
    fn pick_winner(self: @TContractState) -> ContractAddress;
}

#[starknet::contract]
mod Raffle {
    use super::{ContractAddress, IRaffle};
    use starknet::{get_caller_address};
    use pragma_lib::abi::{IRandomnessDispatcher, IRandomnessDispatcherTrait};

    #[storage]
    struct Storage {
        players: Array<ContractAddress>,
        winner: ContractAddress,
        randomness_contract_address: ContractAddress,
    }

    #[constructor]
    fn constructor(ref self: ContractState, randomness_contract_address: ContractAddress) {
        self.randomness_contract_address.write(randomness_contract_address);
    }

    #[abi(embed_v0)]
    impl Raffle of IRaffle<ContractState> {
        fn enter_raffle(ref self: ContractState, amount: u128) {}
        fn pick_winner(self: @ContractState) -> ContractAddress {}
    }
}


//ANCHOR_END:here

#[cfg(test)]
mod tests {
// use super::{SizesStorePacking, Sizes};
// use starknet::storage_access::StorePacking;
// #[test]
// fn test_pack_unpack() {
//     let value = Sizes { tiny: 0x12, small: 0x12345678, medium: 0x1234567890, };

//     let packed = SizesStorePacking::pack(value);
//     assert(packed == 0x12345678901234567812, 'wrong packed value');

//     let unpacked = SizesStorePacking::unpack(packed);
//     assert(unpacked.tiny == 0x12, 'wrong unpacked tiny');
//     assert(unpacked.small == 0x12345678, 'wrong unpacked small');
//     assert(unpacked.medium == 0x1234567890, 'wrong unpacked medium');
// }
}

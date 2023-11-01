use starknet::{ClassHash, ContractAddress};
use array::SpanTrait;
#[starknet::interface]
trait ISenderContract<TContractState> {
    fn invoke_external_contract_1(
        ref self: TContractState,
        amount: u128,
        external_contract: ContractAddress,
        entry_point_selector: felt252
    ) -> bool;
    fn invoke_external_contract_2(
        ref self: TContractState,
        value: u128,
        information: felt252,
        external_contract: ContractAddress,
        entry_point_selector: felt252
    ) -> bool;

    fn invoke_external_contract_3(
        ref self: TContractState,
        callData: Array<felt252>,
        external_contract: ContractAddress,
        entry_point_selector: felt252
    ) -> bool;

    fn invoke_external_contract_4(
        ref self: TContractState,
        callData: Array<felt252>,
        external_contract: ContractAddress,
        entry_point_selector: felt252
    ) -> bool;
}

#[starknet::contract]
mod sender_contract {
    use core::array::ArrayTrait;
    use serde::Serde;
    use starknet::{ClassHash, ContractAddress};

    use array::SpanTrait;
    use starknet::syscalls::replace_class_syscall;
    #[storage]
    struct Storage {
        counter: u128,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        ExternalContract: ExternalContract,
    }

    #[derive(Drop, starknet::Event)]
    struct ExternalContract {
        value: bool
    }

    #[external(v0)]
    impl SenderContract of super::ISenderContract<ContractState> {
        //In this function we are invoking the function of receiveContract that has the same
        //function parameter as the one that we are sending from sendContract. So here amount is
        // a function paramter is sendcontract which will be present in the receiveContract as well,
        // of function name example_1.

        //@amount the amount to update on receiveContract
        //@external_contract it is the external contract address that we want to invoke
        //@entry_point_selector it is the starknet keccak of the function selector
        fn invoke_external_contract_1(
            ref self: ContractState,
            amount: u128,
            external_contract: ContractAddress,
            entry_point_selector: felt252
        ) -> bool {
            let mut Calldata: Array<felt252> = ArrayTrait::new();
            Serde::serialize(@amount, ref Calldata);
            let mut res = starknet::call_contract_syscall(
                address: external_contract,
                entry_point_selector: entry_point_selector,
                calldata: Calldata.span(),
            );

            let execflag = ResultTrait::is_ok(@res);
            self.emit(ExternalContract { value: execflag });
            execflag
        }


        //In this function we are invoking the function of receiveContract that has the same
        //function parameter as the one that we are sending from sendContract. So here amount and
        // information is the function paramter in sendcontract which will be present in the 
        // receiveContract as well, of function name example_2.

        //@value the amount to update on receiveContract
        //@information the information to update on receiveContract
        //@external_contract it is the external contract address that we want to invoke
        //@entry_point_selector it is the starknet keccak of the function selector
        fn invoke_external_contract_2(
            ref self: ContractState,
            value: u128,
            information: felt252,
            external_contract: ContractAddress,
            entry_point_selector: felt252
        ) -> bool {
            let mut Calldata: Array<felt252> = ArrayTrait::new();
            Serde::serialize(@value, ref Calldata);
            Serde::serialize(@information, ref Calldata);
            let mut res = starknet::call_contract_syscall(
                address: external_contract,
                entry_point_selector: entry_point_selector,
                calldata: Calldata.span(),
            );

            let execflag = ResultTrait::is_ok(@res);
            self.emit(ExternalContract { value: execflag });
            execflag
        }

        //In this function we are invoking the function of receiveContract that has the same
        //function parameter as the one that we are sending from sendContract. So here it is an
        // Array<felt252>, which is the function paramter in sendcontract which will be present in the 
        // receiveContract as well, of function name example_3.

        //ps : this will only work on example_3 of the receiveContract since we deserialize it in
        // a way expecting that the first element is a u256 and second one is a felt252

        //@callData the array of data to pass on to receiveContract
        //@external_contract it is the external contract address that we want to invoke
        //@entry_point_selector it is the starknet keccak of the function selector
        fn invoke_external_contract_3(
            ref self: ContractState,
            callData: Array<felt252>,
            external_contract: ContractAddress,
            entry_point_selector: felt252
        ) -> bool {
            let mut arr: Array<felt252> = ArrayTrait::new();
            Serde::serialize(@callData, ref arr);
            let mut res = starknet::call_contract_syscall(
                address: external_contract,
                entry_point_selector: entry_point_selector,
                calldata: arr.span(),
            );

            let execflag = ResultTrait::is_ok(@res);
            self.emit(ExternalContract { value: execflag });
            execflag
        }

        //In this function we are invoking the function of receiveContract that has the same
        //function parameter as the one that we are sending from sendContract. So here it is an
        // Array<felt252>, which is the function paramter in sendcontract which will be present in the 
        // receiveContract as well, of function name example_3.

        //ps : this will work on any function

        //@callData the array of data to pass on to receiveContract
        //@external_contract it is the external contract address that we want to invoke
        //@entry_point_selector it is the starknet keccak of the function selector

        fn invoke_external_contract_4(
            ref self: ContractState,
            callData: Array<felt252>,
            external_contract: ContractAddress,
            entry_point_selector: felt252
        ) -> bool {
            let mut res = starknet::call_contract_syscall(
                address: external_contract,
                entry_point_selector: entry_point_selector,
                calldata: callData.span(),
            );

            let execflag = ResultTrait::is_ok(@res);
            self.emit(ExternalContract { value: execflag });
            execflag
        }
    }
}
//0x031f3700133e897485a7d0fa40acb476f12c2c13bf89ad966244248b9f7fd475



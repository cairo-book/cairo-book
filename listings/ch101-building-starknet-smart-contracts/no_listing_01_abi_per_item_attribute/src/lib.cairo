#[starknet::contract]
mod ContractExample {
    #[storage]
    struct Storage {}

    #[abi(per_item)]
    #[generate_trait]
    impl SomeImpl of SomeTrait {
        #[constructor]
        // this is a constructor function
        fn constructor(ref self: ContractState) {}

        #[external(v0)]
        // this is a public function
        fn external_function(ref self: ContractState, arg1: felt252) {}

        #[l1_handler]
        // this is a l1_handler function
        fn handle_message(ref self: ContractState, from_address: felt252, arg: felt252) {}

        // this is an internal function
        fn internal_function(self: @ContractState) {}
    }
}

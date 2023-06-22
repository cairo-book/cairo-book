#[starknet::contract]
mod Contract {
    #[storage]
    struct Storage {
        balance: u256
    }

    //ANCHOR: withdraw
    impl Contract of IContract<ContractState> {
        fn withdraw(ref self: ContractState, amount: u256) {
            let current_balance = balance::read();

            assert(balance::read() >= amount, 'Insufficient funds');

            balance.write(current_balance - amount);
        }
    //ANCHOR_END: withdraw

    }
}

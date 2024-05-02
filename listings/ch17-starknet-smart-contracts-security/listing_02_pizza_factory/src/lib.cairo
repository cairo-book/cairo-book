use starknet::ContractAddress;

#[starknet::interface]
pub trait IPizzaFactory<TContractState> {
    fn increase_pepperoni(ref self: TContractState, amount: felt252);
    fn increase_pineapple(ref self: TContractState, amount: felt252);
    fn get_pepperoni_amount(self: @TContractState) -> felt252;
    fn get_pineapple_amount(self: @TContractState) -> felt252;
    fn get_owner(self: @TContractState) -> ContractAddress;
}

#[starknet::contract]
mod PizzaFactory {

    use starknet::ContractAddress;

    #[storage]
    struct Storage {
        pepperoni: felt252,
        pineapple: felt252,
        owner: ContractAddress
    }

    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress) {
        self.pepperoni.write(0);
        self.pineapple.write(0);
        self.owner.write(owner);
    }


    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        PizzaEmission: PizzaCounter
    }

    #[derive(Drop, starknet::Event)]
    struct PizzaCounter {
        counter: felt252
    }

    #[external(v0)]
    fn emit_event(ref self: ContractState,) {
        self.emit(Event::PizzaEmission(PizzaCounter { counter: 1 }));
    }

    #[abi(embed_v0)]
    impl PizzaFactoryimpl of super::IPizzaFactory<ContractState> {
        fn increase_pepperoni(ref self: ContractState, amount: felt252) {
            assert(amount != 0, 'Amount cannot be 0');
            self.pepperoni.write(self.pepperoni.read() + amount);
        }

        fn increase_pineapple(ref self: ContractState, amount: felt252) {
            assert(amount != 0, 'Amount cannot be 0');
            self.pineapple.write(self.pineapple.read() + amount);
        }

        fn get_pepperoni_amount(self: @ContractState) -> felt252 {
            self.pepperoni.read()
        }

        fn get_pineapple_amount(self: @ContractState) -> felt252 {
            self.pineapple.read()
        }

        fn get_owner(self: @ContractState) -> ContractAddress {
            self.owner.read()
        }
    }
}

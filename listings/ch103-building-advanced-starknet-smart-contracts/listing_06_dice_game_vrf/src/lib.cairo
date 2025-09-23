//ANCHOR: interfaces
use starknet::ContractAddress;

#[starknet::interface]
pub trait IVRFGame<TContractState> {
    fn get_last_random_number(self: @TContractState) -> felt252;
    fn settle_random(ref self: TContractState);
    fn set_vrf_provider(ref self: TContractState, new_vrf_provider: ContractAddress);
}

#[starknet::interface]
pub trait IDiceGame<TContractState> {
    fn guess(ref self: TContractState, guess: u8);
    fn toggle_play_window(ref self: TContractState);
    fn get_game_window(self: @TContractState) -> bool;
    fn process_game_winners(ref self: TContractState);
}
//ANCHOR_END: interfaces

//ANCHOR: dice_game
#[starknet::contract]
mod DiceGame {
    use openzeppelin::access::ownable::OwnableComponent;
    use starknet::storage::{
        Map, StoragePathEntry, StoragePointerReadAccess, StoragePointerWriteAccess,
    };
    use starknet::{ContractAddress, get_caller_address, get_contract_address};

    // Cartridge VRF consumer component and types
    use cartridge_vrf::vrf_consumer::vrf_consumer_component::VrfConsumerComponent;
    use cartridge_vrf::Source;

    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);
    component!(path: VrfConsumerComponent, storage: vrf_consumer, event: VrfConsumerEvent);

    #[abi(embed_v0)]
    impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;
    impl InternalImpl = OwnableComponent::InternalImpl<ContractState>;

    // Expose VRF consumer helpers
    #[abi(embed_v0)]
    impl VrfConsumerImpl = VrfConsumerComponent::VrfConsumerImpl<ContractState>;
    impl VrfConsumerInternalImpl = VrfConsumerComponent::InternalImpl<ContractState>;

    #[storage]
    struct Storage {
        user_guesses: Map<ContractAddress, u8>,
        game_window: bool,
        last_random_number: felt252,
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
        #[substorage(v0)]
        vrf_consumer: VrfConsumerComponent::Storage,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        GameWinner: ResultAnnouncement,
        GameLost: ResultAnnouncement,
        #[flat]
        OwnableEvent: OwnableComponent::Event,
        #[flat]
        VrfConsumerEvent: VrfConsumerComponent::Event,
    }

    #[derive(Drop, starknet::Event)]
    struct ResultAnnouncement {
        caller: ContractAddress,
        guess: u8,
        random_number: u256,
    }

    #[constructor]
    fn constructor(ref self: ContractState, vrf_provider: ContractAddress, owner: ContractAddress) {
        self.ownable.initializer(owner);
        self.vrf_consumer.initializer(vrf_provider);
        self.game_window.write(true);
    }

    #[abi(embed_v0)]
    impl DiceGame of super::IDiceGame<ContractState> {
        fn guess(ref self: ContractState, guess: u8) {
            assert!(self.game_window.read(), "GAME_INACTIVE");
            assert!(guess >= 1 && guess <= 6, "INVALID_GUESS");

            let caller = get_caller_address();
            self.user_guesses.entry(caller).write(guess);
        }

        fn toggle_play_window(ref self: ContractState) {
            self.ownable.assert_only_owner();

            let current: bool = self.game_window.read();
            self.game_window.write(!current);
        }

        fn get_game_window(self: @ContractState) -> bool {
            self.game_window.read()
        }

        fn process_game_winners(ref self: ContractState) {
            assert!(!self.game_window.read(), "GAME_ACTIVE");
            assert!(self.last_random_number.read() != 0, "NO_RANDOM_NUMBER_YET");

            let caller = get_caller_address();
            let user_guess: u8 = self.user_guesses.entry(caller).read();
            let reduced_random_number: u256 = self.last_random_number.read().into() % 6 + 1;

            if user_guess == reduced_random_number.try_into().unwrap() {
                self
                    .emit(
                        Event::GameWinner(
                            ResultAnnouncement {
                                caller: caller,
                                guess: user_guess,
                                random_number: reduced_random_number,
                            },
                        ),
                    );
            } else {
                self
                    .emit(
                        Event::GameLost(
                            ResultAnnouncement {
                                caller: caller,
                                guess: user_guess,
                                random_number: reduced_random_number,
                            },
                        ),
                    );
            }
        }
    }

    #[abi(embed_v0)]
    impl VRFGame of super::IVRFGame<ContractState> {
        fn get_last_random_number(self: @ContractState) -> felt252 {
            self.last_random_number.read()
        }

        // Settle randomness for the current round using Cartridge VRF.
        // Requires the caller to prefix the multicall with:
        //   VRF.request_random(caller: <this contract>, source: Source::Nonce(<this contract>))
        fn settle_random(ref self: ContractState) {
            self.ownable.assert_only_owner();
            // Consume a random value tied to this contract's own nonce
            let random = self
                .vrf_consumer
                .consume_random(Source::Nonce(get_contract_address()));
            self.last_random_number.write(random);
        }

        fn set_vrf_provider(ref self: ContractState, new_vrf_provider: ContractAddress) {
            self.ownable.assert_only_owner();
            self.vrf_consumer.set_vrf_provider(new_vrf_provider);
        }
    }
}
//ANCHOR_END: dice_game


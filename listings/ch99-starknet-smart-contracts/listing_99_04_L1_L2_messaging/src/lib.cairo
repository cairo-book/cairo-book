#[starknet::contract]
mod Evaluator {
    use starknet::get_caller_address;
    use starknet::get_contract_address;
    use starknet::ContractAddress;
    use starknet::syscalls::send_message_to_l1_syscall;


    use zeroable::Zeroable;


    use integer::u256;
    use integer::u256_from_felt252;

    #[storage]
    struct Storage {
        l1_evaluator_address: felt252,
        messages: LegacyMap<usize, usize>,
        messages_count: usize
    }

    #[constructor]
    fn constructor(ref self: ContractState) {}

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        ReceivedSomething: ReceivedSomething,
    }

    #[derive(Drop, starknet::Event)]
    struct ReceivedSomething {
        #[key]
        from: usize,
        name: usize
    }


    //ANCHOR:here
    #[l1_handler]
    fn ex_01_receive_message_from_l1(
        ref self: ContractState, from_address: felt252, message: usize
    ) {
        // Selector: 0x274ab8abc4e270a94c36e1a54c794cd4dd537eeee371e7188c56ee768c4c0c4
        // Check that the sender is the correct L1 evaluator
        assert(from_address == self.l1_evaluator_address.read(), 'WRONG L1 EVALUATOR');
        // Adding a check on the message, because why not?
        assert(message > 168111, 'MESSAGE TOO SMALL');
        assert(message < 5627895, 'MESSAGE TOO BIG');

        // Store the message received from L1
        let mut message_count = self.messages_count.read();
        self.messages.write(message_count, message);
        message_count += 1;
        self.messages_count.write(message_count);
    }
    //ANCHOR_END: here
    //ANCHOR: l2l1

    #[external(v0)]
    #[generate_trait]
    impl Evaluator of IEvaluator {
        fn ex_02_send_message_to_l1(ref self: ContractState, value: usize) {
            // Create the message payload
            // By default it's an array of felt252
            let mut message_payload = ArrayTrait::new();
            // Adding the address of the caller on L2
            message_payload.append(get_caller_address().into());
            // Adding the value
            message_payload.append(value.into());
            // Sending the message
            send_message_to_l1_syscall(self.l1_evaluator_address.read(), message_payload.span());
        }

        fn get_l1_evaluator_address(self: @ContractState) -> felt252 {
            self.l1_evaluator_address.read()
        }
    }
//ANCHOR_END: l2l1

}

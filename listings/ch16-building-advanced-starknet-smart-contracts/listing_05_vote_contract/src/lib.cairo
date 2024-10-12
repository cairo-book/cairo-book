///  Core Library Imports for the Traits outside the Starknet Contract
use core::starknet::ContractAddress;

///  Trait defining the functions that can be implemented or called by the Starknet Contract
#[starknet::interface]
trait VoteTrait<T> {
    /// Returns the current vote status
    fn get_vote_status(self: @T) -> (u8, u8, u8, u8);
    /// Checks if the user at the specified address is allowed to vote
    fn voter_can_vote(self: @T, user_address: ContractAddress) -> bool;
    /// Checks if the specified address is registered as a voter
    fn is_voter_registered(self: @T, address: ContractAddress) -> bool;
    /// Allows a user to vote
    fn vote(ref self: T, vote: u8);
}

/// Starknet Contract allowing three registered voters to vote on a proposal
#[starknet::contract]
mod Vote {
    use core::starknet::ContractAddress;
    use core::starknet::get_caller_address;
    use core::starknet::storage::{
        StoragePointerReadAccess, StoragePointerWriteAccess, StorageMapReadAccess,
        StorageMapWriteAccess, Map
    };

    const YES: u8 = 1_u8;
    const NO: u8 = 0_u8;

    ///  Structure that stores vote counts and voter states
    #[storage]
    struct Storage {
        yes_votes: u8,
        no_votes: u8,
        can_vote: Map::<ContractAddress, bool>,
        registered_voter: Map::<ContractAddress, bool>,
    }

    /// Contract constructor initializing the contract with a list of registered voters and 0
    /// vote count
    #[constructor]
    fn constructor(
        ref self: ContractState,
        voter_1: ContractAddress,
        voter_2: ContractAddress,
        voter_3: ContractAddress
    ) {
        // Register all voters by calling the _register_voters function
        self._register_voters(voter_1, voter_2, voter_3);

        // Initialize the vote count to 0
        self.yes_votes.write(0_u8);
        self.no_votes.write(0_u8);
    }

    ///  Event that gets emitted when a vote is cast
    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        VoteCast: VoteCast,
        UnauthorizedAttempt: UnauthorizedAttempt,
    }

    /// Represents a vote that was cast
    #[derive(Drop, starknet::Event)]
    struct VoteCast {
        voter: ContractAddress,
        vote: u8,
    }

    /// Represents an unauthorized attempt to vote
    #[derive(Drop, starknet::Event)]
    struct UnauthorizedAttempt {
        unauthorized_address: ContractAddress,
    }

    /// Implementation of VoteTrait for ContractState
    #[abi(embed_v0)]
    impl VoteImpl of super::VoteTrait<ContractState> {
        /// Returns the voting results
        fn get_vote_status(self: @ContractState) -> (u8, u8, u8, u8) {
            let (n_yes, n_no) = self._get_voting_result();
            let (yes_percentage, no_percentage) = self._get_voting_result_in_percentage();
            (n_yes, n_no, yes_percentage, no_percentage)
        }

        /// Check whether a voter is allowed to vote
        fn voter_can_vote(self: @ContractState, user_address: ContractAddress) -> bool {
            self.can_vote.read(user_address)
        }

        /// Check whether an address is registered as a voter
        fn is_voter_registered(self: @ContractState, address: ContractAddress) -> bool {
            self.registered_voter.read(address)
        }

        /// Submit a vote
        fn vote(ref self: ContractState, vote: u8) {
            assert!(vote == NO || vote == YES, "VOTE_0_OR_1");
            let caller: ContractAddress = get_caller_address();
            self._assert_allowed(caller);
            self.can_vote.write(caller, false);

            if (vote == NO) {
                self.no_votes.write(self.no_votes.read() + 1_u8);
            }
            if (vote == YES) {
                self.yes_votes.write(self.yes_votes.read() + 1_u8);
            }

            self.emit(VoteCast { voter: caller, vote: vote, });
        }
    }

    /// Internal Functions implementation for the Vote contract
    #[generate_trait]
    impl InternalFunctions of InternalFunctionsTrait {
        /// Registers the voters and initializes their voting status to true (can vote)
        fn _register_voters(
            ref self: ContractState,
            voter_1: ContractAddress,
            voter_2: ContractAddress,
            voter_3: ContractAddress
        ) {
            self.registered_voter.write(voter_1, true);
            self.can_vote.write(voter_1, true);

            self.registered_voter.write(voter_2, true);
            self.can_vote.write(voter_2, true);

            self.registered_voter.write(voter_3, true);
            self.can_vote.write(voter_3, true);
        }
    }

    /// Asserts implementation for the Vote contract
    #[generate_trait]
    impl AssertsImpl of AssertsTrait {
        //  Internal function that checks if an address is allowed to vote
        fn _assert_allowed(ref self: ContractState, address: ContractAddress) {
            let is_voter: bool = self.registered_voter.read((address));
            let can_vote: bool = self.can_vote.read((address));

            if (!can_vote) {
                self.emit(UnauthorizedAttempt { unauthorized_address: address, });
            }

            assert!(is_voter, "USER_NOT_REGISTERED");
            assert!(can_vote, "USER_ALREADY_VOTED");
        }
    }

    /// Implement the VotingResultTrait for the Vote contract
    #[generate_trait]
    impl VoteResultFunctionsImpl of VoteResultFunctionsTrait {
        // Internal function to get the voting results (yes and no vote counts)
        fn _get_voting_result(self: @ContractState) -> (u8, u8) {
            let n_yes: u8 = self.yes_votes.read();
            let n_no: u8 = self.no_votes.read();

            (n_yes, n_no)
        }

        // Internal function to calculate the voting results in percentage
        fn _get_voting_result_in_percentage(self: @ContractState) -> (u8, u8) {
            let n_yes: u8 = self.yes_votes.read();
            let n_no: u8 = self.no_votes.read();

            let total_votes: u8 = n_yes + n_no;

            if (total_votes == 0_u8) {
                return (0, 0);
            }
            let yes_percentage: u8 = (n_yes * 100_u8) / (total_votes);
            let no_percentage: u8 = (n_no * 100_u8) / (total_votes);

            (yes_percentage, no_percentage)
        }
    }
}

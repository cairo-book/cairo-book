#[starknet::contract]
mod VotingSystem {
    use starknet::{ContractAddress, get_caller_address};
    use core::starknet::storage::{
        Map, StoragePathEntry, StoragePointerReadAccess, StoragePointerWriteAccess,
    };

    #[storage]
    struct Storage {
        proposals: Map<u32, ProposalNode>,
        proposal_count: u32,
    }

    //ANCHOR: storage_node
    #[starknet::storage_node]
    struct ProposalNode {
        title: felt252,
        description: felt252,
        yes_votes: u32,
        no_votes: u32,
        voters: Map<ContractAddress, bool>,
    }
    //ANCHOR_END: storage_node

    //ANCHOR: create_proposal
    #[external(v0)]
    fn create_proposal(ref self: ContractState, title: felt252, description: felt252) -> u32 {
        let mut proposal_count = self.proposal_count.read();
        let new_proposal_id = proposal_count + 1;

        let mut proposal = self.proposals.entry(new_proposal_id);
        proposal.title.write(title);
        proposal.description.write(description);
        proposal.yes_votes.write(0);
        proposal.no_votes.write(0);

        self.proposal_count.write(new_proposal_id);

        new_proposal_id
    }
    //ANCHOR_END: create_proposal

    //ANCHOR: vote
    #[external(v0)]
    fn vote(ref self: ContractState, proposal_id: u32, vote: bool) {
        let mut proposal = self.proposals.entry(proposal_id);
        let caller = get_caller_address();
        let has_voted = proposal.voters.entry(caller).read();
        if has_voted {
            return;
        }
        proposal.voters.entry(caller).write(true);
    }
    //ANCHOR_END: vote
}

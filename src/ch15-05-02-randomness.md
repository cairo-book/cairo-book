# Randomness

If we need to generate randomness on the blockchain, it has to be done in a secure manner to ensure that the result cannot be predicted or manipulated. A common way to achieve this is to use verifiable random function ( VRF ) which is typically provided by an oracle.

[Pragma](https://docs.pragma.build/Resources/Cairo%201/randomness/randomness), an oracle on Starknet provides a solution for generating VRFs which is used by most of the top protocols in the ecosystem.

Let's dive into how to use Pragma to create randomness in a Cairo contract.

### Adding Pragma as a Dependency to Your `Scarb.toml` file.

```toml
[dependencies]
pragma_lib = { git = "https://github.com/astraly-labs/pragma-lib" }
```

### Sample Cairo Contract for Randomness: Raffle Game

```rust
{{#include ../listings/ch99-starknet-smart-contracts/listing_99_15_randomness/src/lib.cairo:struct}}
```

```rs
use starknet::ContractAddress;

#[starknet::interface]
trait IRaffle<TContractState> {
	fn enter_raffle(ref self: TContractState, amount: u128);
	fn pick_winner(self: @TContractState) -> ContractAddress;
}

#[starknet::contract]
mod Raffle {
	use super::{ContractAddress, IRaffle};
	use starknet::info::{get_caller_address};
	use pragma_lib::abi::{IRandomnessDispatcher, IRandomnessDispatcherTrait};

	#[storage]
	struct Storage {
		winner: ContractAddress;
	}

	#[constructor]
    fn constructor(ref self: ContractState, randomness_contract_address: ContractAddress) {
        self.randomness_contract_address.write(randomness_contract_address);
    }

	#[abi(embed_v0)]
	impl Raffle of IRaffle<ContractState> {
		fn enter_raffle(ref self: ContractState, amount:u128){}
		fn pick_winner(self: @ContractState) -> ContractAddress {}
	}
}
```

### Explanation for Example Functions that uses Pragma VRF

```rs
fn pick_winner(self: @ContractState) -> ContractAddress {}
```

If you want to learn more about randomness, you can visit the [Pragma documentation](https://docs.pragma.build/Resources/Cairo%201/randomness/randomness).

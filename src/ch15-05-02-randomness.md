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
{{#include ../listings/ch99-starknet-smart-contracts/listing_99_15_randomness/src/lib.cairo:here}}
```

### Explanation for Example Functions that uses Pragma VRF

```rs
fn pick_winner(self: @ContractState) -> ContractAddress {}
```

If you want to learn more about randomness, you can visit the [Pragma documentation](https://docs.pragma.build/Resources/Cairo%201/randomness/randomness).

# Randomness

Since all blockchains are fundamentally deterministic and most are public
ledgers, generating truly unpredictatable randomness on-chain presents a
challenge. This randomness is crucial for fair outcomes in gaming, lotteries,
and unique generation of NFTs. To address this, verifiable random functions
(VRFs) provided by oracles offer a solution. VRFs guarantee that the randomness
can't be predicted or tampered with, ensuring trust and transparency in these
applications.

## Overview on VRFs

VRFs use a secret key and a nonce (a unique input) to generate an output that
appears random. While technically 'pseudo-random', it's practically impossible
for another party to predict the outcome without knowing the secret key.

VRFs produce not only the random number but also a proof that anyone can use to
independently verify that the result was generated correctly according to the
function's parameters.

## Generating Randomness with Cartridge VRF

[Cartridge VRF](https://github.com/cartridge-gg/vrf) provides synchronous,
onchain verifiable randomness designed for games on Starknet - although it can
be used for other purposes. It uses a simple flow: a transaction prefixes a
`request_random` call to the VRF provider, then your contract calls
`consume_random` to obtain a verified random value within the same transaction.

### Add Cartridge VRF as a Dependency

Edit your Cairo project's `Scarb.toml` file to include Cartridge VRF.

```toml
[dependencies]
cartridge_vrf = { git = "https://github.com/cartridge-gg/vrf" }
```

### Define the Contract Interface

```cairo,noplayground
{{#include ../listings/ch103-building-advanced-starknet-smart-contracts/listing_06_dice_game_vrf/src/lib.cairo:interfaces}}
```

{{#label cartridge_vrf_interface}} <span class="caption">Listing
{{#ref cartridge_vrf_interface}} shows interfaces for integrating Cartridge VRF
with a simple dice game.</span>

### Cartridge VRF Flow and Key Entrypoints

Cartridge VRF works in a single transaction using two calls:

1. `request_random(caller, source)` — Must be the first call in the
   transaction's multicall. It signals that your contract at `caller` will
   consume a random value using the specified `source`.
2. `consume_random(source)` — Called by your game contract to synchronously
   retrieve the random value. The VRF proof is verified onchain, and the value
   is immediately available for use.

Common `source` choices:

- `Source::Nonce(ContractAddress)` — Uses the provider’s internal nonce for the
  provided address, ensuring a unique random value per request.
- `Source::Salt(felt252)` — Uses a static salt. Using the same salt will return
  the same random value.

## Dice Game Contract

This dice game contract allows players to guess a number between 1 & 6 during an
active game window. The contract owner can toggle the game window to disable new
guesses. To determine the winning number, the contract owner calls
`settle_random`, which consumes a random value from the Cartridge VRF provider
and stores it in `last_random_number`. Each player then calls
`process_game_winners` to determine if they have won or lost. The stored
`last_random_number` is reduced to a number between 1 & 6 and compared to the
player's guess, emitting either `GameWinner` or `GameLost`.

```cairo,noplayground
{{#include ../listings/ch103-building-advanced-starknet-smart-contracts/listing_06_dice_game_vrf/src/lib.cairo:dice_game}}
```

{{#label dice_game_vrf}} <span class="caption">Listing {{#ref dice_game_vrf}}:
Simple Dice Game Contract using Cartridge VRF.</span>

#### Calling Pattern for Cartridge VRF

When you call your `settle_random` entrypoint from an account, prefix the
transaction’s multicall with a call to the VRF provider’s `request_random` using
the same `source` that the contract will pass to `consume_random` (in this
example, `Source::Nonce(<dice_contract>)`). For example:

1. `VRF.request_random(caller: <dice_contract>, source: Source::Nonce(<dice_contract>))`
2. `<dice_contract>.settle_random()`

This ensures the VRF server can submit and verify the proof onchain and that the
random value is available to your contract during execution.

#### Deployments

- Mainnet
  - Class hash:
    https://voyager.online/class/0x00be3edf412dd5982aa102524c0b8a0bcee584c5a627ed1db6a7c36922047257
  - Contract:
    https://voyager.online/contract/0x051fea4450da9d6aee758bdeba88b2f665bcbf549d2c61421aa724e9ac0ced8f
- Sepolia
  - Class hash:
    https://sepolia.voyager.online/class/0x00be3edf412dd5982aa102524c0b8a0bcee584c5a627ed1db6a7c36922047257
  - Contract:
    https://sepolia.voyager.online/contract/0x051fea4450da9d6aee758bdeba88b2f665bcbf549d2c61421aa724e9ac0ced8f

Use the network’s VRF provider address as the `vrf_provider` constructor
argument (or via `set_vrf_provider`) in the example contract.

More details and updates: see the
[Cartridge VRF repository](https://github.com/cartridge-gg/vrf).

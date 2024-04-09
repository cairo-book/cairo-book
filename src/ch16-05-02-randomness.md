# Randomness

Since all blockchains are fundamentally deterministic and most are public ledgers, generating truly unpredictatable randomness on-chain presents a challenge. This randomness is crucial for fair outcomes in gaming, lotteries, and unique generation of NFTs. To address this, verifiable random functions (VRFs) provided by oracles offers a solution. VRFs guarantee that the randomness can't be predicted or tampered with, ensuring trust and transparency in these applications.

## Overview on VRFs

Pseudo-random but secure: VRFs use a secret key and a nonce (a unique input) to generate an output that appears random. While technically 'pseudo-random', it's practically impossible for another party to predict the outcome without knowing the secret key.

Verifiable output: VRFs produce not only the random number but also a proof that anyone can use to independently verify that the result was generated correctly according to the function's parameters.

## Randomness Generated with Pragma

[Pragma](https://www.pragma.build/), an oracle on Starknet provides a solution for generating random numbers using VRFs.

Let's dive into how to use Pragma to create randomness in a Cairo contract.

### Add Pragma as a Dependency

Edit your cairo project's `Scarb.toml` file to include the path to use Pragma.

```toml
[dependencies]
pragma_lib = { git = "https://github.com/astraly-labs/pragma-lib" }
```

### Interface

Listing {{#ref pragma_vrf_interface}} shows a contract interface of an example randomness contract that uses Pragma VRF:

```rust,noplayground
{{#include ../listings/ch16-building-advanced-starknet-smart-contracts/listing_06_pragma_randomness/src/lib.cairo:randomness_interface}}
```

### Description of Entrypoints and their inputs

{{#label pragma_vrf_interface}}
<span class="caption">Listing {{#ref pragma_vrf_interface}}: Simple Randomness Contract Interface.</span>

The function `request_my_randomness` initiates a request for verifiable randomness from the Pragma oracle. It does this by emitting an event that triggers the following actions off-chain:

1. Randomness Generation: The oracle generates random values and a corresponding proof.
2. On-chain Submission: The oracle submits the generated randomness and proof back to the blockchain via the `receive_random_words` callback function.

```rust,noplayground
{{#include ../listings/ch16-building-advanced-starknet-smart-contracts/listing_06_pragma_randomness/src/lib.cairo:request_my_randomness}}
```

<span class="caption">Listing {{#ref request_my_randomness}}: `request_my_randomness` function.</span>

#### `request_my_randomness` Inputs

1. `seed`: A value used to initialize the randomness generation process. This should be unique to ensure unpredictable results.
2. `callback_address`: The contract address where the `receive_random_words` function will be called to deliver the generated randomness. It is typically the address of your deployed contract implementing Pragma VRF.
3. `callback_fee_limit`: The maximum amount of gas you're willing to spend on executing the `receive_random_words` callback function.
4. `publish_delay`: The minimum delay (in blocks) between requesting randomness and the oracle fulfilling the request.
5. `num_words`: The number of random values (each represented as a `felt252`) you want to receive in a single callback.
6. `calldata`: Additional data you want to pass to the `receive_random_words` callback function.

The function `receive_random_words` is a callback triggered by the Pragma Randomness oracle when it has generated the randomness requested by your contract.

```rust,noplayground
{{#include ../listings/ch16-building-advanced-starknet-smart-contracts/listing_06_pragma_randomness/src/lib.cairo:receive_random_words}}
```

<span class="caption">Listing {{#ref receive_random_words}}: `receive_random_word` function.</span>

#### `receive_randomn_words` Inputs

1. `requester_address`: The contract address that initiated the randomness request.
2. `request_id`: A unique identifier assigned to the randomness request.
3. `random_words`:  An array (span) of the generated random values (represented as `felt252`).
4. `calldata`:  Additional data passed along with the initial randomness request.

### Contract Example

Listing {{#ref pragma_vrf_contract}} shows an example randomness contract implementing the previous interface:

```rust,noplayground
{{#include ../listings/ch16-building-advanced-starknet-smart-contracts/listing_06_pragma_randomness/src/lib.cairo:randomness_contract}}
```

{{#label pragma_vrf_contract}}
<span class="caption">Listing {{#ref pragma_vrf_contract}}: Simple Randomness Contract.</span>

#### NB: After Contract is Deployed

After deploying your contract, ensure it holds sufficient ETH to use the Pragma VRF system. Requesting random values incurs costs associated with both the generation process and the execution of your callback function.

For more information, please refer to the [Pragma](https://docs.pragma.build/Resources/Cairo%201/randomness/randomness) docs.

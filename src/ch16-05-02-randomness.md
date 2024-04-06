# Randomness

If we need to generate randomness on the blockchain, it has to be done in a secure manner to ensure that the result cannot be predicted or manipulated. A common way to achieve this is to use verifiable random function ( VRF ) which is typically provided by an oracle.

[Pragma], an oracle on Starknet provides a solution for generating VRFs which is used by most of the top protocols in the ecosystem.

Let's dive into how to use Pragma to create randomness in a Cairo contract.

## Add Pragma as a Dependency to Your `Scarb.toml` file

```toml
[dependencies]
pragma_lib = { git = "https://github.com/astraly-labs/pragma-lib" }
```

## Sample Cairo Contract for Randomness

Listing {{#ref pragma_vrf_interface}} shows a simple interface for an example randomness contract that uses Pragma VRF:

```rust,noplayground
{{#include ../listings/ch16-building-advanced-starknet-smart-contracts/listing_06_pragma_randomness/src/lib.cairo:randomness_interface}}
```

{{#label pragma_vrf_interface}}
<span class="caption">Listing {{#ref pragma_vrf_interface}}: Simple interface for using Pragma VRF</span>

```rust,noplayground
{{#include ../listings/ch16-building-advanced-starknet-smart-contracts/listing_06_pragma_randomness/src/lib.cairo:request_my_randomness}}
```

The function `request_my_randomness` initiates a request for verifiable randomness from the Pragma Oracle. It does this by emitting an event that triggers the following actions off-chain:

1. Randomness Generation: The Oracle generates random values and a corresponding proof.
2. On-chain Submission: The Oracle submits the generated randomness and proof back to the blockchain via the `receive_random_words` callback function.

### `request_my_randomness` Inputs

1. `seed`: A value used to initialize the randomness generation process. This should be unique for each request to ensure unpredictable results.
2. `callback_address`: The contract address where the receive_random_words function will be called to deliver the generated randomness. It is typically the address of your deployed contract implimenting pragma vrf.
3. `callback_fee_limit`: The maximum amount of gas you're willing to spend on executing the receive_random_words callback function.
4. `publish_delay`: The minimum delay (in blocks) between requesting randomness and the Oracle fulfilling the request. This allows time for the Oracle to generate the randomness and proof.
5. `num_words`: The number of random values (each represented as a felt252) you want to receive in a single callback.
6. `calldata`: Additional data you want to pass to the receive_random_words callback function. This could be used for context or to customize the behavior of that function.

Listing {{#ref pragma_vrf_contract}} shows a basic implimentation of a randomness contract using Pragma VRF:

```rust,noplayground
{{#include ../listings/ch16-building-advanced-starknet-smart-contracts/listing_06_pragma_randomness/src/lib.cairo:randomness_contract}}
```

{{#label pragma_vrf_contract}}
<span class="caption">Listing {{#ref pragma_vrf_contract}}: Simple Randomness Contract</span>

### NB: After Contract is Deployed

Once contract is deployed, you need to send enough ETH to the deployed contract address required to cover gas cost of callback function and cost of generating randomness.

For more information, refer to the [Pragma](https://docs.pragma.build/Resources/Cairo%201/randomness/randomness) docs.

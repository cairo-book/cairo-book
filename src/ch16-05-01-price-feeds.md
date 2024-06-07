# Price Feeds

Price feeds enabled by an oracle serves as a bridge between real-world data feed and the blockchain. It provide real time pricing data that is aggregated from multiple trusted external sources ( e.g. crypto exchanges or financial data providers ) to the blockchain network.

For the example in this section we are going to use Pragma Oracle.

[Pragma](https://www.pragma.build/), an oracle on Starknet provides a solution for generating random numbers using VRFs.
Let's dive into how to use Pragma VRF to generate a random number in a simple dice game contract.

## Add Pragma as a Dependency

Edit your cairo project's `Scarb.toml` file to include the path to use Pragma.

```toml
[dependencies]
pragma_lib = { git = "https://github.com/astraly-labs/pragma-lib" }
```

## Interacting with Price Feed on Starknet using Pragma Oracle

To interact with the pragma oracle and use its data feed to generate price feed in your contract, you will need to define your contract interface ad add the require function to call price feed, import the rquired dependencies and impliment the required function neccessary for interacting with the price feed in your contract implimentation.

## Function Interface

```rust,noplayground
{{#include ../listings/ch16-building-advanced-starknet-smart-contracts/listing_08_price_feed/src/lib.cairo:price_interface}}
```

Of the two public functions exposed in the above contract interface, the one neccessary to interact with the pragma price feed oracle is `get_asset_price` function, which is a read function that takes in the `asset_id` argument.

### Pragma Dependency Import to Contract

```rust,noplayground
{{#include ../listings/ch16-building-advanced-starknet-smart-contracts/listing_08_price_feed/src/lib.cairo:pragma_lib}}
```

The above example shows the neccessary import to inteact with the Pragma oracle.

### Required Price Feed Function Implimentation in Contract

```rust,noplayground
{{#include ../listings/ch16-building-advanced-starknet-smart-contracts/listing_08_price_feed/src/lib.cairo:price_feed_impl}}
```

The function in the example above uses retrives the pragma oracle dispatcher and calls the pragma oracle for a spot entry.

## Example Application Using Pragma Price Feed

```rust,noplayground
{{#include ../listings/ch16-building-advanced-starknet-smart-contracts/listing_08_price_feed/src/lib.cairo:here}}
```

You can get a detail guide on consuming data using Pragma price feeds [here](https://docs.pragma.build/Resources/Cairo%201/data-feeds/consuming-data).

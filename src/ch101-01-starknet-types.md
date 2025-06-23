# Starknet Types

When building smart contracts on Starknet, you'll work with specialized types that represent blockchain-specific concepts. These types allow you to interact with deployed contracts through their addresses, handle cross-chain communication, and handle contract-specific data types. This chapter introduces the Starknet-specific types provided by the Core library.

## Contract Address

The `ContractAddress` type represents the address of a deployed contract on Starknet. Every deployed contract has a unique address that identifies it on the network. You'll use it to call other contracts, check caller identities, manage access control, and anything that involves on-chain accounts.

```cairo
{{#include ../listings/ch101-building-starknet-smart-contracts/listing_starknet_types/src/lib.cairo:contract_address}}
```

Contract addresses in Starknet have a value range of `[0, 2^251)`, which is enforced by the type system. You can create a `ContractAddress` from a `felt252` using the regular `TryInto` trait.

## Storage Address

The `StorageAddress` type represents the location of a value within a contract's storage. While you typically won't create these addresses directly (the storage system handles this for you through types like [Map](./ch101-02-01-storage-mappings.md) and [Vec](./ch101-02-02-storage-vecs.md)), understanding this type is important for advanced storage patterns. Each value stored in the `Storage` struct has its own `StorageAddress`, and can be accessed directly following the rules defined in the [Storage](./ch101-01-00-contract-storage.md) chapter.

```cairo
{{#include ../listings/ch101-building-starknet-smart-contracts/listing_starknet_types/src/lib.cairo:storage_address}}
```

Storage addresses share the same value range as contract addresses `[0, 2^251)`. The related `StorageBaseAddress` type represents base addresses that can be combined with offsets, with a slightly smaller range of `[0, 2^251 - 256)` to accommodate offset calculations.

## Ethereum Address

The `EthAddress` type represents a 20-byte Ethereum address and is used mostly for building cross-chain applications on Starknet. This type is used in L1-L2 messaging, token bridges, and any contract that needs to interact with Ethereum.

```cairo
{{#include ../listings/ch101-building-starknet-smart-contracts/listing_starknet_types/src/lib.cairo:eth_address}}
```

This example shows the key uses of `EthAddress`:

- Storing L1 contract addresses
- Sending messages to Ethereum using `send_message_to_l1_syscall`
- Receiving and validating messages from L1 with `#[l1_handler]`

The `EthAddress` type ensures type safety and can be converted to/from `felt252` for L1-L2 message serialization.

## Class Hash

The `ClassHash` type represents the hash of a contract class (the contract's code). In Starknet's architecture, contract classes are deployed separately from contract instances, allowing multiple contracts to share the same code. As such, you can use the same class hash to deploy multiple contracts, or to upgrade a contract to a new version.

```cairo
{{#include ../listings/ch101-building-starknet-smart-contracts/listing_starknet_types/src/lib.cairo:class_hash}}
```

Class hashes have the same value range as addresses `[0, 2^251)`. They uniquely identify a specific version of contract code and are used in deployment operations, proxy patterns, and upgrade mechanisms.

## Working with Block and Transaction Information

Starknet provides several functions to access information about the current execution context. These functions return specialized types or structures containing blockchain state information.

```cairo
{{#include ../listings/ch101-building-starknet-smart-contracts/listing_starknet_types/src/lib.cairo:block_tx_info}}
```

The `BlockInfo` structure contains details about the current block, including its number and timestamp. The `TxInfo` structure provides transaction-specific information, including the sender's address, transaction hash, and fee details.

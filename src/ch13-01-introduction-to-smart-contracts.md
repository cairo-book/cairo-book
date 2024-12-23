---
meta: "Explore the fundamentals of smart contracts in this comprehensive introduction, tailored for developers using Cairo. Learn how smart contracts work and their role in blockchain technology."
---

# Introduction to Smart Contracts

This chapter will give you a high level introduction to what smart contracts are, what they are used for, and why blockchain developers would use Cairo and Starknet.
If you are already familiar with blockchain programming, feel free to skip this chapter. The last part might still be interesting though.

## Smart Contracts - Introduction

Smart contracts gained popularity and became more widespread with the birth of Ethereum. Smart contracts are essentially programs deployed on a blockchain. The term "smart contract" is somewhat misleading, as they are neither "smart" nor "contracts" but rather code and instructions that are executed based on specific inputs. They primarily consist of two components: storage and functions. Once deployed, users can interact with smart contracts by initiating blockchain transactions containing execution data (which function to call and with what input). Smart contracts can modify and read the storage of the underlying blockchain. A smart contract has its own address and is considered a blockchain account, meaning it can hold tokens.

The programming language used to write smart contracts varies depending on the blockchain. For example, on Ethereum and the [EVM-compatible ecosystem][evm], the most commonly used language is Solidity, while on Starknet, it is Cairo. The way the code is compiled also differs based on the blockchain. On Ethereum, Solidity is compiled into bytecode. On Starknet, Cairo is compiled into Sierra and then into Cairo Assembly (CASM).

Smart contracts possess several unique characteristics. They are **permissionless**, meaning anyone can deploy a smart contract on the network (within the context of a decentralized blockchain, of course). Smart contracts are also **transparent**; the data stored by the smart contract is accessible to anyone. The code that composes the contract can also be transparent, enabling **composability**. This allows developers to write smart contracts that use other smart contracts. Smart contracts can only access and interact with data from the blockchain they are deployed on. They require third-party software (called _oracles_) to access external data (the price of a token for instance).

For developers to build smart contracts that can interact with each other, it is required to know what the other contracts look like. Hence, Ethereum developers started to build standards for smart contract development, the `ERCxx`. The two most used and famous standards are the `ERC20`, used to build tokens like `USDC`, `DAI` or `STARK`, and the `ERC721`, for NFTs (Non-Fungible Tokens) like `CryptoPunks` or `Everai`.

[evm]: https://ethereum.org/en/developers/docs/evm/

## Smart Contracts - Use Cases

There are many possible use cases for smart contracts. The only limits are the technical constraints of the blockchain and the creativity of developers.

### DeFi

For now, the principal use case for smart contracts is similar to that of Ethereum or Bitcoin, which is essentially handling money. In the context of the alternative payment system promised by Bitcoin, smart contracts on Ethereum enable the creation of decentralized financial applications that no longer rely on traditional financial intermediaries. This is what we call DeFi (decentralized finance). DeFi consists of various projects such as lending/borrowing applications, decentralized exchanges (DEX), on-chain derivatives, stablecoins, decentralized hedge funds, insurance, and many more.

### Tokenization

Smart contracts can facilitate the tokenization of real-world assets, such as real estate, art, or precious metals. Tokenization divides an asset into digital tokens, which can be easily traded and managed on blockchain platforms. This can increase liquidity, enable fractional ownership, and simplify the buying and selling process.

### Voting

Smart contracts can be used to create secure and transparent voting systems. Votes can be recorded on the blockchain, ensuring immutability and transparency. The smart contract can then automatically tally the votes and declare the results, minimizing the potential for fraud or manipulation.

### Royalties

Smart contracts can automate royalty payments for artists, musicians, and other content creators. When a piece of content is consumed or sold, the smart contract can automatically calculate and distribute the royalties to the rightful owners, ensuring fair compensation and reducing the need for intermediaries.

### Decentralized Identities DIDs

Smart contracts can be used to create and manage digital identities, allowing individuals to control their personal information and share it with third parties securely. The smart contract could verify the authenticity of a user's identity and automatically grant or revoke access to specific services based on the user's credentials.

<br/>
<br/>
As Ethereum continues to mature, we can expect the use cases and applications of smart contracts to expand further, bringing about exciting new opportunities and reshaping traditional systems for the better.

## The Rise of Starknet and Cairo

Ethereum, being the most widely used and resilient smart contract platform, became a victim of its own success. With the rapid adoption of some previously mentioned use cases, mainly DeFi, the cost of performing transactions became extremely high, rendering the network almost unusable. Engineers and researchers in the ecosystem began working on solutions to address this scalability issue.

A famous trilemma called The Blockchain Trilemma in the blockchain space states that it is hard to achieve a high level of scalability, decentralization, and security simultaneously; trade-offs must be made. Ethereum is at the intersection of decentralization and security. Eventually, it was decided that Ethereum's purpose would be to serve as a secure settlement layer, while complex computations would be offloaded to other networks built on top of Ethereum. These are called Layer 2s (L2s).

The two primary types of L2s are optimistic rollups and validity rollups. Both approaches involve compressing and batching numerous transactions together, computing the new state, and settling the result on Ethereum (L1). The difference lies in the way the result is settled on L1. For optimistic rollups, the new state is considered valid by default, but there is a 7-day window for nodes to identify malicious transactions.

In contrast, validity rollups, such as Starknet, use cryptography to prove that the new state has been correctly computed. This is the purpose of STARKs, this cryptographic technology could permit validity rollups to scale significantly more than optimistic rollups. You can learn more about STARKs from Starkware's Medium [article][starks article], which serves as a good primer.

> Starknet's architecture is thoroughly described in the [Starknet documentation](https://docs.starknet.io/documentation/architecture_and_concepts/), which is a great resource to learn more about the Starknet network.

Remember Cairo? It is, in fact, a language developed specifically to work with STARKs and make them general-purpose. With Cairo, we can write **provable code**. In the context of Starknet, this allows proving the correctness of computations from one state to another.

Unlike most (if not all) of Starknet's competitors that chose to use the EVM (either as-is or adapted) as a base layer, Starknet employs its own VM. This frees developers from the constraints of the EVM, opening up a broader range of possibilities. Coupled with decreased transaction costs, the combination of Starknet and Cairo creates an exciting playground for developers. Native account abstraction enables more complex logic for accounts, that we call "Smart Accounts", and transaction flows. Emerging use cases include **transparent AI** and machine learning applications. Finally, **blockchain games** can be developed entirely **on-chain**. Starknet has been specifically designed to maximize the capabilities of STARK proofs for optimal scalability.

> Learn more about Account Abstraction in the [Starknet documentation](https://docs.starknet.io/documentation/architecture_and_concepts/Account_Abstraction/introduction/).

[starks article]: https://medium.com/starkware/starks-starkex-and-starknet-9a426680745a

## Cairo Programs and Starknet Smart Contracts: What Is the Difference?

Starknet contracts are a special superset of Cairo programs, so the concepts previously learned in this book are still applicable to write Starknet contracts.
As you may have already noticed, a Cairo program must always have a `main` function that serves as the entry point for this program:

```cairo
fn main() {}
```

Contracts deployed on the Starknet network are essentially programs that are run by the sequencer, and as such, have access to Starknet's state. Contracts do not have a `main` function but one or multiple functions that can serve as entry points.

Starknet contracts are defined within [modules][module chapter]. For a module to be handled as a contract by the compiler, it must be annotated with the `#[starknet::contract]` attribute.

[module chapter]: ./ch07-02-defining-modules-to-control-scope.md

## Anatomy of a Simple Contract

This chapter will introduce you to the basics of Starknet contracts using a very simple smart contract as example. You will learn how to write a contract that allows anyone to store a single number on the Starknet blockchain.

Let's consider the following contract for the whole chapter. It might not be easy to understand it all at once, but we will go through it step by step:

```cairo,noplayground
{{#include ../listings/ch13-introduction-to-starknet-smart-contracts/listing_01_simple_contract/src/lib.cairo:all}}
```

{{#label simple-contract}}
<span class="caption">Listing {{#ref simple-contract}}: A simple storage contract</span>

### What Is this Contract?

Contracts are defined by encapsulating state and logic within a module annotated with the `#[starknet::contract]` attribute.

The state is defined within the `Storage` struct, and is always initialized empty. Here, our struct contains a single field called `stored_data` of type `u128` (unsigned integer of 128 bits), indicating that our contract can store any number between 0 and \\( {2^{128}} - 1 \\).

The logic is defined by functions that interact with the state. Here, our contract defines and publicly exposes the functions `set` and `get` that can be used to modify or retrieve the value of the stored variable.
You can think of it as a single slot in a database that you can query and modify by calling functions of the code that manages the database.

### The Interface: the Contract's Blueprint

```cairo,noplayground
{{#include ../listings/ch13-introduction-to-starknet-smart-contracts/listing_01_simple_contract/src/lib.cairo:interface}}
```

{{#label interface}}
<span class="caption">Listing {{#ref interface}}: A basic contract interface</span>

Interfaces represent the blueprint of the contract. They define the functions that the contract exposes to the outside world, without including the function body. In Cairo, they're defined by annotating a trait with the `#[starknet::interface]` attribute. All functions of the trait are considered public functions of any contract that implements this trait, and are callable from the outside world.

> The contract constructor is not part of the interface. Nor are internal functions.

All contract interfaces use a generic type for the `self` parameter, representing the contract state. We chose to name this generic parameter `TContractState` in our interface, but this is not enforced and any name can be chosen.

In our interface, note the generic type `TContractState` of the `self` argument which is passed by reference to the `set` function. Seeing the `self` argument passed in a contract function tells us that this function can access the state of the contract. The `ref` modifier implies that `self` may be modified, meaning that the storage variables of the contract may be modified inside the `set` function.

On the other hand, the `get` function takes a snapshot of `TContractState`, which immediately tells us that it does not modify the state (and indeed, the compiler will complain if we try to modify storage inside the `get` function).

By leveraging the [traits & impls](./ch08-02-traits-in-cairo.md) mechanism from Cairo, we can make sure that the actual implementation of the contract matches its interface. In fact, you will get a compilation error if your contract doesn’t conform with the declared interface. For example, Listing {{#ref wrong-impl}} shows a wrong implementation of the `ISimpleStorage` interface, containing a slightly different `set` function that doesn't have the same signature.

```cairo,noplayground
{{#include ../listings/ch13-introduction-to-starknet-smart-contracts/listing_02_wrong_impl/src/lib.cairo:impl}}
```

{{#label wrong-impl}}
<span class="caption">Listing {{#ref wrong-impl}}: A wrong implementation of the interface of the contract. This does not compile, as the signature of `set` doesn't match the trait's.</span>

Trying to compile a contract using this implementation will result in the following error:

```shell
{{#include ../listings/ch13-introduction-to-starknet-smart-contracts/listing_02_wrong_impl/output.txt}}
```

### Public Functions Defined in an Implementation Block

Before we explore things further down, let's define some terminology.

- In the context of Starknet, a _public function_ is a function that is exposed to the outside world. A public function can be called by anyone, either from outside the contract or from within the contract itself. In the example above, `set` and `get` are public functions.

- What we call an _external_ function is a public function that can be directly invoked through a Starknet transaction and that can mutate the state of the contract. `set` is an external function.

- A _view_ function is a public function that is typically read-only and cannot mutate the state of the contract. However, this limitation is only enforced by the compiler, and not by Starknet itself. We will discuss the implications of this in a later section. `get` is a view function.

```cairo,noplayground
{{#include ../listings/ch13-introduction-to-starknet-smart-contracts/listing_01_simple_contract/src/lib.cairo:impl}}
```

{{#label implementation}}
<span class="caption">Listing {{#ref implementation}}: `SimpleStorage` implementation</span>

Since the contract interface is defined as the `ISimpleStorage` trait, in order to match the interface, the public functions of the contract must be defined in an implementation of this trait — which allows us to make sure that the implementation of the contract matches its interface.

However, simply defining the functions in the implementation block is not enough. The implementation block must be annotated with the `#[abi(embed_v0)]` attribute. This attribute exposes the functions defined in this implementation to the outside world — forget to add it and your functions will not be callable from the outside. All functions defined in a block marked as `#[abi(embed_v0)]` are consequently _public functions_.

Because the `SimpleStorage` contract is defined as a module, we need to access the interface defined in the parent module. We can either bring it to the current scope with the `use` keyword, or refer to it directly using `super`.

When writing the implementation of an interface, the `self` parameter in the trait methods **must** be of type `ContractState`. The `ContractState` type is generated by the compiler, and gives access to the storage variables defined in the `Storage` struct.
Additionally, `ContractState` gives us the ability to emit events. The name `ContractState` is not surprising, as it’s a representation of the contract’s state, which is what we think of `self` in the contract interface trait.
When `self` is a snapshot of `ContractState`, only read access is allowed, and emitting events is not possible.

### Accessing and Modifying the Contract's State

Two methods are commonly used to access or modify the state of a contract:

- `read`, which returns the value of a storage variable. This method is called on the variable itself and does not take any argument.

```cairo,noplayground
{{#include ../listings/ch13-introduction-to-starknet-smart-contracts/listing_01_simple_contract/src/lib.cairo:read_state}}
```

- `write`, which allows to write a new value in a storage slot. This method is also called on the variable itself and takes one argument, which is the value to be written. Note that `write` may take more than one argument, depending on the type of the storage variable. For example, writing on a mapping requires 2 arguments: the key and the value to be written.

```cairo,noplayground
{{#include ../listings/ch13-introduction-to-starknet-smart-contracts/listing_01_simple_contract/src/lib.cairo:write_state}}
```

> Reminder: if the contract state is passed as a snapshot with `@` instead of passed by reference with `ref`, attempting to modify the contract state will result in a compilation error.

This contract does not do much apart from allowing anyone to store a single number that is accessible by anyone in the world. Anyone could call `set` again with a different value and overwrite the current number. Nevertheless, each value stored in the storage of the contract will still be stored in the history of the blockchain. Later in this book, you will see how you can impose access restrictions so that only you can alter the number.

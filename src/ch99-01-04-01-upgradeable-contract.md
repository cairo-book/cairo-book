# Upgradeable Contract

Various blockchain networks have devised several approaches to enable contract upgradability, with the proxy patterns being among the most commonly embraced solutions.

**Starknet**, on the other hand, implements **native upgradability** via a [system call](https://docs.starknet.io/documentation/architecture_and_concepts/Smart_Contracts/system-calls-cairo1/) that directly updates the contract source code, eliminating the necessity for proxies.

> Note: Upgrades are delicate procedures where security should be a top priority. It's crucial to thoroughly review the changes and their potential impacts before proceeding with an upgrade.

## Replacing contract class hash

Understanding the distinction between a **contract** and its [**contract class**](https://docs.starknet.io/documentation/architecture_and_concepts/Smart_Contracts/contract-classes/) is key to grasping how upgradeability functions in Starknet.

Contract classes embody the source code of a program. Each contract is linked to a class, and multiple contracts can be instances of the same class. Classes are typically identified by a [**class hash**](https://docs.starknet.io/documentation/architecture_and_concepts/Smart_Contracts/class-hash/), and prior to deploying a contract from a class, the **class hash** must be declared.

## Replace class syscall

The [replace_class syscall](https://docs.starknet.io/documentation/architecture_and_concepts/Smart_Contracts/system-calls-cairo1/#replace_class) allows a contract to update its source code by replacing its class hash once deployed.

```rust,noplayground
{{#include ../listings/ch99-starknet-smart-contracts/listing_99_12_replace_class_syscall/src/lib.cairo}}
```
<span class="caption">Upgradeable syscall code</span>

## Upgradeable component

**OpenZeppelin Contracts** for Cairo provides **`Upgradeable`** to add upgradeability support to your contracts.

Check [OpenZeppelin docs API reference](https://docs.openzeppelin.com/contracts-cairo/0.9.0/api/upgrades). 

```rust,noplayground
{{#include ../listings/ch99-starknet-smart-contracts/listing_99_12_upgradeable_contract_example/src/lib.cairo}}
```
<span class="caption">Upgradeable OZ component usage </span>

## Proxies in Starknet

In the case of contract upgrades, it is achieved by simply changing the contract’s class hash. As of clones, contracts already are like clones of the class they implement.

Implementing a proxy pattern in Starknet has an important limitation: there is no fallback mechanism to be used for redirecting every potential function call to the implementation. This means that a generic proxy contract can’t be implemented. Instead, a limited proxy contract can implement specific functions that forward their execution to another contract class. This can still be useful for example to upgrade the logic of some functions.

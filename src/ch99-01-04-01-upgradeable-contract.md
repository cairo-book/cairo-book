# Upgradeable Contract

The concept of upgradeable contracts is **natively supported** by Starknet through the [system call](https://docs.starknet.io/documentation/architecture_and_concepts/Smart_Contracts/system-calls-cairo1/) `replace_class`, which gives us the possibility to upgrade interfaces, storage variables and implementations of our contract in a dynamic and flexible way. 

In order to upgrade our contract we can expose a function as shown below, note that if you do it this way, anyone will be able to access it.

## Replacing contract class hash

Understanding the distinction between a **contract** and its **contract class** is key to grasping how upgradeability functions in Starknet.

Contract classes embody the source code of a program. Each contract is linked to a class, and multiple contracts can be instances of the same class. Classes are typically identified by a [**class hash**](https://docs.starknet.io/documentation/architecture_and_concepts/Smart_Contracts/class-hash/), and prior to deploying a contract from a class, the **class hash** must be declared.

## Replace class syscall

The [replace_class_syscall](https://docs.starknet.io/documentation/architecture_and_concepts/Smart_Contracts/system-calls-cairo1/#replace_class) allows a contract to update its source code by replacing its class hash once deployed.

```rust,noplayground
{{#include ../listings/ch99-starknet-smart-contracts/listing_99_12_replace_class_syscall/src/lib.cairo}}
```
<span class="caption">Upgradeable syscall code</span>

> Note: Upgrades are delicate procedures where security should be a top priority. It's crucial to thoroughly review the changes and their potential impacts before proceeding with an upgrade.

## Upgradeable component

**OpenZeppelin Contracts** for Cairo provides **`Upgradeable`** to add upgradeability support to your contracts.

Check [OpenZeppelin docs API reference](https://docs.openzeppelin.com/contracts-cairo/0.9.0/api/upgrades). 

```rust,noplayground
{{#include ../listings/ch99-starknet-smart-contracts/listing_99_12_upgradeable_contract_example/src/lib.cairo}}
```
<span class="caption">Upgradeable OZ component usage </span>

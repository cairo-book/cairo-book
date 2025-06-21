# Upgradeable Contracts

Starknet has native upgradeability through a syscall that updates the contract source code, removing the need for proxies.

> **⚠️ WARNING**
> Make sure you follow the security recommendations before upgrading.

## How Upgradeability Works in Starknet

To better comprehend how upgradeability works in Starknet, it's important to understand the difference between a contract and its contract class.

[Contract Classes][class hash doc] represent the source code of a program. All contracts are associated to a class, and many contracts can be instances of the same one. Classes are usually represented by a [class hash][class hash doc], and before a contract of a class can be deployed, the class hash needs to be declared.

A contract instance is a deployed contract corresponding to a class, with its own storage.

[class hash doc]: https://docs.starknet.io/documentation/architecture_and_concepts/Smart_Contracts/class-hash
[syscalls doc]: https://docs.starknet.io/documentation/architecture_and_concepts/Smart_Contracts/system-calls-cairo1/

## Replacing Contract Classes

### The `replace_class_syscall`

The `replace_class` [syscall][syscalls doc] allows a contract to update its source code by replacing its class hash once deployed.

To upgrade a contract, expose an entry point that executes `replace_class_syscall` with the new class hash as an argument:

```cairo,noplayground
{{#include ../listings/ch103-building-advanced-starknet-smart-contracts/listing_06_upgrade_with_syscall/src/lib.cairo}}
```

{{#label replace-class}}
<span class="caption">Listing {{#ref replace-class}}: Exposing `replace_class_syscall` to update the contract's class</span>

> **📌 Note**: If a contract is deployed without this mechanism, its class hash can still be replaced through [library calls](https://docs.starknet.io/documentation/architecture_and_concepts/Smart_Contracts/system-calls-cairo1/#library_call).

> **⚠️ WARNING**: Thoroughly review changes and potential impacts before upgrading, as it's a delicate procedure with security implications. Don't allow arbitrary addresses to upgrade your contract.

## OpenZeppelin's Upgradeable Component

OpenZeppelin Contracts for Cairo provides the `Upgradeable` component that can be embedded into your contract to make it upgradeable. This component is a simple way to add upgradeability to your contract while relying on an audited library.

### Usage

Upgrades are often very sensitive operations, and some form of access control is usually required to avoid unauthorized upgrades. The `Ownable` component is used in this example to restrict the upgradeability to a single address, so that the contract owner has the exclusive right to upgrade the contract.

```cairo,noplayground
{{#include ../listings/ch103-building-advanced-starknet-smart-contracts/listing_07_oz_upgrade/src/lib.cairo}}
```

{{#label upgradeable-contract}}
<span class="caption">Listing {{#ref upgradeable-contract}} Integrating OpenZeppelin's Upgradeable component in a contract</span>

The `UpgradeableComponent` provides:

- An internal `upgrade` function that safely performs the class replacement
- An `Upgraded` event emitted when the upgrade is successful
- Protection against upgrading to a zero class hash

For more information, please refer to the [OpenZeppelin docs API reference][oz upgradeability api].

## Security Considerations

Upgrades can be very sensitive operations, and security should always be top of mind while performing one. Please make sure you thoroughly review the changes and their consequences before upgrading. Some aspects to consider are:

- **API changes** that might affect integration. For example, changing an external function's arguments might break existing contracts or offchain systems calling your contract.
- **Storage changes** that might result in lost data (e.g. changing a storage slot name, making existing storage inaccessible), or data corruption (e.g. changing a storage slot type, or the organization of a struct stored in storage).
- **Storage collisions** (e.g. mistakenly reusing the same storage slot from another component) are also possible, although less likely if best practices are followed, for example prepending storage variables with the component's name.
- Always check for backwards compatibility before upgrading between versions of OpenZeppelin Contracts.

[oz upgradeability api]: https://docs.openzeppelin.com/contracts-cairo/2.0.0/api/upgrades

# Working with ERC20 Tokens

The ERC20 standard on Starknet provides a uniform interface for fungible tokens.
This ensures that any fungible token can be used in a predictable way across the
ecosystem. This section explores how to create ERC20 tokens using OpenZeppelin
Contracts for Cairo, which is an audited implementation of the standard.

> Note: While the Openzeppelin components are audited, you should always test
> and ensure that your code cannot be exploited. Examples provided in this
> section are for educational purposes only and cannot be used in production.

First, we will build a basic ERC20 token with a fixed supply. This contract
demonstrates the core structure for creating a token using OpenZeppelin's
components.

## The Basic ERC20 Contract

```cairo,noplayground
{{#include ../listings/ch103-building-advanced-starknet-smart-contracts/listing_09_basic_erc20/src/lib.cairo}}
```

{{#label basic-erc20}} <span class="caption">Listing {{#ref basic-erc20}}: A
basic ERC20 token implementation using OpenZeppelin</span>

### Understanding the Implementation

This contract is built using OpenZeppelin's component system. It embeds the
`ERC20Component`, which contains all the core logic for an ERC20 token,
including functions for transfers, approvals, and balance tracking. To make
these functions directly available on the contract, we implement the
`ERC20MixinImpl` trait. This pattern avoids the need to write boilerplate code
for each function in the ERC20 interface.

When the contract is deployed, its constructor is called. The constructor first
initializes the token's metadata—its name and symbol—by calling the
`initializer` function on the ERC20 component. It then mints the entire initial
supply and assigns it to the address that deployed the contract. Since there are
no other functions to create new tokens, the total supply is fixed from the
moment of deployment.

The contract's storage is minimal, and only contains the state of the
`ERC20Component`. This includes mappings to track token balances and allowances,
as well as the token's name, symbol, and total supply, but is abstracted from
the perspective of the contract.

The contract we just implemented is rather simple: it is a fixed-supply token,
with no additional features. But we can also use the OpenZeppelin components
libraries to build more complex tokens!

The following examples show how to add new functionalities while maintaining
compliance with the ERC20 standard.

### Mintable and Burnable Token

This extension adds functions to mint new tokens and burn existing ones,
allowing the token supply to change after deployment. This is useful for tokens
whose supply needs to be adjusted based on protocol activity or governance.

```cairo,noplayground
{{#include ../listings/ch103-building-advanced-starknet-smart-contracts/listing_10_mintable_burnable_erc20/src/lib.cairo}}
```

{{#label mintable-burnable-erc20}} <span class="caption">Listing
{{#ref mintable-burnable-erc20}}: ERC20 with mint and burn capabilities</span>

This contract introduces the `OwnableComponent` to manage access control. The
address that deploys the contract becomes its owner. The `mint` function is
restricted to the owner, who can create new tokens and assign them to any
address, thereby increasing the total supply.

The `burn` function allows any token holder to destroy their own tokens. This
action permanently removes the tokens from circulation and reduces the total
supply.

To make these functions exposed to the public, we simply mark them as
`#[external]` in the contract. They become part of the contract's entrypoint,
and anyone can call them.

### Pausable Token with Access Control

This second extension introduces a more complex security model with role-based
permissions and an emergency pause feature. This pattern is useful for protocols
that need fine-grained control over operations and a way to halt activities
during a crisis (e.g. a security incident).

```cairo,noplayground
{{#include ../listings/ch103-building-advanced-starknet-smart-contracts/listing_11_pausable_erc20/src/lib.cairo}}
```

{{#label pausable-erc20}} <span class="caption">Listing {{#ref pausable-erc20}}:
ERC20 with pausable transfers and role-based access control</span>

This implementation combines four components: `ERC20Component` for token
functions, `AccessControlComponent` for managing roles, `PausableComponent` for
the emergency stop mechanism, and `SRC5Component` for interface detection. The
contract defines two roles: `PAUSER_ROLE`, which can pause and unpause the
contract, and `MINTER_ROLE`, which can create new tokens.

Unlike a single owner, this role-based system allows for the separation of
administrative duties. The main administrator can grant the `PAUSER_ROLE` to a
security team and the `MINTER_ROLE` to a treasury manager.

The pause functionality is integrated into the token's transfer logic using a
hook system. The contract implements the `ERC20HooksTrait`, and its
`before_update` function is automatically called before any token transfer or
approval. This function checks if the contract is paused. If an address with the
`PAUSER_ROLE` has paused the contract, all transfers are blocked until it is
unpaused. This hook system is an elegant way of extending the base
functionalities of the ERC20 standard functions, without re-defining them.

At deployment, the constructor grants all roles to the deployer, who can then
delegate these roles to other addresses as needed.

These extended implementations show how OpenZeppelin's components can be
combined to build complex and secure contracts. By starting with standard,
audited components, developers can add custom features without compromising on
security or standards compliance.

For more advanced features and detailed documentation, refer to the
[OpenZeppelin Contracts for Cairo documentation](https://docs.openzeppelin.com/contracts-cairo/).

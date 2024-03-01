# The Cairo Book

[The Cairo Book](title-page.md)
[Foreword](ch00-01-foreword.md)
[Introduction](ch00-00-introduction.md)

# The Cairo Programming Language

## Getting Started

- [Getting Started](ch01-00-getting-started.md)

  - [Installation](ch01-01-installation.md)
  - [Hello, World!](ch01-02-hello-world.md)

## Common Programming Concepts

- [Common Programming Concepts](ch02-00-common-programming-concepts.md)
  - [Variables and Mutability](ch02-01-variables-and-mutability.md)
  - [Data Types](ch02-02-data-types.md)
  - [Functions](ch02-03-functions.md)
  - [Comments](ch02-04-comments.md)
  - [Control Flow](ch02-05-control-flow.md)

## Common Collections

- [Common Collections](ch03-00-common-collections.md)
  - [Arrays](ch03-01-arrays.md)
  - [Dictionaries](ch03-02-dictionaries.md)

## Understanding Ownership

- [Understanding Ownership](ch04-00-understanding-ownership.md)
  - [What is Ownership?](ch04-01-what-is-ownership.md)
  - [References and Snapshots](ch04-02-references-and-snapshots.md)

## Using Structs to Structure Related Data

- [Using Structs to Structure Related Data](ch05-00-using-structs-to-structure-related-data.md)
  - [Defining and Instantiating Structs](ch05-01-defining-and-instantiating-structs.md)
  - [An Example Program Using Structs](ch05-02-an-example-program-using-structs.md)
  - [Method Syntax](ch05-03-method-syntax.md)

## Enums and Pattern Matching

- [Enums and Pattern Matching](ch06-00-enums-and-pattern-matching.md)
  - [Enums](ch06-01-enums.md)
  - [The Match Control Flow Construct](ch06-02-the-match-control-flow-construct.md)

## Managing Cairo Projects with Packages, Crates and Modules

- [Managing Cairo Projects with Packages, Crates and Modules](ch07-00-managing-cairo-projects-with-packages-crates-and-modules.md)

  - [Packages and Crates](ch07-01-packages-and-crates.md)
  - [Defining Modules to Control Scope](ch07-02-defining-modules-to-control-scope.md)
  - [Paths for Referring to an Item in the Module Tree](ch07-03-paths-for-referring-to-an-item-in-the-module-tree.md)
  - [Bringing Paths into Scope with the 'use' Keyword](ch07-04-bringing-paths-into-scope-with-the-use-keyword.md)
  - [Separating Modules into Different Files](ch07-05-separating-modules-into-different-files.md)

## Generic Data Types

- [Generic Types and Traits](ch08-00-generic-types-and-traits.md)

  - [Generic Data Types](ch08-01-generic-data-types.md)
  - [Traits in Cairo](ch08-02-traits-in-cairo.md)

## Error Handling

- [Error Handling](ch09-00-error-handling.md)

  - [Unrecoverable Errors with panic](ch09-01-unrecoverable-errors-with-panic.md)
  - [Recoverable Errors with Result](ch09-02-recoverable-errors.md)

## Testing Cairo Programs

- [Testing Cairo Programs](ch10-00-testing-cairo-programs.md)

  - [How To Write Tests](ch10-01-how-to-write-tests.md)
  - [Testing Organization](ch10-02-test-organization.md)

## Advanced Cairo Features

- [Advanced Cairo Features](ch11-00-advanced-features.md)

  - [Custom Data Structures](ch11-01-custom-data-structures.md)
  - [Using Arrays inside Dictionaries]()
  - [Smart Pointers]()
  - [Operator Overloading](ch11-04-operator-overloading.md)
  - [Working with Hashes](ch11-05-hash.md)
  - [Macros](ch11-06-macros.md)
  - [Inlining in Cairo]()
  - [Gas optimisation]()
  - [Printing](ch11-09-printing.md)

- [Appendix](appendix-00.md)

  - [A - Keywords](appendix-01-keywords.md)
  - [B - Operators and Symbols](appendix-02-operators-and-symbols.md)
  - [C - Derivable Traits](appendix-03-derivable-traits.md)
  - [D - Common Types & Traits and the Cairo Prelude](appendix-04-common-types-and-traits-and-cairo-prelude.md)
  - [E - Useful Development Tools](appendix-05-useful-development-tools.md)
  - [F - Installing Cairo binaries](appendix-06-cairo-binaries.md)

---

# Smart Contracts in Cairo

## Introduction to Starknet Smart Contracts

- [Introduction to Starknet Smart Contracts](./ch12-00-introduction-to-starknet-smart-contracts.md)

  - [General Introduction to Smart Contracts](./ch12-01-general-introduction-to-smart-contracts.md)
  - [Anatomy of a Simple Contract](./ch12-02-anatomy-of-a-simple-contract.md)

## Building Starknet Smart Contracts

- [Building Starknet Smart Contracts](./ch13-00-building-starknet-smart-contracts.md)

  - [Contract Storage](./ch13-01-contract-storage.md)
  - [Contract Functions](./ch13-02-contract-functions.md)
  - [Contract Events](./ch13-03-contract-events.md)
  - [Reducing Boilerplate](./ch13-04-reducing-boilerplate.md)

## Starknet Cross-Contract Interactions

- [Starknet Cross-Contract Interactions](./ch14-00-starknet-cross-contract-interactions.md)

  - [ABIs and Contract Interfaces](./ch14-01-abis-and-contract-interfaces.md)
  - [Contract Dispatchers, Library Dispatchers and System Calls](./ch14-02-contract-dispatchers-library-dispatchers-and-system-calls.md)

## Building Advanced Starknet Smart Contracts

- [Building Advanced Starknet Smart Contracts](./ch15-00-building-advanced-starknet-smart-contracts.md)

  - [Optimizing Storage Costs](./ch15-01-optimizing-storage-costs.md)
  - [Composability and Components](./ch15-02-composability-and-components.md)
    - [Under the hood](./ch15-02-01-under-the-hood.md)
    - [Component dependencies](./ch15-02-02-component-dependencies.md)
    - [Testing components](./ch15-02-03-testing-components.md)
  - [Upgradability]()
  - [L1 <> L2 Messaging](./ch15-04-L1-L2-messaging.md)
  - [Oracle Interactions](./ch15-05-oracle-interactions.md)
    - [Price Feeds]()
    - [Randomness]()
  - [Other examples](./ch15-06-other-examples.md)
    - [Deploying and Interacting with a Voting contract](./ch15-06-01-deploying-and-interacting-with-a-voting-contract.md)

## Starknet Smart Contracts Security

- [Starknet Smart Contracts Security](./ch16-00-starknet-smart-contracts-security.md)

  - [General Recommendations](./ch16-01-general-recommendations.md)
  - [Testing Smart Contracts with Starknet Foundry]()
  - [Static Analysis Tools](./ch16-03-static-analysis-tools.md)
  - [Formal Verification]()

## Appendix

- [Appendix](appendix-00.md)
  - [A - System Calls](appendix-07-system-calls.md)

# The Cairo Programming Language

[The Cairo Programming Language](title-page.md)
[Foreword](ch00-01-foreword.md)
[Introduction](ch00-00-introduction.md)

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
  - [Custom Data Structures](ch03-03-custom-data-structures.md)

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

- [Generic Types](ch08-00-generic-types-and-traits.md)

  - [Generic Functions](ch08-01-generic-data-types.md)
  - [Traits in Cairo](ch08-02-traits-in-cairo.md)

## Testing Cairo Programs

- [Testing Cairo Programs](ch09-00-testing-cairo-programs.md)

  - [How To Write Tests](ch09-01-how-to-write-tests.md)
  - [Testing Organization](ch09-02-test-organization.md)

## Error Handling

- [Error Handling](ch10-00-error-handling.md)

  - [Unrecoverable Errors with panic](ch10-01-unrecoverable-errors-with-panic.md)
  - [Recoverable Errors with Result](ch10-02-recoverable-errors.md)

## Advanced Features

- [Advanced Features](ch11-00-advanced-features.md)

  - [Operator Overloading](ch11-01-operator-overloading.md)
  - [Macros](ch11-02-macros.md)
  - [Working with Hashes](ch11-03-hash.md)

## Starknet smart contracts

- [Starknet Smart Contracts](./ch99-00-starknet-smart-contracts.md)

  - [Introduction to smart-contracts](./ch99-01-01-introduction-to-smart-contracts.md)
  - [A simple contract](./ch99-01-02-a-simple-contract.md)
  - [A deeper dive into contracts](./ch99-01-03-00-a-deeper-dive-into-contracts.md)

    - [Contract Storage](./ch99-01-03-01-contract-storage.md)
    - [Contract Functions](./ch99-01-03-02-contract-functions.md)
    - [Contract Events](./ch99-01-03-03-contract-events.md)
    - [Reducing boilerplate](./ch99-01-03-04-reducing-boilerplate.md)
    - [Optimizing storage costs](./ch99-01-03-05-optimizing-storage.md)

  - [Components](./ch99-01-05-00-components.md)

    - [Under the hood](./ch99-01-05-01-components-under-the-hood.md)
    - [Component dependencies](./ch99-01-05-02-component-dependencies.md)
    - [Testing components](./ch99-01-05-03-testing-components.md)

  - [ABIs and Cross-contract Interactions](./ch99-02-00-abis-and-cross-contract-interactions.md)

    - [ABIs and Interfaces](./ch99-02-01-abis-and-interfaces.md)
    - [Contract Dispatchers, Library Dispachers and system calls](./ch99-02-02-contract-dispatcher-library-dispatcher-and-system-calls.md)

  - [Other examples](./ch99-01-04-00-other-examples.md)

    - [Deploying and Interacting with a Voting contract](./ch99-01-04-01-voting-contract.md)

  - [L1 <> L2 Messaging](./ch99-04-00-L1-L2-messaging.md)
  - [Security Considerations](./ch99-03-security-considerations.md)

- [Appendix](appendix-00.md)

  - [A - Keywords](appendix-01-keywords.md)
  - [B - Operators and Symbols](appendix-02-operators-and-symbols.md)
  - [C - Derivable Traits](appendix-03-derivable-traits.md)
  - [D - Useful Development Tools](appendix-04-useful-development-tools.md)
  - [E - Common Types & Traits and the Cairo Prelude](appendix-05-common-types-and-traits-and-cairo-prelude.md)
  - [F - Installing Cairo binaries](appendix-06-cairo-binaries.md)

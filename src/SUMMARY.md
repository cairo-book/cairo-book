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

- [Common Collections](ch02-99-00-common-collections.md)
  - [Arrays](ch02-99-01-arrays.md)
  - [Dictionaries](ch02-99-02-dictionaries.md)

## Understanding Ownership

- [Understanding Ownership](ch03-00-understanding-ownership.md)
  - [What is Ownership?](ch03-01-what-is-ownership.md)
  - [References and Snapshots](ch03-02-references-and-snapshots.md)

## Using Structs to Structure Related Data

- [Using Structs to Structure Related Data](ch04-00-using-structs-to-structure-related-data.md)
  - [Defining and Instantiating Structs](ch04-01-defining-and-instantiating-structs.md)
  - [An Example Program Using Structs](ch04-02-an-example-program-using-structs.md)
  - [Method Syntax](ch04-03-method-syntax.md)

## Enums and Pattern Matching

- [Enums and Pattern Matching](ch05-00-enums-and-pattern-matching.md)
  - [Enums](ch05-01-enums.md)
  - [The Match Control Flow Construct](ch05-02-the-match-control-flow-construct.md)

## Managing Cairo Projects with Packages, Crates and Modules

- [Managing Cairo Projects with Packages, Crates and Modules](ch06-00-managing-cairo-projects-with-packages-crates-and-modules.md)

  - [Packages and Crates](ch06-01-packages-and-crates.md)

  - [Defining Modules to Control Scope](ch06-02-defining-modules-to-control-scope.md)
  - [Paths for Referring to an Item in the Module Tree](ch06-03-paths-for-referring-to-an-item-in-the-module-tree.md)
  - [Bringing Paths into Scope with the 'use' Keyword](ch06-04-bringing-paths-into-scope-with-the-use-keyword.md)
  - [Separating Modules into Different Files](ch06-05-separating-modules-into-different-files.md)

## Generic Data Types

- [Generic Types](ch07-00-generic-types-and-traits.md)

  - [Generic Functions](ch07-01-generic-data-types.md)
  - [Traits in Cairo](ch07-02-traits-in-cairo.md)

## Testing Cairo Programs

- [Testing Cairo Programs](ch08-00-testing-cairo-programs.md)

  - [How To Write Tests](ch08-01-how-to-write-tests.md)
  - [Testing Organization](ch08-02-test-organization.md)

## Error Handling

- [Error Handling](ch09-00-error-handling.md)
  - [Unrecoverable Errors with panic](ch09-01-unrecoverable-errors-with-panic.md)
  - [Recoverable Errors with Result](ch09-02-recoverable-errors.md)

## Advanced Features

- [Advanced Features](ch10-00-advanced-features.md)
  - [Operator Overloading](ch10-01-operator-overloading.md)
  - [Macros](ch10-02-macros.md)

## Starknet smart contracts

- [Starknet Smart Contracts](./ch99-00-starknet-smart-contracts.md)

  - [Introduction to smart-contracts](./ch99-01-01-introduction-to-smart-contracts.md)
  - [A simple contract](./ch99-01-02-a-simple-contract.md)
  - [A deeper dive into contracts](./ch99-01-03-00-a-deeper-dive-into-contracts.md)
    - [Storage Variables](./ch99-01-03-01-storage-variables.md)
    - [Contract Functions](./ch99-01-03-02-contract-functions.md)
    - [Contract Events](./ch99-01-03-03-contract-events.md)
    - [Reducing boilerplate](./ch99-01-03-04-reducing-boilerplate.md)
    - [Optimizing storage costs](./ch99-01-03-05-optimizing-storage.md)
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
  - [E - Cairo Most Common Types and Traits](appendix-05-most-common-types-and-traits.md)
  - [F - Installing Cairo binaries](appendix-06-cairo-binaries.md)

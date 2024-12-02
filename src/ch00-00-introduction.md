# Introduction

## What is Cairo?

Cairo is a programming language designed to leverage the power of mathematical proofs for computational integrity. Just as C.S. Lewis defined integrity as "doing the right thing, even when no one is watching," Cairo enables programs to prove they've done the right computation, even when executed on untrusted machines.

The language is built on STARK technology, a modern evolution of PCP (Probabilistically Checkable Proofs) that transforms computational claims into constraint systems. While Cairo's ultimate purpose is to generate these mathematical proofs that can be verified efficiently and with absolute certainty.

## What Can You Do with It?

Cairo enables a paradigm shift in how we think about trusted computation. Its primary application today is Starknet, a Layer 2 scaling solution for Ethereum that addresses one of blockchain's fundamental challenges: scalability without sacrificing security.

In the traditional blockchain model, every participant must verify every computation. Starknet changes this by using Cairo's proof system: computations are executed off-chain by a prover who generates a STARK proof, which is then verified by an Ethereum smart contract. This verification requires significantly less computational power than re-executing the computations, enabling massive scalability while maintaining security.

However, Cairo's potential extends beyond blockchain. Any scenario where computational integrity needs to be verified efficiently can benefit from Cairo's verifiable computation capabilities.

## Who Is This Book For?

This book caters to three main audiences, each with their own learning path:

1. **General-Purpose Developers**: If you're interested in Cairo for its verifiable computation capabilities outside of blockchain, you'll want to focus on chapters {{#chap getting-started}}-{{#chap advanced-cairo-features}}. These chapters cover the core language features and programming concepts without diving deep into smart contract specifics.

2. **New Smart Contract Developers**: If you're new to both Cairo and smart contracts, we recommend reading the book front to back. This will give you a solid foundation in both the language fundamentals and smart contract development principles.

3. **Experienced Smart Contract Developers**: If you're already familiar with smart contract development in other languages, or Rust, you might want to follow this focused path:
   - Chapters {{#chap getting-started}}-{{#chap common-collections}} for Cairo basics
   - Chapter {{#chap generic-types-and-traits}} for Cairo's trait and generics system
   - Skip to Chapter {{#chap building-starknet-smart-contracts}} for smart contract development
   - Reference other chapters as needed

Regardless of your background, this book assumes basic programming knowledge such as variables, functions, and common data structures. While prior experience with Rust can be helpful (as Cairo shares many similarities), it's not required.

## References

- Cairo CPU Architecture: <https://eprint.iacr.org/2021/1063>
- Cairo, Sierra and Casm: <https://medium.com/nethermind-eth/under-the-hood-of-cairo-1-0-exploring-sierra-7f32808421f5>
- State of non determinism: <https://twitter.com/PapiniShahar/status/1638203716535713798>

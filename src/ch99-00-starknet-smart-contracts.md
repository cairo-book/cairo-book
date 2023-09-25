# Starknet Smart Contracts

All through the previous sections, you've mostly written programs with a `main` entrypoint. In the coming sections, you will learn to write and deploy Starknet contracts.

One of the applications of the Cairo language is to write smart contracts for the Starknet network. Starknet is a permissionless network that leverages zk-STARKs technology for scalability. As a Layer-2 scalability solution for Ethereum, Starknet's goal is to offer fast, secure, and low-cost transactions. It functions as a Validity Rollup (commonly known as a zero-knowledge Rollup) and is built on top of the Cairo language and the StarkNet VM.

Starknet contracts, in simple words, are programs that can run on the Starknet VM. Since they run on the VM, they have access to Starknet’s persistent state, can alter or modify variables in Starknet’s states, communicate with other contracts, and interact seamlessly with the underlying L1.

Starknet contracts are denoted by the `#[contract]` attribute. We'll dive deeper into this in the next sections.
If you want to learn more about the Starknet network itself, its architecture and the tooling available, you should read the [Starknet Book](https://book.starknet.io/). This section will focus on writing smart contracts in Cairo.

#### Scarb

You can set up a Starknet development environment using Scarb as stated in the [Installation](./ch01-01-installation.md) section. Each example in this chapter can be used with Scarb. Note that you will need to modify the `Scarb.toml` file from your Scarb packages to use the `starknet` dependency, as mentioned in the [Hello, World](./ch01-02-hello-world.md#starknet-support) Starknet section.

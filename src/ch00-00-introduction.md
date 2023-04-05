# Introduction

## What is Cairo?
Cairo is a programming language designed for a virtual CPU of the same name. The specificity of this processor is that it was not created for the physical constraints of our world but for cryptographic ones, making it capable of efficiently proving the execution of any program running on it. This means that you can perform time consuming operations on a machine you don't trust, and check the result very quickly on a cheaper machine.
While Cairo 0 used to be directly transpiled to CASM, the Cairo CPU assembly, Cairo 1 is a more high level language. It first compiles to Sierra, an intermediate representation of Cairo which will compile later down to a safe subset of CASM. The point of Sierra is to ensure your CASM will always be provable, even when when the computation fails.

## What can you do with it?
You can compute a value you can trust on a machine you can't. One major usecase is Starknet, a solution to Ethereum scaling. Ethereum is a decentralized blockchain platform that enables the creation of decentralized applications where every single interaction between a user and a d-app is verified by all the participants. Starnet is another blockchain built on top of Ethereum. Instead of having all the participants of the network to verify all user interactions, only one node, called the prover, execute the programs and generate proofs that the computations were done correctly. These proofs are then verified by an Ethereum smartcontract which requires significantly less computational power compared to executing the interactons themselves. This approach allows for increased throughput and reduced transaction costs but preserving Ethereum securitys.

## What are the differences with other programming languages?
Cairo is quite different from traditional programming languages, especially when it comes to overhead costs and its primary advantages. The most important thing to keep in mind when writing your program is that it will be excuted in two different ways.

First, it will be executed by the prover. This execution is very similar to an execution on any other langugage. Because Cairo is virtualized, the operations are not native and do not run directly on the hardware, additionally, these operations were not specifically designed for maximum efficiency, as their main focus is on cryptographic verifiability rather than speed. This can lead to some performance overhead but it is not the most relevant part to optimize.

Then, the generated proof will be verified. This has to be as cheap as possible since it has to be verified on pontentially many very small machines. Fortunately, on top of the sublinear Stark verification (verifying is faster than computing), Cairo has some unique advantages, such as its support for non-determinism. You may have heard of some difficult algorithmic problems, NP or NP-complete problems like sat, the travelling salesman or the backpack. Well, NP stands for Non determinist Polynomial, which means there is a polynomial algorithm for their verification. Given that the verification time is what matters the most, some traditionally expensive things can be virtually free in Cairo. For example sorting an array in Cairo costs the same price than copying it. For now writing customized non deterministic code is not possible, but the standard lib makes use of it.


## References

- Cairo CPU Architecture: https://eprint.iacr.org/2021/1063
- Cairo, Sierra and Casm: https://medium.com/nethermind-eth/under-the-hood-of-cairo-1-0-exploring-sierra-7f32808421f5
- State of non determinism: https://twitter.com/PapiniShahar/status/1638203716535713798
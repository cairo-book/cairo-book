# Foreword

Zero-knowledge proofs have emerged as a transformative technology in the blockchain space, offering solutions for both privacy and scalability challenges. Among these, STARKs (Scalable Transparent ARguments of Knowledge) stand out as a particularly powerful innovation. Unlike traditional proof systems, STARKs rely solely on collision-resistant hash functions, making them post-quantum secure and eliminating the need for trusted setups.

However, writing general-purpose programs that can generate cryptographic proofs has historically been a significant challenge. Developers needed deep expertise in cryptography and complex mathematical concepts to create verifiable computations, making it impractical for mainstream adoption.

This is where Cairo comes in. As a general-purpose programming language designed specifically for creating provable programs, Cairo abstracts away the underlying cryptographic complexities while maintaining the full power of STARKs. Strongly inspired by Rust, Cairo has been built to help you create provable programs without requiring specific knowledge of its underlying architecture, allowing you to focus on the program logic itself.

Blockchain developers that want to deploy contracts on Starknet will use the Cairo programming language to code their smart contracts. This allows the Starknet OS to generate execution traces for transactions to be proved by a prover, which is then verified on Ethereum L1 prior to updating the state root of Starknet.

However, Cairo is not only for blockchain developers. As a general purpose programming language, it can be used for any computation that would benefit from being proved on one computer and verified on other machines. Powered by a Rust VM, and a next-generation prover, the execution and proof generation of Cairo programs is blazingly fast - making Cairo the best tool for building provable applications.

This book is designed for developers with a basic understanding of programming concepts. It is a friendly and approachable text intended to help you level up your knowledge of Cairo, but also help you develop your programming skills in general. So, dive in and get ready to learn all there is to know about Cairo!

## Acknowledgements

This book would not have been possible without the help of the Cairo community. We would like to thank every contributor for their contributions to this book!

We would like to thank the Rust community for the [Rust Book][doc rust], which has been a great source of inspiration for this book. Many examples and explanations have been adapted from the Rust Book to fit the Cairo programming language, as the two languages share many similarities.

[doc rust]: https://doc.rust-lang.org/book/

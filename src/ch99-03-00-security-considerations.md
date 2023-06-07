# Starknet contracts: Security Considerations

When developing software, ensuring it functions as intended is usually straightforward. However, preventing unintended usage and vulnerabilities can be more challenging.

In smart contract development, security is very important. A single error can result in the loss of valuable assets or the improper functioning of certain features.

Smart contracts are executed in a public environment where anyone can examine the code and interact with it. Any errors or vulnerabilities in the code can be exploited by malicious actors.

Furthermore, once a smart contract is deployed, it becomes immutable, meaning it cannot be changed. Any errors discovered after deployment cannot be changed easily.

This chapter addresses some significant security considerations and offers recommendations to keep in mind when developing Starknet smart contracts.

## Disclaimer

This chapter does not provide an exhaustive list of all possible security issues, and it does not guarantee that your contracts will be completely secure.

If you are developing smart contracts for production use, it is highly recommended to conduct external audits performed by security experts.

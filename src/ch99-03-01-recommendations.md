# Security Recommendations

This section presents general recommendations for writing secure smart contracts. By incorporating these concepts during development, you can create robust and reliable smart contracts. This reduces the chances of unexpected behavior or vulnerabilities.

## Mindset

Adopting a security mindset is the initial step in writing secure smart contracts. Always consider all possible scenarios when writing code.

### Viewing smart contract as Finite State Machines

Transactions in smart contracts are atomic, meaning they either succeed or fail without making any changes.

Think of smart contracts as state machines: they have a set of initial states defined by the constructor constraints, and external function represents a set of possible state transitions. A transaction is nothing more than a state transition.

Using errors to check conditions adds constraints that helps clearly define the boundaries of possible state transitions for each function in your smart contract. These checks ensure that the behavior of the contract stays within the expected limits.

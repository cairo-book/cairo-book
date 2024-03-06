# Building Starknet Smart Contracts

In the previous section, we gave an introductory example of a smart contract written in Cairo. In this section, we'll be taking a deeper look at all the components of a smart contract, step by step.

When we discussed [_interfaces_](./ch12-02-anatomy-of-a-simple-contract.md#the-interface-the-contracts-blueprint), we specified the difference between _public functions, external functions and view functions_, and we mentioned how to interact with _storage_.

At this point, you should have multiple questions that come to mind:

- How do I define internal/private functions?
- How can I emit events? How can I index them?
- Where should I define functions that do not need to access the contract's state?
- Is there a way to reduce the boilerplate?
- How can I store more complex data types?

Luckily, we'll be answering all these questions in this chapter. Let's consider the following example contract that we'll be using throughout this chapter:

```rust,noplayground
{{#include ../listings/ch99-starknet-smart-contracts/listing_99_03/src/lib.cairo:all}}
```

{{#label reference-contract}}
<span class="caption">Listing {{#ref reference-contract}}: Our reference contract for this chapter.</span>

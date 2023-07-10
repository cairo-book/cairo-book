# A deeper dive into contracts

In the previous section, we gave an introductory example of a smart contract written in Cairo. In this section, we'll be taking a deeper look at all the components of a smart contract, step by step.

In the previous chapter, we talked about _interfaces_, specified the difference between _public functions, external functions and view functions_, and we mentioned how to interact with _storage_.

At this point, you should have multiple questions that come to mind:

- How do I define internal/private functions?
- How can I emit events? How can I index them?
- Where should I defined functions that do not need to access the contract's state?
- Is there a way to reduce the boilerplate?
- How can I store more complex data types?

Luckily, we'll be answering all these questions in this chapter. To answer these questions, let's consider the following example contract that we'll be using throughout this chapter:

```rust
{{#include ../listings/ch99-starknet-smart-contracts/listing_99_03_example_contract.cairo:all}}
```

<span class="caption">Listing 99-1bis: Our reference contract for this chapter</span>






# Non-Deterministic Read-only Memory
Unlike the widely used read-write memory model, Cairo's memory model uses non-deterministic read-only memory.

Let's uncover the details of this memory model.

From understanding the nature of immutable [variables](ch02-01-variables-and-mutability.md), we know that by default, a declared variable in Cairo is immutable.

This means that the program will memory in Cairo is designed to be continuous and the memory address is also continuous for every new memory address created.

Memory in Cairo is designed to be continuous.

We are aware that in Cairo, once a variable is assigned to a value, its value becomes immutable and its memory address cannot be changed. This is the nature of non-deterministic read-only memory and while it might be confusing at first, it is purposefully designed this way for efficient proof generation.
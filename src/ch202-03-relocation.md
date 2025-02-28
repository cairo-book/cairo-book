# Relocation

In the [non-deterministic section](ch202-01-non-deterministic-read-only-memory.md), we discussed the importance of continuous memory requirement in Cairo and its efficiency in proof generation.

Relocation in Cairo's memory allows for a large address space (up to the field size) while structuring the address spaces to be contiguous. The relocation happens within the segment layer... 

https://github.com/lambdaclass/cairo-vm.c
- refer to how relocation works  

1. Program Segment

2. Execution Segment

3. Builtin Segment

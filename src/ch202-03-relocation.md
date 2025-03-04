# Relocation

In the [non-deterministic section](ch202-01-non-deterministic-read-only-memory.md), we discussed the importance of continuous memory requirement in Cairo and its efficiency in proof generation.

Cairo's memory address space also has to be continuous in order to improve prover's efficiency.


This is to ensure that it follows the rule of making sure the memory addresses are always continuous for the prover and that it needs to support an address space that is big as the field size \\( 0 \leq x < P \\)  where \\(P \\) is equal to \\( {2^{251}} + 17 \cdot {2^{192}} + 1 \\).

Relocation in Cairo's memory allows for a large address space (up to the field size) while structuring the address spaces to be contiguous. The relocation happens within the segment layer... 

https://github.com/lambdaclass/cairo-vm.c
- refer to how relocation works  

1. Program Segment

2. Execution Segment

3. Builtin Segment

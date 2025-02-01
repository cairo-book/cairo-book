# Add Mod Builtin

The `AddMod` builtin provides arithmetic circuit support by computing modular addition of field elements (felts). For inputs a and b and modulus p, it computes c where c ≡ a + b (mod p). Operations are processed in batches for efficiency within the Cairo VM.

## Memory Organization

The AddMod builtin has its own segment during a Cairo VM run. It works with blocks of 4 consecutive cells:

1. The first two cells are inputs storing the operands to be added (a and b)

   - Cells [4n + 0]: First operand (a)
   - Cells [4n + 1]: Second operand (b)

2. The third cell is an input storing the modulus (p)

   - Cells [4n + 2]: Modulus (p)

3. The fourth cell is the output storing the result of (a + b) mod p

- Cells [4n + 3]: Result (c)

Where n is the batch index (0, 1, 2, ...).

## Cell Organization

Each block of 4 cells follows these rules:

- All input cells must store felt values - relocatable values (pointers) are not allowed
- The modulus m must be non-zero
- The output cell is deduced from the input cells when read
- The result is computed only when the output cell is accessed
- All input cells must be written before the output can be computed

For each 4-cell block:

### Input Rules:

- All inputs (a, b, p) must be felt values
- The modulus p must be non-zero
- No relocatable values are allowed

### Output Rules:

- Result c is computed as (a + b) mod p
- Computation occurs when the result cell is accessed
- Result is guaranteed to be in range [0, p-1]

### Batch Processing:

- Each 4-cell block operates independently
- Results are computed lazily per block
- Blocks can be processed in parallel by the VM

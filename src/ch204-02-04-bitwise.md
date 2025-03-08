# Bitwise Builtin

In the Cairo VM, the _Bitwise Builtin_ enables bitwise operations—specifically AND (`&`), XOR (`^`), and OR (`|`)—on field elements. As a builtin, it’s an integral part of the VM’s architecture, designed to support specific tasks where bit-level manipulation is needed. In Cairo, these bitwise operations complement the base instruction set of the VM by making it easier to perform tasks like bit masking or combining values in particular use cases.

## How It Works

The Bitwise builtin operates on a dedicated memory segment. Each operation uses a block of 5 cells:

| Offset | Description   | Role   |
| ------ | ------------- | ------ |
| 0      | x value       | Input  |
| 1      | y value       | Input  |
| 2      | x & y result  | Output |
| 3      | x ^ y result  | Output |
| 4      | x \| y result | Output |

For instance, if `x = 5` (binary `101`) and `y = 3` (binary `011`), the outputs are:

- `5 & 3 = 1` (binary `001`)
- `5 ^ 3 = 6` (binary `110`)
- `5 | 3 = 7` (binary `111`)

This structure ensures efficient, native computation of bitwise operations when needed, with strict validation to prevent errors (e.g., inputs exceeding the bit limit).

## Example Usage

Here’s a simple Cairo function using the Bitwise Builtin. We demonstrate it using Cairo Zero, which is closer to machine code, and allows visual representation of the low-level operations.

```cairo
from starkware.cairo.common.cairo_builtins import BitwiseBuiltin

func bitwise_ops{bitwise_ptr: BitwiseBuiltin*}(x: felt, y: felt) -> (and: felt, xor: felt, or: felt) {
    assert [bitwise_ptr] = x;        // Input x
    assert [bitwise_ptr + 1] = y;    // Input y
    let and = [bitwise_ptr + 2];     // x & y
    let xor = [bitwise_ptr + 3];     // x ^ y
    let or = [bitwise_ptr + 4];      // x | y
    let bitwise_ptr = bitwise_ptr + 5;
    return (and, xor, or);
}
```

## Implementation References

These implementation references of the Bitwise Builtin in various Cairo VM implementations:

- [Python Bitwise Builtin](https://github.com/starkware-libs/cairo-lang/blob/0e4dab8a6065d80d1c726394f5d9d23cb451706a/src/starkware/cairo/lang/builtins/bitwise/bitwise_builtin_runner.py)

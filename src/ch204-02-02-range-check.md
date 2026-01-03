# Range Check Builtin

The _Range Check_ builtin verifies that field elements fall within a specific
range. This builtin is fundamental to Cairo's integer types and comparisons,
ensuring that values satisfy bounded constraints.

Two variants of this builtin exist:

- Standard Range Check: Verifies values in the range \\([0, 2^{128}-1]\\)
- Range Check 96: Verifies values in the range \\([0, 2^{96}-1]\\)

This section focuses on the standard variant, though the same principles apply
to both.

## Purpose and Importance

While it's possible to implement range checking using pure Cairo code (for
example, by decomposing a number into its binary representation and verifying
each bit), using the builtin is significantly more efficient. A pure Cairo
implementation would require at least 384 instructions to verify a single range
check, whereas the builtin achieves the same result with computational cost
equivalent to about 1.5 instructions. This efficiency makes the Range Check
builtin essential for the implementation of bounded integer arithmetic and other
operations that require value range verification.

## Cells Organization

The Range Check builtin operates on a dedicated memory segment with a validation
property pattern:

| Characteristic    | Description                                  |
| ----------------- | -------------------------------------------- |
| Valid values      | Field elements in range \\([0, 2^{128}-1]\\) |
| Error conditions  | Values ≥ 2^128 or relocatable addresses      |
| Validation timing | Immediate (upon cell write)                  |

Unlike builtins with deduction properties, the Range Check builtin validates
values at write time rather than read time. This immediate validation provides
early error detection for out-of-range values.

### Valid Operation Example

<div align="center">
  <img src="range-check-builtin-valid.png" alt="valid range_check builtin segment" width="300px"/>
</div>
<div align="center">
  <span class="caption">Range Check builtin segment with valid values</span>
</div>

In this example, a program successfully writes three values to the Range Check
segment:

- `0`: The minimum allowed value
- `256`: A typical small integer value
- `2^128-1`: The maximum allowed value

All three values fall within the permitted range \\([0, 2^{128}-1]\\), so the
operations succeed.

### Out-of-Range Error Example

<div align="center">
  <img src="range-check-builtin-error1.png" alt="invalid range_check builtin segment" width="300px"/>
</div>
<div align="center">
  <span class="caption">Range Check error: Value exceeds maximum range</span>
</div>

In this example, the program attempts to write `2^128` to cell `2:2`, which
exceeds the maximum allowed value. The VM immediately throws an out-of-range
error and aborts execution.

### Invalid Type Error Example

<div align="center">
  <img src="range-check-builtin-error2.png" alt="invalid range_check builtin segment" width="300px"/>
</div>
<div align="center">
  <span class="caption">Range Check error: Value is a relocatable address</span>
</div>

In this example, the program attempts to write a relocatable address (pointer to
cell `1:7`) to the Range Check segment. Since the builtin only accepts field
elements, the VM throws an error and aborts execution.

## Implementation References

These implementation references of the Range Check builtin in various Cairo VM
implementations:

- [TypeScript Range Check Builtin](https://github.com/kkrt-labs/cairo-vm-ts/blob/main/src/builtins/rangeCheck.ts)
- [Python Range Check Builtin](https://github.com/starkware-libs/cairo-lang/blob/0e4dab8a6065d80d1c726394f5d9d23cb451706a/src/starkware/cairo/lang/builtins/range_check/range_check_builtin_runner.py)
- [Rust Range Check Builtin](https://github.com/lambdaclass/cairo-vm/blob/41476335884bf600b62995f0c005be7d384eaec5/vm/src/vm/runners/builtin_runner/range_check.rs)
- [Zig Range Check Builtin](https://github.com/keep-starknet-strange/ziggy-starkdust/blob/55d83e61968336f6be93486d7acf8530ba868d7e/src/vm/builtins/builtin_runner/range_check.zig)

## Resources on Range Check

If you're interested in how the Range Check builtin works and its usage in the
Cairo VM:

- Starknet,
  [CairoZero documentation, Range Checks section of Builtins and implicit arguments](https://docs.cairo-lang.org/how_cairo_works/builtins.html#range-checks)
- Lior G., Shahar P., Michael R.,
  [Cairo Whitepaper, Sections 2.8 and 8](https://eprint.iacr.org/2021/1063.pdf)
- [StarkWare Range Check implementation](https://github.com/starkware-libs/cairo-lang/blob/master/src/starkware/cairo/common/math.cairo)

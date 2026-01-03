# Mod Builtin

In the Cairo Virtual Machine (VM), the _Mod Builtin_ is a specialized builtin to
handle modular arithmetic operations—specifically addition and multiplication—on
field elements, or felts, within a given modulus. It’s built to compute
expressions like `a + b (mod p)` and `a * b (mod p)` efficiently.

To do this, it comes in two derivations: `AddModBuiltin` for addition and
`MulModBuiltin` for multiplication.

This builtin is a requirement for tasks like cryptographic applications or
computations heavy with modular arithmetic, especially when dealing with large
integers like `UInt384`.

## Why We Need It

Modular arithmetic is at the heart of many cryptographic protocols and
zero-knowledge proof systems. If you tried to implement these operations in pure
Cairo code, you’d quickly run into a wall of computational overhead—repeated
divisions and remainder checks considerably increasing the step count. The Mod
Builtin offers an optimized solution for handling these operations efficiently.
In practice, when manipulating
[Arithmetic Circuits](./ch12-10-arithmetic-circuits.md), you're using the Mod
Builtin under the hood.

## How It’s Structured

Every instance starts with seven input cells. Four of them—`p0`, `p1`, `p2`, and
`p3`—define the modulus `p` as a multi-word integer, typically split into four
96-bit chunks for `UInt384` compatibility. Then, the operands and results are
stored in the `values_ptr`, and `offsets_ptr` points to another table that tells
the builtin where to read or write those values, relative to the `values_ptr`.
Finally, `n` specifies how many operations to perform, and it needs to be a
multiple of the batch size.

The builtin’s core trick is deduction. Give it two parts of the triplet—like `a`
and `b`—and it figures out the third, `c`, based on the operation and modulus.
Or, if you provide `c` and one operand, it can solve for the other. It processes
these triplets in batches (often just one at a time), ensuring that
`op(a, b) = c + k * p` holds true, where `k` is a quotient within a specific
bound—small for addition, larger for multiplication. In practice, you set this
up with the `run_mod_p_circuit` function, which ties it all together. The values
table often overlaps with the `range_check96_ptr` segment to keep each word
under `2^96`, and offsets are defined as program literals using `dw` directives.

## Putting It to Work: Modular Addition

Let’s walk through an example of using the `AddMod` builtin to compute
`x + y (mod p)` for two `UInt384` values. This Cairo Zero code shows how the Mod
Builtin fits into a real program.

```cairo
from starkware.cairo.common.cairo_builtins import UInt384, ModBuiltin
from starkware.cairo.common.modulo import run_mod_p_circuit
from starkware.cairo.lang.compiler.lib.registers import get_fp_and_pc

func add{range_check96_ptr: felt*, add_mod_ptr: ModBuiltin*, mul_mod_ptr: ModBuiltin*}(
    x: UInt384*, y: UInt384*, p: UInt384*
) -> UInt384* {
    let (_, pc) = get_fp_and_pc();

    // Define pointers to the offsets tables, which come later in the code
    pc_label:
    let add_mod_offsets_ptr = pc + (add_offsets - pc_label);
    let mul_mod_offsets_ptr = pc + (mul_offsets - pc_label);

    // Load x and y into the range_check96 segment, which doubles as our values table
    // x takes slots 0-3, y takes 4-7—each UInt384 is 4 words of 96 bits
    assert [range_check96_ptr + 0] = x.d0;
    assert [range_check96_ptr + 1] = x.d1;
    assert [range_check96_ptr + 2] = x.d2;
    assert [range_check96_ptr + 3] = x.d3;
    assert [range_check96_ptr + 4] = y.d0;
    assert [range_check96_ptr + 5] = y.d1;
    assert [range_check96_ptr + 6] = y.d2;
    assert [range_check96_ptr + 7] = y.d3;

    // Fire up the modular circuit: 1 addition, no multiplications
    // The builtin deduces c = x + y (mod p) and writes it to offsets 8-11
    run_mod_p_circuit(
        p=[p],
        values_ptr=cast(range_check96_ptr, UInt384*),
        add_mod_offsets_ptr=add_mod_offsets_ptr,
        add_mod_n=1,
        mul_mod_offsets_ptr=mul_mod_offsets_ptr,
        mul_mod_n=0,
    );

    // Bump the range_check96_ptr forward: 8 input words + 4 output words = 12 total
    let range_check96_ptr = range_check96_ptr + 12;

    // Return a pointer to the result, sitting in the last 4 words
    return cast(range_check96_ptr - 4, UInt384*);

    // Offsets for AddMod: point to x (0), y (4), and the result (8)
    add_offsets:
    dw 0;  // x starts at offset 0
    dw 4;  // y starts at offset 4
    dw 8;  // result c starts at offset 8

    // No offsets needed for MulMod here
    mul_offsets:
}
```

In this function, we take two `UInt384` values, `x` and `y`, and a modulus `p`.
We write `x` and `y` into the values table starting at `range_check96_ptr`, then
use offsets—`[0, 4, 8]`—to tell the builtin where `x`, `y`, and the result `c`
live. The `run_mod_p_circuit` call triggers the `AddMod` builtin to compute
`x + y (mod p)` and store the result at offset 8. After adjusting the pointer,
we return a pointer to that result. It's a straightforward setup, but the
builtin handles the modular reduction for us, saving a ton of manual work.

Imagine a simple case with `n_words = 1` and `batch_size = 1`. If `p = 5`,
`x = 3`, and `y = 4`, the values table might hold `[3, 4, 2]`. The offsets
`[0, 1, 2]` point to `a = 3`, `b = 4`, and `c = 2`. The builtin checks:
`3 + 4 = 7`, and `7 mod 5 = 2`, which matches `c`. Everything checks out.

If things go wrong—say `x` is missing a word—the builtin flags a
`MissingOperand` error. For `MulMod`, if `b` and `p` aren't coprime and `a` is
unknown, you'll get a `ZeroDivisor` error. And if any word exceeds `2^96`, the
range check fails. These safeguards keep the operation reliable.

## Under the Hood

Let’s take a closer look at how the Mod Builtin is designed and why it’s built
the way it is. The goal here is efficiency—making modular arithmetic fast and
reliable in Cairo’s virtual machine—while keeping it practical for real-world
use, like cryptographic programs. To understand that, we’ll explore a few key
pieces of its structure and the thinking behind them.

First, why does it break numbers into 96-bit chunks, typically four of them for
a `UInt384`? That’s not an arbitrary choice. The Cairo VM already has a built-in
system for checking that numbers stay within certain bounds, called
`range_check96`, which works with 96-bit values. By aligning the Mod Builtin’s
word size with that system, it can lean on the VM’s existing machinery to ensure
each chunk of a number stays below `2^96`. For a `UInt384`, four 96-bit words
add up to 384 bits, which is big enough for most cryptographic applications.

Now, consider the difference between `AddMod` and `MulMod`. When you add two
numbers close to the modulus `p`, the result tops out at `2p - 2`. That’s why
`AddMod` limits its quotient `k`—the number of times `p` gets subtracted to wrap
the result—to just 2. If `a + b` is, say, `1.5p`, then `k = 1` and
`c = a + b - p` keeps everything in check. It’s a tight constraint because
addition doesn’t produce wildly large numbers. Multiplication, though, is
different. With `MulMod`, `a * b` could be enormous—think `p * p` or more—so the
default quotient bound is set way higher, up to `2^384`. This ensures it can
handle even the biggest products without running out of room to adjust.

The real cleverness comes in how the builtin figures out missing values, a
process called deduction. Instead of always starting from scratch, it works with
what’s already in memory. For `AddMod`, if you give it `a` and `b`, it computes
`c = a + b (mod p)`. If you give it `c` and `b`, it solves `a + b = c + k * p`
to find `a`, testing `k = 0` or `1`.

For `MulMod`, it’s trickier—multiplication isn’t as straightforward to reverse.
Here, it uses a mathematical tool called the extended GCD algorithm to solve
`a * b = c (mod p)`. If `b` and `p` share factors (their greatest common divisor
isn’t 1), there’s no unique solution, and it flags a `ZeroDivisor` error.
Otherwise, it finds the smallest `a` that fits.

Another design choice is the batch size, which is often just 1 in practice. The
builtin can process multiple operations at once—`batch_size` triplets of `a`,
`b`, and `c`—but keeping it at 1 simplifies things for most cases. It’s like
handling one addition or multiplication at a time, which is plenty for many
programs, though the option to scale up is there if you need it.

Why tie the values table to `range_check96_ptr`? It’s about efficiency again.
The VM’s range-checking system is already set up to monitor that segment, so
using it for the builtin’s values—like `a`, `b`, and `c`—means those numbers get
validated automatically.

## Implementation References

These implementation references of the Mod Builtin in various Cairo VM
implementations:

- [Python Mod Builtin](https://github.com/starkware-libs/cairo-lang/blob/0e4dab8a6065d80d1c726394f5d9d23cb451706a/src/starkware/cairo/lang/builtins/modulo/mod_builtin_runner.py)

# How Builtins Work

In this section, we'll see how builtins work.

Builtins are AIRs that enforce specific properties.
During a program execution, a builtin is assigned
a memory segment with properties that match its AIR.

When reading a cell value or asserting a value to a cell,
the properties of the builtin must always hold.
If it doesn't, it means that the program execution
cannot be proven, and the Cairo VM terminates.

There are two types of properties for builtin segments,
_validation_ and _deduction_ properties.

## Validation Property

A validation property defines constraints a value must
hold to be asserted in a cell of a builtin segment.

For example, the _Output_ builtin only accepts felts.
Trying to assert a relocatable to one of its cells would
make the Cairo VM throw.

## Deduction Property

Deduction properties are used for builtins that compute
a value based on some other values. To properly work,
the builtin is split into blocks of cells, with _input_
and _output_ cells.

The input cells might hold a validation property (e.g. only felts).
This property could either be checked when asserting a value to the cell,
or when reading an output cell, thus using the input cells.

The output cells are computed from the input cells' value and
the specification of the builtin.

From the point of view of the prover, while the input cells
are directly asserted to, the output cells are only read, they are
computed nondeterministically. When read, their value is
computed and then asserted to the cell.
If not read, the cell will be left empty.

For example, the _Pedersen_ builtin works with triplets of cells:

- Two input cells to store two felts, `a` and `b`.
- One output cell which will store `Pedersen(a, b)`.

The following diagram shows in a simplified way
how the validation and deduction properties work,
by focusing ourselves on the memory when running instructions
involving the Pedersen and Output builtin segments.

<div align="center">
    <img src="builtin-example-pedersen-output.png" alt="Diagram of Cairo VM memory using Pedersen and Output builtins" width="800px"/>
    <span class="caption">Diagram of the Cairo VM memory using the Pedersen and Output builtins</span>
</div>

- The memory is in the state n.
  The segment of index 2 is the Output segment.
  The segment of index 3 is the Pedersen segment.
- The first two instructions assert two felts `17` and `38`
  to the input cells `3:0` and `3:1`.
- The memory is now in the state n+2. Let's deconstruct this instruction:

  1. Read the value at `3:2`
     - The cell `3:2` is read.
     - It is an output cell for Pedersen, which is empty.
     - Then, the Cairo VM must compute the Pedersen hash
       of the two previous input cells: `3:0` and `3:1` and store it at `3:2`.
     - Read the values at `3:0` and `3:1`.
       Are the two values stored Felt ? Yes, `17` and `38`.
     - Compute `Pedersen(17, 38)`.
     - Store it on `3:2` cell.
  2. Assert the read value `Pedersen(17, 38)` to `2:0`
     - Is `Pedersen(17, 38)` a Felt? Yes.

- The memory is now in the state n+3.
  The last instruction tries asserting `1:4`
  to the `2:1`, of the Output segment:
  - Is `1:2` a Felt? No. The VM crashes.

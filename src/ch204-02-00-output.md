# Output Builtin

The Output builtin is dedicated to writing values to an output segment that can be read after the program execution completes. It serves as a way for Cairo programs to communicate results externally.

## Memory Organization

The Output builtin has its own segment during a Cairo VM run. It consists of consecutive cells that are written to in sequential order. Unlike other builtins that work with fixed-size blocks of cells (like EC_OP's 7-cell blocks or Pedersen's 3-cell blocks), the Output builtin works with individual cells that are filled one at a time.

Key characteristics of the Output segment:

* Each cell can store a single felt value
* Values must be written sequentially starting from offset 0
* Cells cannot be written to out of order
* Once written, cells cannot be modified
* The segment size is determined by how many values the program outputs

## Cell Organization

The Output builtin follows these rules:

* Each cell must store a felt value - relocatable values (pointers) are not allowed
* Values must be written to consecutive cells starting at offset 0
* Attempting to write to a cell at offset n when offset n-1 hasn't been written will result in an error
* Reading from an unwritten cell will result in an error
* The total number of outputs must match the number declared when initializing the builtin

Here are some examples of the Output segment during program execution:

### Snapshot 1 - Valid Output Builtin Usage


<div align="center">
  <img src="valid-sequential-output.png" alt="Valid Output Builtin Usage" height="350px"/>
</div>
<div align="center">
  <span class="caption">Snapshot 1 </span>
</div>


In this snapshot, the program has written three values sequentially. The remaining cells are unwritten but available for future outputs.



### Snapshot 2 - Invalid Output Builtin Usage


<div align="center">
  <img src="Invalid-sequential-output.png" alt="Invalid Output Builtin Usage" height="350px"/>
</div>
<div align="center">
  <span class="caption">Snapshot 2 </span>
</div>


This snapshot shows an invalid state where the program attempted to write to offset 2 before writing to offset 1. This will result in an error because outputs must be sequential.


## Implementation References

These implementation references of the Output builtin might not be exhaustive.

* [TypeScript Output Builtin](https://github.com/kkrt-labs/cairo-vm-ts/blob/58fd07d81cff4a4bb45c30ab99976ba66f0576ad/src/builtins/output.ts) 

* [Python Output Builtin](https://github.com/starkware-libs/cairo-lang/blob/0e4dab8a6065d80d1c726394f5d9d23cb451706a/src/starkware/cairo/lang/vm/output_builtin_runner.py)

* [Rust Output Builtin](https://github.com/lambdaclass/cairo-vm/blob/41476335884bf600b62995f0c005be7d384eaec5/vm/src/vm/runners/builtin_runner/output.rs)

* [Go Output Builtin](https://github.com/NethermindEth/cairo-vm-go/blob/dc02d614497f5e59818313e02d2d2f321941cbfa/pkg/vm/builtins/output.go)

* [Zig Output Builtin](https://github.com/keep-starknet-strange/ziggy-starkdust/blob/55d83e61968336f6be93486d7acf8530ba868d7e/src/vm/builtins/builtin_runner/output.zig)
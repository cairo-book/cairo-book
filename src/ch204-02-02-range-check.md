The Range Check builtin in Cairo checks that some field element, or felt, falls into a known range usually in [0, 2^128), or even more practically in [0, 2^96). This is important during many calculations to maintain the integrity of data.

**Memory Layout**

In the Cairo VM, each built-in function is assigned its memory segment. Specifically, in the case of a Range Check built-in, every occurrence of its application consumes one cell of memory. 
- **Single Cell Structure**: Every instance of a range check consumes a single cell in memory that has to contain a felt that satisfies all constraints of the declaration.

- **Validation Property**: For any cell at address `p`, the following properties hold:
  - Over the range [0, 2^128), the value at memory address p must be greater than or equal to 0 and less than 2^128.
  - Over the range [0, 2^96), the value at memory address p must be greater than or equal to 0 and less than 2^96.

**Validation Mechanics**

When a value is given to the range check segment:

- **Input Check**: The value will be a field element; relocatable pointers are not allowed here, since the built-in function can only  check scalar inputs.

- **Execution**: This will happen when the VM reads from the cell or when the following check is executed:
  - If the value is in the allowed range, it passes the check without problems.
  - If not, an error will pop up the rest of the program will not be continued.

**Example**

Let us review a program execution by the following memory snapshots:

![Valid Range Check Segment Diagram_](https://github.com/user-attachments/assets/5960b8e5-740d-415b-98b9-5d3e70c45b77)

**Snapshot - Valid Range Check Segment**:
You can download the associated JSON data using the link below:

[Download JSON File](https://drive.google.com/uc?export=download&id=1yUNB4m9jOegY4NR6D6_NjGxvzPINoK1s)

  - Cell 2:0 holds the value 15, which is within the range [0, 2^128).
  - Cell 2:1 contains the value 93, also within the range [0, 2^128).

Both cells contain valid felts that are within the permitted or defined range; thus, no errors will pop up during the validation process.

**Implementation References**

Below are some reference implementations for the Range Check intrinsic:
- [TypeScript Range Check](https://www.webdevtutor.net/blog/typescript-check-number-is-in-range)
- [Python Range Check Builtin](https://www.codecademy.com/resources/docs/python/built-in-functions/range)
- [Rust Range Check Builtin](https://docs.rs/range_check/latest/range_check/)
- [Cairo VM](https://github.com/lambdaclass/cairo-vm/releases)


**Range Check Resources**  
For further information concerning range checking in Cairo, look at the link below:  
- [Cairo Documentation - Range Check Builtin](https://book.cairo-lang.org/ch204-01-how-builtins-work.html)

Diagrams of the memory layout and validation flow are included in the documentation. The following explanation attempts to explain and represent the validation property of the Range Check builtin.

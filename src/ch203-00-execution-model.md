# Execution Model

The CPU architecture of the Cairo VM defines how the VM processes instructions
and changes its state. It's directly analogous to the Central Processing Unit
(CPU) in a physical computer. In the Cairo VM, the CPU follows the principles of
a Von Neumann architecture, where both program instructions and data reside in
the same memory space. The VM's execution model is implemented as a repeating
loop, known as the **fetch-decode-execute cycle**, which dictates how the
machine advances from one state to the next.

The execution model is defined by its registers, a unique instruction set
architecture, and the VM's state transition function.

## Registers

In any CPU architecture, registers are small, high-speed storage locations that
hold the most immediately needed data for processing. The Cairo VM has three
dedicated registers that are used to manage the program's flow and memory
context. The state of the VM at any given moment is defined entirely by the
values of these three registers, which are part of the execution trace that gets
proven.

- The **`pc` (Program Counter)** holds the memory address of the next
  instruction to be fetched and executed. After most instructions, it is
  incremented to point to the subsequent one, but jump and call instructions can
  modify it directly to continue from a different instruction.
- The **`ap` (Allocation Pointer)** functions as a stack pointer, conventionally
  pointing to the next free (unwritten) memory cell. Many instructions increment
  `ap` by 1, but this is not typically enforced.
- The **`fp` (Frame Pointer)** provides a stable reference point for the current
  function's execution context, or "stack frame." When a function is called,
  `fp` is set to the current value of `ap`. This allows the function to reliably
  access its arguments and its return address, which are located at fixed
  negative offsets relative to `fp`, regardless of how many local variables are
  allocated on the stack using `ap`.

## Instructions and Opcodes

A Cairo **instruction** is the complete computational unit for a single step,
encoded as a 64-bit field element. This single word contains three 16-bit signed
offsets (`off_dst`, `off_op0`, `off_op1`) and 15 different boolean flags, used
to know which registers to use for addressing, what arithmetic operations to
perform, and how to update the `pc`, `ap`, and `fp` registers for the next
state.

The three offsets determine which memory cells the instruction reads/writes
relative to the registers. The 15 flags encode what operation to perform and how
to update registers. For example, flag groups include `dst_reg` (whether to
write the result to `fp`, `ap`, or `pc`), `op0_reg`/`op1_reg` (whether operands
come from `fp`, `ap`, or are immediate), arithmetic/logic operations, and
control for jumps.

While there are many different instructions in the Cairo VM, the VM itself only
supports three opcodes:

1.  **`CALL`**: Initiates a function call, saving the current context (`fp` and
    the return `pc`) to the stack.
2.  **`RET`**: Executes a function return, restoring the caller's context from
    the stack.
3.  **`ASSERT_EQ`**: Enforces an equality constraint.

## Cairo Assembly (CASM)

CASM is the human-readable assembly language for Cairo. It is the direct textual
representation of the machine's instructions. A developer writes logic in the
high-level Cairo language, and the compiler's final step is to translate this
logic into a sequence of CASM instructions. However, one can also write CASM
instructions by hand. Each valid line of CASM, such as `[fp + 1] = [ap - 2] + 5`
or `jmp rel 17 if [ap] != 0`, corresponds to a specific instruction.

## State Transition

The state of the Cairo VM at any step \(i\) is fully captured by the tuple
\((pc*i, ap_i, fp_i)\). The **state transition function** is the deterministic
set of rules that computes the next state, \((pc*{i+1}, ap*{i+1}, fp*{i+1})\),
based on the current state and the instruction fetched from memory. This process
perfectly mirrors the classic fetch-decode-execute cycle of a physical CPU.

The entire cycle, from fetching the instruction to asserting its correctness and
updating the registers, is a single, atomic step in the Cairo VM. This process
is part of what is encoded into the polynomial constraints of the Cairo AIR,
guaranteeing that every single step of a program's execution adheres to the
rules of the VM and can be proven.

Conceptually, each step checks one instruction and enforces its semantics as
algebraic constraints. For example, a typical instruction will load values from
memory at addresses `pc + off_op0` and `pc + off_op1` (relative to registers),
compute a result (add, multiply, sub), and then write it to memory at
`pc + off_dst`. It will also set the next `pc`, possibly increment `ap`, and
leave `fp` unchanged or restore it on return of a function call.

These rules are fully deterministic: given the current state and memory, there
is exactly one valid next state for the Cairo VM. The key point is that for
every instruction, there exists a set of algebraic constraints in the AIR that
must be satisfied. If at any step the constraints cannot be satisfied (for
example, the VM executes an illegal state transition), the execution cannot be
proven.

Conversely, if all steps pass, then, it is possible to generate a proof from
this execution.

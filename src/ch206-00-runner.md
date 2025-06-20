# Runner

The Cairo Runner is the main executable program that orchestrates the execution of a compiled Cairo program. It is the practical implementation of the theoretical Cairo machine, bringing together the memory model, execution model, builtins, and hints.

Its current implementation is written in Rust, developped by [LambdaClass](https://github.com/lambdaclass/cairo-vm) and it is available as a standalone binary, as well as a library.

## Runner Modes

The Cairo Runner can operate in different modes depending on the intended purpose of execution. It takes compiled Cairo bytecode (plus hints) and produces an execution trace and memory, preparing inputs for the STARK prover.

In **Execution Mode**, the runner simply runs the program to completion, executing hints and the state transition function of the Cairo VM. This mode is mostly useful to debug or test program logic without the overhead of proof generation. It fully executes the program step-by-step, using hints to fill in nondeterministic values and then applies each instruction's transitions to build the full state trace and final memory. The output includes the trace, the chosen memory, and the initial/final register states (`pc`, `ap`, `fp`). If any hint or instruction check fails, the runner halts with failure.

In **Proof Mode**, the runner not only executes the program but also prepares the inputs needed for proof generation. This is the primary mode for production use, when one wants to generate a proof of execution. As the runner executes the program, it records the VM state at each step, and builds the "execution trace" and final memory state. After the execution completes, it is possible to extract a dump of the memory, and the sequential register states, composing the execution trace.

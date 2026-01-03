# Hints

Cairo supports nondeterministic programming by allowing the prover to run extra
code to arbitrarily set values in memory during the execution of the program.
This mechanism is called "hints".

In practice, hints are mainly used to accelerate some operations that can be
verified for cheaper than they can be executed. For example, remember that our
ISA is primarily made of multiplication and addition. Computing the square root
of 25 using only field arithmetic, addition, and multiplication, would be very
expensive. However, it's trivial to ask the prover to fill the memory with the
expected result, that he can compute in any way that he wants, and simply
_constrain_ the result to be the square root of 25.

The important part here is the _constraint_: When we let the prover fill the
memory with random values, we need to ensure that the prover was honest when
filling this memory cell. Failing to do so would lead to an "underconstrained
program", which is a security issue, as the proof is no longer sound. In our
example of the square root, it is sufficient to constrain that, when squared,
the provided result is equal to 25.

This technique is widely used in the Cairo standard library for typical
operations, and provide a significiative advantage to the proving system.

Hints are not part of the proved trace, so any work they do is “free” from the
verifier’s perspective. Hints are typically written in any programming language,
since they are only used by the prover’s runner.

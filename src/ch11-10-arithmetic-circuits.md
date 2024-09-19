# Arithmetic Circuits

Arithmetic circuits are mathematical models used to represent polynomial computations. They are defined over a field (typically a finite field \\(F_p\\) where \\(p\\) is prime) and consist of:
- Input signals (values in the range \\([0, p-1]\\))
- Arithmetic operations (addition and multiplication gates)
- Output signals

Cairo supports emulated arithmetic circuits with modulo up to 384 bits.

This is especially useful for:
- Implementing verification for other proof systems
- Implementing cryptographic primitives
- Creating more low-level programs, with potential reduced overhead compared to standard Cairo constructs

## Implementing Arithmetic Circuits in Cairo

Cairo's circuit constructs are available in the `core::circuit` module of the corelib.

Arithmetic circuits consist of:
- Addition modulo \\(p\\): `AddMod` builtin
- Multiplication modulo \\(p\\): `MulMod` builtin

Because of the modulo properties, we can build four basic arithmetic gates:
- Addition: `AddModGate`
- Subtraction: `SubModGate`
- Multiplication: `MulModGate`
- Inverse: `InvModGate`

Let's create a circuit that computes \\(a \cdot (a + b)\\) over the BN254 prime field.

We start from the empty struct `CircuitElement<T>`.

The inputs of our circuit are defined as `CircuitInput`:

```cairo, noplayground
{{#rustdoc_include ../listings/ch11-advanced-features/listing_10_arithmetic_circuits/src/lib.cairo:inputs}}
```

We can combine circuit inputs and gates: `CircuitElement<a>` and `CircuitElement<b>` combined with an addition gate gives `CircuitElement<AddModGate<a, b>>`.

We can use `circuit_add`, `circuit_sub`, `circuit_mul` and `circuit_inverse` to directly combine circuit elements.
For \\(a * (a + b)\\), the description of our circuit is:

```cairo, noplayground
{{#rustdoc_include ../listings/ch11-advanced-features/listing_10_arithmetic_circuits/src/lib.cairo:description}}
```

Note that `a`, `b` and `add` are intermediate circuit elements and not specifically inputs or gates, which is why we need the distinction between the empty struct `CircuitElement<T>` and the circuit description specified by the type `T`.

The outputs of the circuits are defined as a tuple of circuit elements. It's possible to add any intermediate gates of our circuit, but we must add all gates with degree 0 (gates where the output signal is not used as input of any other gate).
In our case, we will only add the last gate `mul`:

```cairo, noplayground
{{#rustdoc_include ../listings/ch11-advanced-features/listing_10_arithmetic_circuits/src/lib.cairo:output}}
```

We now have a complete description of our circuit and its outputs.
We now need to assign a value to each input.
As circuits are defined with 384-bit modulus, a single `u384` value can be represented as a fixed array of four `u96`.
We can initialize \\(a\\) and \\(b\\) to respectively \\(10\\) and \\(20\\):

```cairo, noplayground
{{#rustdoc_include ../listings/ch11-advanced-features/listing_10_arithmetic_circuits/src/lib.cairo:instance}}
```

As the number of inputs can vary, Cairo use an accumulator and the `new_inputs` and `next` functions return a variant of the `AddInputResult` enum.

```cairo, noplayground
pub enum AddInputResult<C> {
    /// All inputs have been filled.
    Done: CircuitData<C>,
    /// More inputs are needed to fill the circuit instance's data.
    More: CircuitInputAccumulator<C>,
}
```

We have to assign a value to every input, by calling `next` on each `CircuitInputAccumulator` variant.
After the inputs initialization, by calling the `done` function we get the complete circuit `CircuitData<C>`, where `C` is a long type that encodes the entire circuit instance.

We then need to define what modulus our circuit is using (up to 384-bit modulus), by defining a `CircuitModulus`. We want to use BN254 prime field modulus:

```cairo, noplayground
{{#rustdoc_include ../listings/ch11-advanced-features/listing_10_arithmetic_circuits/src/lib.cairo:modulus}}
```

The last part is the evaluation of the circuit, i.e. the actual process of passing the input signals correctly through each gate described by our circuit and getting the values of each output gate.
We can evaluate and get the results for a given modulus as follows:

```cairo, noplayground
{{#rustdoc_include ../listings/ch11-advanced-features/listing_10_arithmetic_circuits/src/lib.cairo:eval}}
```

To retrieve the value of a specific output, we can use the `get_output` function on our results with the `CircuitElement` instance of the output gate we want. We can also retrieve any intermediate gate value as well.

```cairo, noplayground
{{#rustdoc_include ../listings/ch11-advanced-features/listing_10_arithmetic_circuits/src/lib.cairo:output_values}}
```

To recap, we did the following steps:
- Define Circuit Inputs
- Describe the circuit
- Specify the outputs
- Assign values to the inputs
- Define the modulus
- Evaluate the circuit
- Get the output values

And the full code is:

```cairo, noplayground
{{#rustdoc_include ../listings/ch11-advanced-features/listing_10_arithmetic_circuits/src/lib.cairo:full}}
```

## Arithmetic Circuits in Zero-Knowledge Proof Systems

In zero-knowledge proof systems, a prover creates a proof of computational statements, which a verifier can check without performing the full computation. However, these statements must first be converted into a suitable representation for the proof system.

### zk-SNARKs Approach

Some proof systems, like zk-SNARKs, use arithmetic circuits over a finite field \\(F_p\\). These circuits include constraints at specific gates, represented as equations:

\\[
  (a_1 \cdot s_1 + ... + a_n \cdot s_n) \cdot (b_1 \cdot s_1 + ... + b_n \cdot s_n) + (c_1 \cdot s_1 + ... + c_n \cdot s_n) = 0 \mod p
\\]
Where \\(s_1, ..., s_n\\) are signals, and \\(a_i, b_i, c_i\\) are coefficients.

A witness is an assignment of signals that satisfies all constraints in a circuit. zk-SNARK proofs use these properties to prove knowledge of a witness without revealing private input signals, ensuring the prover's honesty while preserving privacy.

Some work has already been done, such as [Garaga Groth16 verifier](https://felt.gitbook.io/garaga/deploy-your-snark-verifier-on-starknet/groth16/generate-and-deploy-your-verifier-contract)

### zk-STARKs Approach

STARKs (which Cairo uses) use an Algebraic Intermediate Representation (AIR) instead of arithmetic circuits. AIR describes computations as a set of polynomial constraints.

By allowing emulated arithmetic circuits, Cairo can be used to implement zk-SNARKs proof verification inside STARK proofs.

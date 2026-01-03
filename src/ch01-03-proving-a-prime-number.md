# Proving That A Number Is Prime

Let’s dive into Cairo by working through a hands-on project together! This
section introduces you to key Cairo concepts and the process of generating
zero-knowledge proofs locally, a powerful feature enabled by Cairo in
combination with the [Stwo prover][stwo]. You’ll learn about functions, control
flow, executable targets, Scarb workflows, and how to prove a statement — all
while practicing the fundamentals of Cairo programming. In later chapters, we’ll
explore these ideas in more depth.

For this project, we’ll implement a classic mathematical problem suited for
zero-knowledge proofs: proving that a number is prime. This is the ideal project
to introduce you to the concept of zero-knowledge proofs in Cairo, because while
_finding_ prime numbers is a complex task, _proving_ that a number is prime is
straightforward.

Here’s how it works: the program will take an input number from the user and
check whether it’s prime using a trial division algorithm. Then, we’ll use Scarb
to execute the program and generate a proof that the primality check was
performed correctly, so that anyone can verify your proof to trust that you
found a prime number. The user will input a number, and we’ll output whether
it’s prime, followed by generating and verifying a proof.

## Setting Up a New Project

To get started, ensure you have Scarb 2.13.1 or later installed (see
[Installation][installation] for details). We’ll use Scarb to create and manage
our Cairo project.

Open a terminal in your projects directory and create a new Scarb project:

```bash
scarb new prime_prover
cd prime_prover
```

The scarb new command creates a new directory called `prime_prover` with a basic
project structure. Let’s examine the generated Scarb.toml file:

<span class="filename">Filename: Scarb.toml</span>

```toml
[package]
name = "prime_prover"
version = "0.1.0"
edition = "2024_07"

[dependencies]

[dev-dependencies]
cairo_test = "2.13.1"
```

This is a minimal manifest file for a Cairo project. However, since we want to
create an executable program that we can prove, we need to modify it. Update
Scarb.toml to define an executable target and include the `cairo_execute`
plugin:

<span class="filename">Filename: Scarb.toml</span>

```toml
{{#include ../listings/ch01-getting-started/prime_prover/Scarb.toml}}
```

Here’s what we’ve added:

- `[[target.executable]]` specifies that this package compiles to a Cairo
  executable (not a library or Starknet contract).
- `[cairo] enable-gas = false` disables gas tracking, which is required for
  executable targets since gas is specific to Starknet contracts.
  `[dependencies] cairo_execute = "2.13.1"` adds the plugin needed to execute
  and prove our program.

Now, check the generated `src/lib.cairo`, which is a simple placeholder. Since
we’re building an executable, we’ll replace this with a function annotated with
`#[executable]` to define our entry point.

## Writing the Prime-Checking Logic

Let’s write a program to check if a number is prime. A number is prime if it’s
greater than 1 and divisible only by 1 and itself. We’ll implement a simple
trial division algorithm and mark it as executable. Replace the contents of
`src/lib.cairo` with the following:

<span class="filename">Filename: src/lib.cairo</span>

```cairo
{{#include ../listings/ch01-getting-started/prime_prover/src/lib.cairo}}
```

Let’s break this down:

The `is_prime` function:

- Takes a `u32` input (an unsigned 32-bit integer) and returns a `bool`.
- Checks edge cases: numbers ≤ 1 are not prime, 2 is prime, even numbers > 2 are
  not prime.
- Uses a loop to test odd divisors up to the square root of `n`. If no divisors
  are found, the number is prime.

The `main` function:

- Marked with `#[executable]`, indicating it’s the entry point for our program.
- Takes a u32 input from the user and returns a bool indicating whether it’s
  prime.
- Calls is_prime to perform the check.

This is a straightforward implementation, but it’s perfect for demonstrating
proving in Cairo.

## Executing the Program

Now let’s run the program with Scarb to test it. Use the scarb execute command
and provide an input number as an argument:

```bash
scarb execute -p prime_prover --print-program-output --arguments 17
```

- `-p prime_prover` specifies the package name (matches Scarb.toml).
- `--print-program-output` displays the result.
- `--arguments 17` passes the number 17 as input.

You should see output like this:

```bash
{{#include ../listings/ch01-getting-started/prime_prover/output.txt}}
```

The output represents whether the program executed successfully and the result
of the program. Here, `0` indicates success (no panic), and `1` represents true
(17 is prime). Try a few more numbers:

```bash
$ scarb execute -p prime_prover --print-program-output --arguments 4
[0, 0]  # 4 is not prime
$ scarb execute -p prime_prover --print-program-output --arguments 23
[0, 1]  # 23 is prime
```

The execution creates a folder under `./target/execute/prime_prover/execution1/`
containing files like `air_public_input.json`, `air_private_input.json`,
`trace.bin`, and `memory.bin`. These are the artifacts needed for proving.

## Generating a Zero-Knowledge Proof

Now for the exciting part: proving that the primality check was computed
correctly without revealing the input! Cairo 2.10 integrates the Stwo prover via
Scarb, allowing us to generate a proof directly. Run:

```bash
{{#include ../listings/ch01-getting-started/prime_prover/output_prove.txt}}
```

`--execution_id 1` points to the first execution (from the `execution1` folder).

This command generates a `proof.json` file in
`./target/execute/prime_prover/execution1/proof/`. The proof demonstrates that
the program executed correctly for some input, producing a true or false output.

## Verifying the Proof

To ensure the proof is valid, verify it with:

```bash
{{#include ../listings/ch01-getting-started/prime_prover/output_verify.txt}}
```

If successful, you’ll see a confirmation message. This verifies that the
computation (primality check) was performed correctly, aligning with the public
inputs, without needing to re-run the program.

## Improving the Program: Handling Input Errors

Currently, our program assumes the input is a valid `u32`. What if we want to
handle larger numbers or invalid inputs? Cairo’s `u32` has a maximum value of
`2^32 - 1 (4,294,967,295)`, and inputs must be provided as integers. Let’s
modify the program to use `u128` and add a basic check. Update `src/lib.cairo`:

<span class="filename">Filename: src/lib.cairo</span>

```cairo
{{#include ../listings/ch01-getting-started/prime_prover2/src/lib.cairo}}
```

Changed `u32` to `u128` for a larger range (up to `2^128 - 1`). Added a check to
panic if the input exceeds 1,000,000 (for simplicity; adjust as needed). Test
it:

```bash
{{#include ../listings/ch01-getting-started/prime_prover2/output.txt}}
```

If we pass a number greater than 1,000,000, the program will panic - and thus,
no proof can be generated. As such, it's not possible to verify a proof for a
panicked execution.

## Summary

Congratulations! You’ve built a Cairo program to check primality, executed it
with Scarb, and generated and verified a zero-knowledge proof using the Stwo
prover. This project introduced you to:

- Defining executable targets in Scarb.toml.
- Writing functions and control flow in Cairo.
- Using `scarb execute` to run programs and generate execution traces.
- Proving and verifying computations with `scarb prove` and `scarb verify`.

In the next chapters, you’ll dive deeper into Cairo’s syntax (Chapter
{{#chap common-programming-concepts}}), ownership (Chapter
{{#chap understanding-ownership}}), and other features. For now, experiment with
different inputs or modify the primality check — can you optimize it further?

[installation]: ./ch01-01-installation.md
[stwo]: https://github.com/starkware-libs/stwo

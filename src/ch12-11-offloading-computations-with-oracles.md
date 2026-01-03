# Offloading Computations with Oracles

In this chapter, we’ll build a small Cairo executable that asks an external
helper (an “oracle”) to do some work and then constrains the returned values
inside Cairo so they become part of the proof. Along the way, you’ll learn what
oracles are, why they fit naturally in Cairo’s non‑deterministic machine, and
how to use them safely.

Oracles are an experimental Scarb feature available for Cairo executables
executed with `--experimental-oracles`. They are not available inside Starknet
contracts.

> Note: This "oracle" system is not related to Smart Contract Oracles; but the
> concept is similar: using an external process to query data in a constrained
> system.

## Why use Oracles?

When the Cairo VM runs, oracles allow the prover to assign arbitrary values to
memory cells. This non‑determinism lets us "inject" values that come from the
outside world. For example, to prove we know \\(\sqrt{25}\\), we don't need to
implement a square‑root algorithm in Cairo; we can obtain \\(5\\) from an oracle
and trivially assert \\(5 \cdot 5 = 25\\).

If you’re curious about the underlying memory model, see
[Non‑Deterministic Read‑Only Memory](./ch202-01-non-deterministic-read-only-memory.md).

## What We’ll Build

We’ll create two pieces that work together:

- A Cairo executable that calls two oracle endpoints: one that returns the
  integer square root of a number and one that decomposes a number into
  little‑endian bytes. After each call, we’ll assert properties that must hold
  in order for the soundness properties of the program to be preserved.
- A Rust process that implements those endpoints and communicates with Cairo
  over standard input/output via JSON‑RPC (the `stdio:` protocol supported by
  Scarb’s executor).

We prepared a complete example under `listing_oracles/`. We’ll walk through the
important files and then run it.

## The Cairo Package

First, let’s look at the manifest. We declare an executable package, depend on
`cairo_execute` so we can run with Scarb, and add the `oracle` crate to access
`oracle::invoke`.

<span class="caption">Filename: listing_oracles/Scarb.toml</span>

```toml
{{#include ../listings/ch12-advanced-features/listing_oracles/Scarb.toml}}
```

Now let’s see how we call the oracle from Cairo. We define two helper functions
that forward to the Rust oracle using a connection string of the form
`stdio:...`, then we assert relationships that make the returned values part of
the proof.

<span class="caption">Filename: listing_oracles/src/lib.cairo</span>

```cairo
{{#include ../listings/ch12-advanced-features/listing_oracles/src/lib.cairo}}
```

There are two important ideas here:

1. We call out to the oracle with
   `oracle::invoke(connection, selector, inputs_tuple)`. The `connection` tells
   Scarb how to spawn the process (here, a Cargo command over `stdio:`), the
   `selector` picks the endpoint by name, and the tuple contains the inputs. The
   return type is `oracle::Result<T>`, so we handle errors explicitly.
2. We immediately constrain whatever came back from the oracle. For the square
   root, we assert `sqrt * sqrt == x`. For the byte decomposition, we recompute
   the value from its bytes and assert it equals the original number. These
   assertions are what turn injected values into sound witness data. It's very
   important to properly constrain the returned values; otherwise, a malicious
   prover could inject arbitrary values into memory, and forge arbitrary valid
   ZK-Proofs.

## The Rust Oracle

On the Rust side, we implement the endpoints and let a helper crate
(`cairo_oracle_server`) handle the plumbing. Inputs are decoded automatically;
outputs are encoded back to Cairo.

<span class="caption">Filename: listing_oracles/src/my_oracle/Cargo.toml</span>

```toml
{{#include ../listings/ch12-advanced-features/listing_oracles/src/my_oracle/Cargo.toml}}
```

<span class="caption">Filename: listing_oracles/src/my_oracle/src/main.rs</span>

```rust, noplayground
{{#include ../listings/ch12-advanced-features/listing_oracles/src/my_oracle/src/main.rs}}
```

The `sqrt` endpoint returns the integer square root and rejects values that
don’t have an exact square root. The `to_le_bytes` endpoint returns the
little‑endian byte decomposition of a `u64`.

## Running the Example

From the example directory, execute the program with oracles enabled:

```bash
scarb execute --experimental-oracles --print-program-output --arguments 25000000
```

You’ll see the program returning `1`, indicating success. The Cairo code asked
the oracle for `sqrt(25000000)`, verified that `5000 * 5000 == 25000000`, then
decomposed `25000000` into bytes and verified that recomposing them equals the
original input.

Try a value that isn’t a perfect square, such as `27`:

```bash
scarb execute --experimental-oracles --print-program-output --arguments 27
```

The `sqrt` endpoint will return an error, because `27` has no integer square
root, which propagates back to Cairo. Our program panics.

## A Quick Look at the API

All oracle interactions go through a single function on the Cairo side:

```text
oracle::invoke(connection: felt252*, selector: felt252*, inputs: (..)) -> oracle::Result<T>
```

The connection string selects the transport and the process to run (here,
`stdio:` plus a Cargo command). The selector is the endpoint name you provided
in Rust (for example, `'sqrt'`). The inputs are a Cairo tuple matching the Rust
handler’s parameters. The return type is `oracle::Result<T>`, so you can handle
errors with `match`, `unwrap_or`, or custom logic.

## Summary

You now have a working example showing how to offload work to an external
process and make the results part of a Cairo proof. Use this pattern when you
want fast, flexible helpers during client‑side proving, and remember: oracles
are experimental, runner‑only, and everything that comes from them must be
validated by your Cairo code.

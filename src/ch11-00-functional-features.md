# Functional Language Features: Iterators and Closures

Cairo’s design has taken strong inspiration from Rust, which itself has taken
inspiration from many existing languages and techniques, and one significant
influence is _functional programming_. Programming in a functional style often
includes using functions as values by passing them in arguments, returning them
from other functions, assigning them to variables for later execution, and so
forth.

In this chapter, we won’t debate the issue of what functional programming is or
isn’t but will instead discuss some features of Cairo that are similar to
features in Rust and many languages often referred to as functional.

More specifically, we’ll cover:

- _Closures_, a function-like construct you can store in a variable
- _Iterators_, a way of processing a series of elements
  <!-- * How to use closures and iterators to improve the I/O project in Chapter 12
  <!-- ^TODO: once we have a hands-on, pure cairo project, we can add this -->
  <!-- * The performance of closures and iterators (Spoiler alert: they’re faster than
    you might think!) --> -->
  <!-- ^TODO: once closures and iterators become more widespread and show consequent performance gains. -->

We’ve already covered some other Cairo features, such as pattern matching and
enums, that are also influenced by the Rust and the functional style. Because
mastering closures and iterators is an important part of writing idiomatic, fast
Cairo code, we’ll devote this entire chapter to them.

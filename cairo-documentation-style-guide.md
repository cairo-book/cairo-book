<!-- omit in toc -->

# Cairo Documentation Style Guide

_Inspired by the [Rust Documentation Style Guide](https://github.com/esp-rs/book/blob/main/rust-doc-style-guide.md#rust-documentation-style-guide)_

As [The Rust RFC Book](https://rust-lang.github.io/rfcs/2436-style-guide.html#drawbacks) states:

> One can level some criticisms at having a style guide:
>
> - It is bureaucratic, gives developers more to worry about, and crushes creativity.
> - There are edge cases where the style rules make code look worse (e.g., around FFI).
>
> However, these are heavily out-weighed by the benefits.

The style guide is based on the best practices collected from the following books:

- [The Rust Programming Language](https://doc.rust-lang.org/book/foreword.html)
- [The Embedded Rust Book](https://docs.rust-embedded.org/book/intro/index.html)
- [The rustup book](https://rust-lang.github.io/rustup/installation/windows.html)
- [The Cargo Book](https://doc.rust-lang.org/cargo/reference/specifying-dependencies.html)
- [The rustc book](https://doc.rust-lang.org/nightly/rustc/targets/index.html)
- [The Rust on ESP Book](https://esp-rs.github.io/book/)

<!-- omit in toc -->

## Contents of This Style Guide

- [Heading Titles](#heading-titles)
  - [Capitalization](#capitalization)
- [Linking](#linking)
  - [Adding Links](#adding-links)
  - [Formatting](#formatting)
- [Lists](#lists)
  - [Types](#types)
  - [Formatting](#formatting-1)
- [Using `monospace`](#using-monospace)
  - [Monospace and Other Types of Formatting](#monospace-and-other-types-of-formatting)
- [Using _Italics_](#using-italics)
- [Mode of Narration](#mode-of-narration)
- [Terminology](#terminology)
  - [Recommended Terms](#recommended-terms)
- [Admonitions](#admonitions)
- [Appendix A: Existing Style Guides](#appendix-a-existing-style-guides)
  - [Documentation](#documentation)
  - [Code](#code)

## Heading Titles

The Cairo Book usually have heading titles based on nouns or gerunds:

> **Design Patterns** > **Using Structs to Structure Related Data**

### Capitalization

In heading titles, capitalize the first letter of every word **except for**:

- Articles (a, an, the); unless an article is the first word.

  > **Defining an Enum**

- Coordinating conjunctions (and, but, for, or, nor).

  > **Generic Types and Traits**

  > **Packages and Crates**

- Prepositions of _four_ letters or less, unless these prepositions are the first or last words. Prepositions of _five_ letters and above should be capitalized (Before, Through, Versus, Among, Under, Between, Without, etc.).

  > **Using Structs to Structure Related Data**

  > **Components: Under the Hood**

Do not capitalize names of functions, commands, packages, websites, etc.

> **What is `assert`**

> **Bringing Paths into Scope with the `use` Keyword**

See also, the [Using `monospace`](#using-monospace) section.

In hyphenated words, do not capitalize the parts following the hyphens.

> **Built-in Targets**

> **Allowed-by-default Lints**

## Linking

### Adding Links

To simplify link maintenance, follow the rules below:

- Use [link variables][stackoverflow-link-var] with variable names that give a clue on where the link leads.
- Define link variables right before the end of the section/subsection where they are used.

[stackoverflow-link-var]: https://stackoverflow.com/a/27784490/10308406

Example:

```md
[`scarb`][scarb-github] Scarb bundles the Cairo compiler and the Cairo language server together in an easy-to-install package so that you can start writing Cairo code right away.

[scarb-github]: https://github.com/software-mansion/scarb
```

### Formatting

The Cairo Book usually uses the following link formatting:

- Make intra-book links relative, so they work both online and locally.

- Do NOT turn long phrases into links.

  > ❌ See the [Cairo Reference’s section on constant evaluation](https://book.cairo-lang.org/ch02-01-variables-and-mutability.html) for more information on what operations can be used when declaring constants.

Also, consider the following:

- Do not provide a link to the same location repeatedly in the same or adjacent paragraphs without a good reason, especially using different link text.
- Do not use the same link text to refer to different locations.

  > `scarb` might have a section in a book and a github repo. In this case, see the [`scarb`](https://book.cairo-lang.org/ch01-01-installation.html) section and [`scarb` repo](https://github.com/software-mansion/scarb).

See also, the [Using `monospace`](#using-monospace) section.

## Lists

### Types

The following types of lists are usually used in documentation:

- **Bullet list** -- use it if the order of items is not important
- **Numbered list** -- use it if the order of items is important, such as when describing a process
  - **Procedure** -- special type of numbered list that gives steps to achieve some goal (to achieve this, do this); for an example of a procedure, see the [Usage](https://doc.rust-lang.org/nightly/rustc/profile-guided-optimization.html#usage) section in The rustc book.

### Formatting

The Cairo Book usually uses the following list formatting:

- Finish an introductory sentence with a dot.
- Capitalize the first letter of each bullet point.
- If a bullet point is a full sentence, you can end it with a full stop.
- If a list has at least one full stop, end all other list items with a full stop.

  > A crate is a subset of a package that is used in the actual Cairo compilation. This includes:
  >
  > - The package source code, identified by the package name and the crate root, which is the main entry point of the package.
  > - A subset of the package metadata that identifies crate-level settings of the Cairo compiler, for example, the edition field in the Scarb.toml file.

- For longer list items, consider using a summary word of phrase to make content [scannable](https://learn.microsoft.com/en-us/style-guide/scannable-content/).

  > If you run Windows on your host machine, make sure ...
  >
  > - **MSVC**: Recommended ABI, included in ...
  > - **GNU**: ABI used by the GCC toolchain ...

  - For an example using bold font, see the list in the [Modules Cheat Sheet](https://book.cairo-lang.org/ch07-02-defining-modules-to-control-scope.html#modules-cheat-sheet) section in The Cairo Programming Language book.
  - For an example using monospace font, see the [Appendix A](https://book.cairo-lang.org/appendix-01-keywords.html#strict-keywords) section in The Cairo Book.

## Using `monospace`

Use monospace font for the following items:

- Code snippets

  - Start the terminal commands with `$`
  - Output of previous commands should not start with `$`
  - Use `bash` syntax highlighting

- Cairo declarations: commands, functions, arguments, parameters, flags, variables
- In-line command line output

  > Writing a program that prints `Hello, world!`

- Data types: `u8`, `u128`, etc
- Names of crates, traits, libraries
- Command line tools, plugins, packages

### Monospace and Other Types of Formatting

Monospace font can also be used in:

- Links

  > [`ByteArray`](./src/ch02-02-data-types.md#byte-array-strings) is a string type provided by ...

- Headings

  > **Serializing with `Serde`**

- Important information, notes...

  > **Note: This program would not compile without a break condition. For the purpose of the example, we added a `break` statement that will never be reached, but satisfies the compiler.**

## Using _Italics_

- Introduce new terms

  > Enums, short for "enumerations," are a way to define a custom data type that consists of a fixed set of named values, called _variants_.

- Emphasize important concepts or words

  > we create an _instance_ of that struct by specifying concrete values for each of the fields

## Mode of Narration

- Use _the first person_ (we) when introducing a tutorial or explaining how things will be done. The reader will feel like being on the same team with the authors working side by side.

  > We have just created a file called lib.cairo, which contains a module declaration referencing another module named hello_world, as well as the file hello_world.cairo, containing the implementation details of the hello_world module.

- Use _the second person_ (you) when describing what the reader should do while installing software, following a tutorial or a procedure. However, in most cases you can use imperative mood as if giving orders to the readers. It makes instructions much shorter and clearer.

  > 1\. Create a new project using `scarb`
  >
  > `scarb new hello_world`
  >
  > 2\. Go into the _hello_world_ directory with the command cd hello_world
  >
  > `cd hello_world`

- Use _the third person_ (the user, it) when describing how things work from the perspective of hardware or software.

  > Cairo uses an immutable memory model, meaning that once a memory cell is written to, it can't be overwritten but only read from. To reflect this immutable memory model, variables in Cairo are immutable by default.

## Terminology

This chapter lists the terms that have inconsistencies in spelling, usage, etc.

If you spot other issues with terminology, please add the terms here in alphabetical order using the formatting as follows:

- _Recommended term_
  - Avoid: Add typical phrases in which this term is found
  - Use: Add recommended phrases
  - Note: Add more information if needed

### Recommended Terms

- _Scarb_
  - Note: always use uppercase _S_, unless referring to the command `scarb`
- _VS Code_
  - Use VS Code by default
  - Use only if necessary: Visual Studio Code

## Admonitions

Use the following formatting for notes and warnings:

- Note

  > ⚠️ **Note**: A note covering an important point or idea. Use sparingly or the readers will start ignoring them.

- Warning

  > 🚨 **Warning**: Use in critical circumstances only, e.g., for security risks or actions potentially harmful to users, etc.

In markdown:

```md
> ⚠️ **Note**: Write your note.
```

## Appendix A: Existing Style Guides

### Documentation

- [The Rust Programming Language Style Guide](https://github.com/rust-lang-ja/book-ja/blob/master-ja/style-guide.md)

### Code

- [Style Guidelines](https://doc.rust-lang.org/1.0.0/style/README.html)
- [The Rust RFC Book](https://rust-lang.github.io/rfcs/2436-style-guide.html) chapter _Style Guide_
- [Rust API Guidelines](https://rust-lang.github.io/api-guidelines/)
- [Rust Style Guide](https://riptutorial.com/rust/topic/4620/rust-style-guide) (riptutorial.com)
- [Rust Style Guide](https://github.com/rust-lang/rust/blob/master/src/doc/style-guide/src/principles.md) (github.com/rust-lang)

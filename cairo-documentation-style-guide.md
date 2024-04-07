<!-- omit in toc -->
# Cairo Documentation Style Guide

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
- [Appendix A Existing Style Guides](#appendix-a-existing-style-guides)
  - [Documentation](#documentation)
  - [Code](#code)

## Heading Titles

The Cairo Book usually have heading titles based on nouns or gerunds:

> **Design Patterns**<br>
> **Using Structs to Structure Related Data**

### Capitalization

In heading titles, capitalize the first letter of every word **except for**:

- Articles (a, an, the); unless an article is the first word.

  > **Defining an Enum**<br>
  > **Generic Types and Traits**

- Coordinating conjunctions (and, but, for, or, nor).

  > **Packages and Crates**

- Prepositions of four letters or less; unless these prepositions are the first or last words.
  - Prepositions of _five_ letters and above should be capitalized (Before, Through, Versus, Among, Under, Between, Without, etc.).

  > **Peripherals as State Machines**

Do not capitalize names of functions, commands, packages, websites, etc.

> **What is `assert`**<br>
> **Publishing on crates.io**

See also, the [Using `monospace`](#using-monospace) section.

In hyphenated words, do not capitalize the parts following the hyphens.

> **Built-in Targets**<br>
> **Allowed-by-default Lints**

### Formatting

The Cairo Book usually use the following link formatting:

> Instead, you must define a [Trait](https://book.cairo-lang.org/ch08-02-traits-in-cairo.html) and a, ...

- Make intra-book links relative, so they work both online and locally

Do NOT turn long phrases into links

  > ❌ See the [Cairo Reference’s section on constant evaluation](https://book.cairo-lang.org/ch02-01-variables-and-mutability.html) for more information on what operations can be used when declaring constants.

Also, consider the following:

- Do not provide a link to the same location repeatedly in the same or adjacent paragraphs without a good reason, especially using different link text.
- Do not use the same link text to refer to different locations.

  > `scarb` might have a section in a book and a github repo. In this case, see the [`scarb`](https://book.cairo-lang.org/ch01-01-installation.html) section and [`scarb` repo](https://github.com/software-mansion/scarb).

See also, the [Using `monospace`](#using-monospace) section.

## Lists

### Types

The following types of lists are usually used in documentation:

- **Bullet list** -- use it if the order or items is not important

### Formatting

The Cairo Book usually use the following list formatting:

- Finish an introductory sentence with a dot.
- Capitalize the first letter of each bullet point.

  > - The package source code, identified by the package name and the crate root, which is the main entry point of the package.
  > - A subset of the package metadata that identifies crate-level settings of the Cairo compiler, for example, the edition field in the Scarb.toml file.

- If a bullet point is a full sentence, you can end it with a full stop.
- If a list has at least one full stop, end all other list items with a full stop.

  > To reliably interact with these peripherals:
  >
  > - Always use `volatile` methods to read or write to peripheral memory, as it can change at any time.
  > - In software, we should be able to share any number of read-only accesses to these peripherals.
  > - If some software should have read-write access to a peripheral, it should hold the only reference to that peripheral.

- For longer list items, consider using a summary word of phrase to make content [scannable](https://learn.microsoft.com/en-us/style-guide/scannable-content/).

  > If you run Windows on your host machine, make sure ...
  >
  > - **MSVC**: Recommended ABI, included in ...
  > - **GNU**: ABI used by the GCC toolchain ...

  -  For an example using bold font, see the list in the [Modules Cheat Sheet](https://doc.rust-lang.org/book/ch07-02-defining-modules-to-control-scope-and-privacy.html#modules-cheat-sheet) section in The Rust Programming Language book.
  -  For an example using monospace font, see the [Panicking](https://docs.rust-embedded.org/book/start/panicking.html#panicking) section in The Embedded Rust Book.

## Using `monospace`

Use monospace font for the following items:

- Code snippets

  The [Installation](https://book.cairo-lang.org/ch01-01-installation.html) chapter in the Cairo Programming Language book suggests:

  [The Rust Programming Language](https://github.com/rust-lang-ja/book-ja/blob/master-ja/style-guide.md) book also suggests:

  - Use `bash` syntax highlighting

- Cairo declarations: commands, functions, arguments, parameters, flags, variables
- In-line command line output

  > Writing a program that prints `Hello, world!`

- Data types: `u8`, `u128`

### Monospace and Other Types of Formatting

Monospace font can also be used in:

- headings

  > **Serializing with `Serde`**

- Important information, notes...

  > **Serializing with `Serde`**

## Using _Italics_

- Introduce new terms

  > Enums, short for "enumerations," are a way to define a custom data type that consists of a fixed set of named values, called _variants_.

- Emphasize important concepts or words

  > we create an _instance_ of that struct by specifying concrete values for each of the fields

- Do NOT use italics with Espressif product names, such as ESP32.

## Mode of Narration

- Use _the first person_ (we) when introducing a tutorial or explaining how things will be done. The reader will feel like being on the same team with the authors working side by side.

  > We have just created a file called lib.cairo, which contains a module declaration referencing another module named hello_world, as well as the file hello_world.cairo, containing the implementation details of the hello_world module.

- Use _the second person_ (you) when describing what the reader should do while installing software, following a tutorial or a procedure. However, in most cases you can use imperative mood as if giving orders to the readers. It makes instructions much shorter and clearer.

  > 1\. Create a new project using `scarb`
  >
  > `scarb new hello_world`
  >
  > 2\. Go into the hello_world directory with the command cd hello_world.
  >
  > `cd hello_world`

- Use _the third person_ (the user, it) when describing how things work from the perspective of hardware or software

  > A driver has to be initialized with an instance of type that implements a certain `trait` of the embedded-hal which is ensured via trait bound and provides its own type instance with a custom set of methods allowing to interact with the driven device.

## Terminology

This chapter lists the terms that have inconsistencies in spelling, usage, etc.

If you spot other issues with terminology, please add the terms here in alphabetical order using the formatting as follows:

- _Recommended term_
  - Avoid: Add typical phrases in which this term is found
  - Use: Add recommended phrases
  - Note: Add more information if needed

### Recommended Terms

- _Scarb_
  - Note: always use uppercase _S_
- _VS Code_
  - Use VS Code by default
  - Use only if necessary: Visual Studio Code

## Admonitions

Use the following formatting for notes and warnings:

- Note

  > ⚠️ **Note**: A note covering an important point or idea. Use sparingly or the readers will start ignoring them.

- Warning

  > 🚨 **Warning**: Use in critical circumstances only, e.g., for irreversible actions or actions potentially harmful to hardware, software, etc.

In markdown:

```md
> ⚠️ **Note**: Write your note.
```

### Documentation

- [The Rust Programming Language Style Guide](https://github.com/rust-lang-ja/book-ja/blob/master-ja/style-guide.md)

### Code

- [Style Guidelines](https://doc.rust-lang.org/1.0.0/style/README.html)
- [The Rust RFC Book](https://rust-lang.github.io/rfcs/2436-style-guide.html), chapter _Style Guide_
- [Rust API Guidelines](https://rust-lang.github.io/api-guidelines/)
- [Rust Style Guide](https://riptutorial.com/rust/topic/4620/rust-style-guide) (riptutorial.com)
- [Rust Style Guide](https://github.com/rust-lang/style-team/blob/master/guide/guide.md) (github.com/rust-lang)


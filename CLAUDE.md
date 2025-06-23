# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Prerequisites & Setup

Required tools:

- **mdBook**: `cargo install mdbook`
- **scarb**: v2.11.4 (via asdf: `asdf install`)
- **starknet-foundry**: v0.44.0 (via asdf)
- **mdbook-cairo**: Custom preprocessor (install via `cargo install --git https://github.com/enitrat/mdbook-cairo`)
- **cairo-listings**: Verification tool (install via `cargo install --git https://github.com/enitrat/cairo-listings --locked`)
- **typos-cli**: Spell checker (`cargo install typos-cli`)
- **bun** (optional): For helper scripts

## Build, Lint & Test Commands

- Build project: `mdbook build`
- Start local server: `mdbook serve [--open]`
- Format all code: `cairo-listings format`
- Generate all code outputs: `cairo-listings output`.
- Verify Cairo programs: `cairo-listings verify` - this will run `scarb build` and `scarb test` for all programs in the `listings` directory, so it can be quite long. If you want to verify a specific program, you can navigate to the directory and run `scarb` commands.
- Test individual Cairo programs: `scarb test [test_name]`
- Format Cairo code: `scarb fmt`
- Check formatting: `scarb fmt -c`
- Running a specific program: `scarb execute`
- Check for typos: `typos`

## Book Structure

The book is structured in the following way:

- `src/`: The main book content - this is where you should write the book. Don't write code examples here, use `listings/` for that, and then refer to the listing using mdbook's `{{#include <filename>}}` or `{{#rustdoc_include <filename>}}` (if referring to specific Anchor tags) macros.
- `listings/`: Code listings for the book. Each listing is a specific Scarb package. To create a new listing, navigate to the proper `listings/ch-name` and run `scarb new <listing-name>`. Create the package with the Starknet Foundry template. Instantly delete the created `package_name/.git` directory.
- `scripts/`: Helper scripts for the book.
- `book.toml`: The book configuration file.
- `SUMMARY.md`: The book summary file. Table of Content for the book. All pages of the book must be referenced there.
- `README.md`: The book README file.
- `quizzes/`: Quiz questions for the book. They can be embedded in the book using the `{{#quiz}}` macro.

## Code Style Guidelines

- **Naming**: Use `snake_case` for functions/variables, `PascalCase` for types/traits
- **Formatting**: All Cairo files must pass `cairo-listings format`
- **Imports**: Group imports by origin (core, external, internal)
- **Error Handling**: Use `Result` for recoverable errors, `panic!` for unrecoverable ones
- **Documentation**: Use doc comments (`///` for items, `//!` for modules)
- **Testing**: Place tests in a `#[cfg(test)]` module, use `#[test]` attribute
- **Code Organization**: Use ANCHOR/ANCHOR_END tags to mark sections for inclusion
- **TAG Comments**: Use TAG comments for special handling by the build tools
- **Traits**: Separate trait definitions from implementations
- **Storage**: Follow Starknet patterns for contract storage access

### TAG Comment System

- `// TAG: does_not_compile` - Code that intentionally doesn't compile
- `// TAG: does_not_run` - Code that compiles but doesn't run
- `// TAG: ignore_fmt` - Skip formatting for this file
- `// TAG: tests_fail` - Tests that are expected to fail

## Book Guidelines

- **Book Structure**:
  - The structure is defined in `SUMMARY.md`
  - The markdown files are located in `src` and there is a single nesting level.
  - The files are named like `ch01-getting-started.md`. Sub-chapters are named like `ch01-01-introduction.md`.
- **Code Blocks**:

  - All code blocks should have a language specified.
  - Example:

  ```cairo

  ```

  - The content of code blocks should be a {{#include <filename>}} macro, where filename is the path to the code to embed.
  - Example:

  ```md
  {{#include ../listings/ch01-getting-started/prime_prover/src/lib.cairo}}
  ```

- **Documentation style**:
  - Use the [Cairo Documentation Style Guide](./cairo-documentation-style-guide.md)
  - Follow markdown formatting rules
  - Always base the writing style on the existing book.

### Content Requirements

- Each concept must have runnable or illustrative code examples
- Use simple, clear language appropriate for beginners
- Include relevant diagrams when explaining complex concepts
- Provide exercises and quizzes for reader engagement
- Cross-reference related sections using mdBook's label/ref system

## Helper Scripts

Located in `scripts/` directory:

- Utility scripts for book maintenance
- Build automation tools
- Content validation scripts

## CI/CD Workflow

GitHub Actions automatically:

- Builds and tests the book on PRs
- Verifies all Cairo code examples compile
- Runs formatting checks
- Deploys to GitHub Pages on main branch merges
- Checks for spelling errors with typos

## mdBook Configuration

Key settings from `book.toml`:

- Output directory: `book/`
- Default theme with custom CSS/JS
- Multiple preprocessors for Cairo-specific features
- Internationalization support enabled

## Important Instruction Reminders

Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (\*.md) or README files. Only create documentation files if explicitly requested by the User.

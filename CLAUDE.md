# CLAUDE.md

Guidance for Claude Code when working with this repository.

## Quick Reference

| Task                  | Command                                 |
| --------------------- | --------------------------------------- |
| Build book            | `mdbook build`                          |
| Serve locally         | `mdbook serve --open`                   |
| Verify all Cairo code | `cairo-listings verify`                 |
| Format Cairo code     | `cairo-listings format`                 |
| Generate outputs      | `cairo-listings output`                 |
| Check typos           | `typos`                                 |
| Test specific listing | `cd listings/ch*/name && scarb test`    |
| Run specific listing  | `cd listings/ch*/name && scarb execute` |

## Project Structure

```
src/                    → Markdown content (DO NOT put code here)
listings/               → Cairo code examples (Scarb packages)
quizzes/                → Quiz TOML files
theme/                  → Custom JS/CSS for website
scripts/                → Helper scripts
docs/                   → Developer documentation
src/SUMMARY.md          → Table of contents (defines book structure)
book.toml               → mdBook configuration
.tool-versions          → Scarb 2.13.1, starknet-foundry 0.51.1
```

## Contributing to Book Content

### Adding/Editing a Chapter

1. Create/edit markdown in `src/chXX-name.md` or `src/chXX-YY-subname.md`
2. Update `src/SUMMARY.md` if adding new pages
3. Reference code via `{{#include ../listings/...}}` — never inline code

### Writing Style

- First person ("we") for tutorials
- Second person ("you") for instructions
- New terms in _italics_
- Code references in `backticks`
- See [docs/cairo-documentation-style-guide.md](./docs/cairo-documentation-style-guide.md)

## Contributing Cairo Code

### Creating a New Listing

```bash
cd listings/chXX-chapter-name
scarb new listing_name
rm -rf listing_name/.git
```

### Code Structure

```cairo
// TAG: does_not_compile    ← Optional: skip build
// TAG: does_not_run        ← Optional: skip execute
// TAG: ignore_fmt          ← Optional: skip formatting
// TAG: tests_fail          ← Optional: skip test

// ANCHOR: section_name
fn example() {
    // Code to include in book
}
// ANCHOR_END: section_name
```

### Referencing Code in Markdown

```md
<!-- Full file -->

{{#include ../listings/ch01-getting-started/example/src/lib.cairo}}

<!-- Specific anchor -->

{{#rustdoc_include ../listings/ch01-getting-started/example/src/lib.cairo:section_name}}
```

### Verification

```bash
# Verify single listing
cd listings/ch01-getting-started/example
scarb build && scarb test && scarb fmt -c

# Verify all listings (slow)
cairo-listings verify
```

## Contributing Quizzes

1. Create TOML file in `quizzes/chXX.toml`
2. Reference in markdown: `{{#quiz ../quizzes/chXX.toml}}`

## CI/CD

### PR Checks (must pass)

- `cairo-listings verify` — all Cairo code compiles and tests pass
- `typos` — no spelling errors

### Deployment (automatic on main)

- Builds English + translations (es, fr, zh-cn, id, tr)
- Deploys to `gh-pages` branch
- Live at https://www.starknet.io/cairo-book/

### Releases

- Tag with `v*` (e.g., `git tag v2.13.0`) triggers GitHub Release
- Historical versions: `./scripts/build-version.sh <version> <commit>`

## Code Style

- `snake_case` for functions/variables
- `PascalCase` for types/traits
- Group imports: core → external → internal
- Tests in `#[cfg(test)]` module
- Doc comments: `///` for items, `//!` for modules

## Key Constraints

- NEVER inline Cairo code in markdown — always use `{{#include}}`
- NEVER create files unless explicitly necessary
- ALWAYS prefer editing existing files
- ALWAYS run `cairo-listings format` after modifying Cairo code
- ALWAYS update `src/SUMMARY.md` when adding new pages

# Development Guide

This guide covers everything you need to know to contribute to The Cairo
Programming Language Book.

## Getting Started

### Prerequisites

Ensure you have the following installed:

- **Rust toolchain**: Install via [rustup](https://rustup.rs/)
- **asdf** (recommended): For version management of Scarb and Starknet Foundry
- **gettext**: For translations (`sudo apt install gettext` on Linux,
  `brew install gettext` on macOS)
- **Node.js**: For helper scripts — or `bun` if you prefer.

### Tool Versions

The project uses specific tools, whose versions are defined and updated in
`.tool-versions`:

- **Scarb**
- **Starknet Foundry**

You can automatically install the tools with asdf:

```bash
asdf install
```

### mdBook and Extensions

Install mdBook and required extensions:

```bash
# mdBook
cargo install mdbook

# Extensions
cargo install mdbook-i18n-helpers --locked --version 0.3.5
cargo install mdbook-last-changed

# Custom Cairo preprocessor
cargo install --git https://github.com/enitrat/mdbook-cairo --locked

# Cairo listings verification tool
cargo install --git https://github.com/enitrat/cairo-listings --locked

# Spell checker
cargo install typos-cli
```

For quizzes (optional, complex setup):

```bash
# Install Depot
curl https://raw.githubusercontent.com/cognitive-engineering-lab/depot/main/scripts/install.sh | sh

# Clone and build mdbook-quiz-cairo
git clone https://github.com/cairo-book/mdbook-quiz-cairo
cd mdbook-quiz-cairo
cargo make init-bindings
cargo install --path crates/mdbook-quiz-cairo --locked
```

### Clone and Serve

```bash
git clone https://github.com/cairo-book/cairo-book.git
cd cairo-book
mdbook serve --open
```

Visit [localhost:3000](http://localhost:3000) to view the book locally.

## Project Structure

```
cairo-book/
├── src/                    # Book content (Markdown files)
│   ├── SUMMARY.md          # Table of contents
│   ├── ch01-*.md           # Chapter files
│   └── ...
├── listings/               # Cairo code examples (Scarb packages)
│   ├── ch01-getting-started/
│   └── ...
├── quizzes/                # Quiz question files
├── theme/                  # Custom JS/CSS for the website
│   ├── book.js             # Code execution, themes
│   ├── chat.js             # AI chat assistant
│   └── css/
├── scripts/                # Helper scripts
├── docs/                   # Developer documentation
├── book.toml               # mdBook configuration
├── .tool-versions          # asdf tool versions
└── LANGUAGES               # Supported translations
```

## Writing Content

### Style and Tone

Follow the
[Cairo Documentation Style Guide](./cairo-documentation-style-guide.md) and the
[Contribution Guide](./CONTRIBUTING.md) for writing guidelines.

Key points:

- Use friendly, instructional tone
- Address readers with "you" and "we"
- Introduce new terms with _italics_
- Use backticks for inline code

### Adding New Chapters

1. Create the markdown file in `src/` following the naming convention:
   `ch01-01-section-name.md`
2. Add the chapter to `src/SUMMARY.md`
3. Create corresponding code listings in `listings/`

### Code Examples

All code examples should be in the `listings/` directory as Scarb packages:

```bash
# Create a new listing
cd listings/ch01-getting-started
scarb new my_example
cd my_example
rm -rf .git  # Remove the auto-created git directory
```

Reference code in markdown with the include syntax:

```md
{{#include ../listings/ch01-getting-started/my_example/src/lib.cairo}}
```

For partial includes, use ANCHOR tags in your Cairo code:

```cairo
// ANCHOR: main
fn main() {
    println!("Hello, Cairo!");
}
// ANCHOR_END: main
```

Then reference:

```md
{{#rustdoc_include ../listings/ch01-getting-started/my_example/src/lib.cairo:main}}
```

Using `rustdoc_include` to include the specific function allows the user to
selectively expand the code example to see the full code.

### TAG Comment System

Add TAG comments at the top of Cairo files to control build behavior:

| Tag                        | Effect               |
| -------------------------- | -------------------- |
| `// TAG: does_not_compile` | Skip `scarb build`   |
| `// TAG: does_not_run`     | Skip `scarb execute` |
| `// TAG: ignore_fmt`       | Skip `scarb fmt`     |
| `// TAG: tests_fail`       | Skip `scarb test`    |

Example:

```cairo
// TAG: does_not_compile
fn example_with_error() {
    let x = 5
    // Missing semicolon - intentionally doesn't compile
}
```

Those tags are removed by a mdbook pre-processor pass in the final book output.

## Testing and Verification

### Common Commands

```bash
# Build the book
mdbook build

# Serve locally with hot reload
mdbook serve --open

# Verify all Cairo code examples
cairo-listings verify

# Format all Cairo code
cairo-listings format

# Generate output files for examples
cairo-listings output

# Check for typos
typos
```

### Testing Individual Listings

Navigate to a specific listing and run Scarb commands:

```bash
cd listings/ch01-getting-started/hello_world
scarb build      # Compile
scarb test       # Run tests
scarb execute    # Run program
scarb fmt -c     # Check formatting
```

## CI/CD and Deployment

### Pull Request Checks

Every PR runs these checks:

1. **cairo-listings verify**: Compiles and tests all Cairo code
2. **typos**: Spell checking
3. **link-check**: Validates markdown links (on main only)

### Deployment

Pushes to `main` trigger automatic deployment:

1. Book is built with `mdbook build`
2. Translations are built for: Spanish (es), French (fr), Chinese (zh-cn),
   Indonesian (id), Turkish (tr)
3. Content is deployed to the `gh-pages` branch
4. Live at [starknet.io/cairo-book](https://www.starknet.io/cairo-book/)

### Version Management

The book supports multiple versions accessible via a version switcher.

**Creating a GitHub Release:**

```bash
git tag v2.13.0
git push origin v2.13.0
```

This triggers the release workflow which creates a GitHub Release.

**Adding Historical Versions:**

Use the `build-version.sh` script to build documentation from a specific commit:

```bash
./scripts/build-version.sh 2.12 abc1234
```

This script:

1. Checks out the specified commit
2. Installs the tools from that commit's `.tool-versions`
3. Builds the documentation
4. Deploys to `gh-pages` under `/v2.12/`
5. Updates `versions.json` for the version switcher

## Helper Scripts

| Script                                | Purpose                                  |
| ------------------------------------- | ---------------------------------------- |
| `scripts/build-version.sh`            | Build historical version from commit     |
| `scripts/combine-markdown.sh`         | Combine all markdown for LLM consumption |
| `scripts/update-meta-descriptions.ts` | Update HTML meta tags from frontmatter   |
| `scripts/display_build_diff.sh`       | Compare build outputs                    |
| `scripts/handle_targets.py`           | Configure Cairo executable targets       |

### Listing Management (Bun)

```bash
cd scripts
bun run start
```

Interactive CLI for:

- Renaming and refactoring listings
- Reordering listings by chapter
- Updating references in markdown files

## Translations

Translations are managed in the `po/` directory. The book supports:

- English (source)
- Spanish (es)
- French (fr)
- Chinese (zh-cn)
- Indonesian (id)
- Turkish (tr)

See the
[mdbook-i18n-helpers](https://github.com/nicosantangelo/mdbook-i18n-helpers)
documentation for translation workflows.

## Troubleshooting

### mdbook-quiz-cairo Issues

If quizzes fail to build, you can remove the preprocessor from `book.toml` for
local development:

```toml
# Comment out or remove:
# [preprocessor.quiz-cairo]
```

### Scarb Version Mismatch

Ensure your Scarb version matches `.tool-versions`:

```bash
scarb --version
# Should show: scarb 2.13.1
```

### Cairo Compilation Errors

Run verification on a specific listing:

```bash
cd listings/ch05-using-structs/defining_structs
scarb build
```

Check for TAG comments if the code intentionally doesn't compile.

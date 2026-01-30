# Codebase Report: Cairo Book Code Example Structure and Presentation
Generated: 2026-01-18

## Summary

The Cairo Book follows a systematic approach to structuring and presenting code examples, using the mdBook framework with Cairo-specific tooling. Code is strictly separated from markdown files using ANCHOR tags and `{{#include}}` directives, ensuring single source of truth and enabling automated verification of all examples.

## Project Structure

```
cairo-book/
├── src/                          # Markdown content ONLY (no code)
│   ├── SUMMARY.md               # Table of contents (defines structure)
│   ├── ch01-02-hello-world.md   # Chapter files
│   └── ...
├── listings/                     # Cairo code examples (Scarb packages)
│   ├── ch02-common-programming-concepts/
│   │   ├── no_listing_01_variables_are_immutable/
│   │   │   ├── Scarb.toml
│   │   │   └── src/
│   │   │       └── lib.cairo    # Contains actual code
│   │   ├── no_listing_02_adding_mut/
│   │   └── ...
│   ├── ch05-using-structs-to-structure-related-data/
│   ├── ch10-testing-cairo-programs/
│   └── ...
├── quizzes/                      # Quiz TOML files
├── book.toml                     # mdBook configuration
└── scripts/
    └── cairo-listings            # Verification tool
```

## Naming Conventions

### Listing Directory Names

Two naming patterns are used:

1. **Numbered listings** (referenced in text):
   - Format: `listing_XX_YY` where XX is chapter, YY is listing number
   - Example: `listing_10_03` → Listing 10-3 in the book
   - Usage: For examples explicitly referenced as "Listing 10-3"

2. **No listing** (inline examples):
   - Format: `no_listing_NN_descriptive_name`
   - Example: `no_listing_02_adding_mut`, `no_listing_37_item_doc_comments`
   - Usage: For examples that appear inline without formal listing numbers

### Descriptive Naming

Directory names clearly indicate the concept:
- `no_listing_01_variables_are_immutable` → demonstrates immutability error
- `no_listing_02_adding_mut` → shows how to fix with `mut`
- `no_listing_28_bis_if_not_bool` → variant example with "bis" suffix
- `no_listing_44_fixed_size_arr_accessing_elements_span` → very specific use case

## ANCHOR Tag System

### Basic ANCHOR Pattern

Code files use ANCHOR tags to mark sections for inclusion:

```cairo
// ANCHOR: section_name
fn example() {
    // Code to include
}
// ANCHOR_END: section_name
```

### Real Examples from Codebase

#### Single Section Anchor

**File**: `/listings/ch05-using-structs-to-structure-related-data/listing_03_no_struct/src/lib.cairo`

```cairo
//ANCHOR:all
#[executable]
fn main() {
    let width = 30;
    let height = 10;
    let area = area(width, height);
    println!("Area is {}", area);
}

//ANCHOR: here
fn area(width: u64, height: u64) -> u64 {
    //ANCHOR_END: here
    width * height
}
//ANCHOR_END:all
```

**Usage in markdown**:
```markdown
<!-- Full example -->
{{#include ../listings/ch05-using-structs-to-structure-related-data/listing_03_no_struct/src/lib.cairo:all}}

<!-- Just the function signature -->
{{#include ../listings/ch05-using-structs-to-structure-related-data/listing_03_no_struct/src/lib.cairo:here}}
```

#### Multiple Named Anchors

**File**: `/listings/ch101-building-starknet-smart-contracts/listing_simple_storage/src/lib.cairo`

```cairo
//ANCHOR: all
// ANCHOR: contract
#[starknet::contract]
mod SimpleStorage {
    use starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess};
    
    //ANCHOR: storage
    #[storage]
    struct Storage {
        owner: Person,
        expiration: Expiration,
    }
    //ANCHOR_END: storage

    //ANCHOR: person
    #[derive(Drop, Serde, starknet::Store)]
    pub struct Person {
        address: ContractAddress,
        name: felt252,
    }
    //ANCHOR_END: person

    //ANCHOR: enum
    #[derive(Copy, Drop, Serde, starknet::Store)]
    pub enum Expiration {
        Finite: u64,
        #[default]
        Infinite,
    }
    //ANCHOR_END: enum

    //ANCHOR: write_owner
    #[constructor]
    fn constructor(ref self: ContractState, owner: Person) {
        self.owner.write(owner);
    }
    //ANCHOR_END: write_owner

    //ANCHOR: read_owner
    fn get_owner(self: @ContractState) -> Person {
        self.owner.read()
    }
    //ANCHOR_END: read_owner
}
// ANCHOR_END: contract
//ANCHOR_END: all
```

This allows granular inclusion in the markdown:
- `:all` → entire file
- `:storage` → just the storage struct
- `:person` → just the Person definition
- `:read_owner` → just the getter function

### ANCHOR Best Practices

1. **Nesting is allowed**: `all` can contain `contract`, which contains `storage`, `person`, etc.
2. **Self-documenting names**: Use descriptive anchor names like `read_owner`, not `section1`
3. **Strategic placement**: Place anchors around logical units (struct definitions, function implementations)
4. **Minimal anchors for simple examples**: Single-concept examples may only have `all`

## Markdown Reference Patterns

### Include Directives

Two types of include directives are used:

#### 1. `{{#include ...}}` - Full File Inclusion

```markdown
{{#include ../listings/ch02-common-programming-concepts/no_listing_01_variables_are_immutable/src/lib.cairo}}
```

Includes the entire file as-is. Use for simple, complete examples.

#### 2. `{{#rustdoc_include ...}}` - Anchored Section Inclusion

```markdown
{{#rustdoc_include ../listings/ch08-generic-types-and-traits/no_listing_15_traits/src/lib.cairo:trait}}
{{#rustdoc_include ../listings/ch08-generic-types-and-traits/no_listing_15_traits/src/lib.cairo:impl}}
{{#rustdoc_include ../listings/ch08-generic-types-and-traits/no_listing_15_traits/src/lib.cairo:main}}
```

Includes only the code between `ANCHOR: trait` and `ANCHOR_END: trait`. Use for showing specific parts of larger files.

### Including Output Files

Test output and command results are also stored and included:

```markdown
```shell
{{#include ../listings/ch10-testing-cairo-programs/listing_10_01/output.txt}}
```
```

Output files are generated by running the examples and capturing stdout.

## Code Example Progression Patterns

### Pattern 1: Incremental Refinement

**Chapter 5-2: An Example Program Using Structs**

Shows evolution from naive to structured approach:

1. **Listing 03** (`listing_03_no_struct`):
   ```cairo
   fn area(width: u64, height: u64) -> u64 {
       width * height
   }
   ```
   Problem: Parameters not grouped

2. **Listing 04** (`listing_04_w_tuples`):
   ```cairo
   fn area(dimensions: (u64, u64)) -> u64 {
       let (width, height) = dimensions;
       width * height
   }
   ```
   Better: Data grouped, but no labels

3. **Listing 05** (`listing_05_w_structs`):
   ```cairo
   struct Rectangle {
       width: u64,
       height: u64,
   }
   fn area(rectangle: Rectangle) -> u64 {
       rectangle.width * rectangle.height
   }
   ```
   Best: Named fields, clear intent

### Pattern 2: Demonstrate Failure Then Fix

**Chapter 2-1: Variables and Mutability**

1. **Show the error** (`no_listing_01_variables_are_immutable`):
   ```cairo
   //TAG: does_not_compile
   fn main() {
       let x = 5;
       x = 6;  // ERROR: Cannot assign to immutable variable
   }
   ```
   Includes TAG to skip verification

2. **Show the fix** (`no_listing_02_adding_mut`):
   ```cairo
   fn main() {
       let mut x = 5;
       x = 6;  // OK: Variable is mutable
   }
   ```

### Pattern 3: Test-Driven Progression

**Chapter 10: Testing Cairo Programs**

1. **Basic test** (`listing_10_01`):
   ```cairo
   #[test]
   fn it_works() {
       let result = add(2, 2);
       assert_eq!(result, 4);
   }
   ```

2. **Add failing test** (`listing_10_02`):
   ```cairo
   #[test]
   fn another() {
       panic!("Make this test fail");
   }
   ```

3. **Real-world example** (`listing_10_03`):
   ```cairo
   #[test]
   fn larger_can_hold_smaller() {
       let larger = Rectangle { height: 7, width: 8 };
       let smaller = Rectangle { height: 1, width: 5 };
       assert!(larger.can_hold(@smaller));
   }
   ```

4. **Demonstrate bug detection** (`no_listing_01_wrong_can_hold_impl`):
   ```cairo
   fn can_hold(self: @Rectangle, other: @Rectangle) -> bool {
       *self.width < *other.width  // BUG: wrong operator
   }
   ```

### Pattern 4: Concept Building Blocks

**Chapter 8: Traits**

1. **Simple non-generic trait** (`no_listing_14_simple_trait`):
   ```cairo
   pub trait Summary {
       fn summarize(self: @NewsArticle) -> ByteArray;
   }
   ```

2. **Generic trait** (`no_listing_15_traits`):
   ```cairo
   pub trait Summary<T> {
       fn summarize(self: @T) -> ByteArray;
   }
   ```

3. **Multiple implementations**:
   ```cairo
   impl NewsArticleSummary of Summary<NewsArticle> { ... }
   impl TweetSummary of Summary<Tweet> { ... }
   ```

4. **Usage example**:
   ```cairo
   use aggregator::{NewsArticle, Summary, Tweet};
   fn main() {
       let news = NewsArticle { ... };
       println!("{}", news.summarize());
   }
   ```

## Code Explanation Integration

### Pattern 1: Code Block → Explanation → Code Detail

From ch05-02-an-example-program-using-structs.md:

```markdown
The issue with this code is evident in the signature of `area`:

```cairo,noplayground
{{#include ../listings/.../listing_03_no_struct/src/lib.cairo:here}}
```

The `area` function is supposed to calculate the area of one rectangle, but the 
function we wrote has two parameters, and it's not clear anywhere in our program 
that the parameters are related.
```

This pattern:
1. Shows full working code
2. Highlights the problematic part (via ANCHOR)
3. Explains why it's problematic
4. Shows the improved version

### Pattern 2: Before/After with Narrative

From ch02-01-variables-and-mutability.md:

```markdown
When a variable is immutable, once a value is bound to a name, you can't change
that value. To illustrate this, let's try:

<span class="filename">Filename: src/lib.cairo</span>

```cairo,does_not_compile
{{#include ../listings/.../no_listing_01_variables_are_immutable/src/lib.cairo}}
```

Save and run the program. You should receive an error:

```shell
{{#include ../listings/.../no_listing_01_variables_are_immutable/output.txt}}
```

[Explanation of the error]

But mutability can be very useful. Let's change the code:

```cairo
{{#include ../listings/.../no_listing_02_adding_mut/src/lib.cairo}}
```

When we run the program now, we get:

```shell
{{#include ../listings/.../no_listing_02_adding_mut/output.txt}}
```
```

### Pattern 3: Progressive Revelation

From ch10-01-how-to-write-tests.md:

1. Show complete test:
```markdown
```cairo, noplayground
{{#include ../listings/ch10-testing-cairo-programs/listing_10_01/src/lib.cairo:it_works}}
```
```

2. Explain each part:
```markdown
Note the `#[test]` annotation: this attribute indicates this is a test function...

The example function body uses the `assert_eq!` macro...
```

3. Show output:
```markdown
```shell
{{#include ../listings/ch10-testing-cairo-programs/listing_10_01/output.txt}}
```
```

4. Iterate with variations

## Special Tags and Annotations

### Code Block Metadata

Tags control how code is processed:

```cairo
//TAG: does_not_compile    // Skip build verification
//TAG: does_not_run        // Build but don't run
//TAG: ignore_fmt          // Skip formatting checks
//TAG: tests_fail          // Expected test failures
```

### mdBook Code Block Attributes

```markdown
```cairo,noplayground      # Don't show "Run" button (conceptual code)
```cairo,does_not_compile  # Mark as intentionally broken
```cairo                   # Runnable, verifiable code
```shell                   # Terminal output
```

## Listing Project Structure

Each listing is a complete Scarb package:

```
listing_10_03/
├── Scarb.toml              # Package manifest
├── src/
│   └── lib.cairo           # Main code with ANCHOR tags
├── output.txt              # Captured stdout (if applicable)
└── .snfoundry_cache/       # Test artifacts (gitignored)
```

### Scarb.toml Configuration

Typical configuration:
```toml
[package]
name = "listing_10_03"
version = "0.1.0"
edition = "2024_07"

[dependencies]
starknet = "2.8.2"

[dev-dependencies]
assert_macros = "2.8.2"

[[target.starknet-contract]]
```

## Verification and CI

### cairo-listings Tool

Custom tool (`scripts/cairo-listings`) verifies all examples:

```bash
# Verify all listings
cairo-listings verify

# Format all listings
cairo-listings format

# Generate output files
cairo-listings output
```

The verification process:
1. Finds all Scarb packages in `listings/`
2. Skips files with `//TAG: does_not_compile`
3. Runs `scarb build` on each
4. Runs `scarb test` on each
5. Runs `scarb fmt -c` to check formatting
6. Captures output for examples marked `#[executable]`

### CI Pipeline

On every PR:
- `cairo-listings verify` must pass
- `typos` spell check must pass

This ensures all code examples in the book are:
- ✓ Syntactically correct
- ✓ Compile successfully
- ✓ Tests pass
- ✓ Formatted correctly
- ✓ Output matches what's shown in the book

## Smart Contract Example Structure

Starknet contracts follow additional patterns:

### Full Contract Template

From `listing_simple_storage`:

```cairo
#[starknet::interface]
pub trait ISimpleStorage<TContractState> {
    fn get_owner(self: @TContractState) -> SimpleStorage::Person;
    // ... other interface methods
}

#[starknet::contract]
mod SimpleStorage {
    // ANCHOR: storage
    #[storage]
    struct Storage {
        owner: Person,
        expiration: Expiration,
    }
    // ANCHOR_END: storage

    // Type definitions with Store trait
    // ANCHOR: person
    #[derive(Drop, Serde, starknet::Store)]
    pub struct Person {
        address: ContractAddress,
        name: felt252,
    }
    // ANCHOR_END: person

    // Constructor
    // ANCHOR: write_owner
    #[constructor]
    fn constructor(ref self: ContractState, owner: Person) {
        self.owner.write(owner);
    }
    // ANCHOR_END: write_owner

    // Public functions
    #[abi(embed_v0)]
    impl SimpleCounterImpl of super::ISimpleStorage<ContractState> {
        // ANCHOR: read_owner
        fn get_owner(self: @ContractState) -> Person {
            self.owner.read()
        }
        // ANCHOR_END: read_owner
    }
}

// Tests
#[cfg(test)]
mod tests;
```

### Contract Progression

Contracts are introduced with increasing complexity:

1. **Simple storage** - Read/write basic types
2. **Storage mappings** - Key-value pairs
3. **Nested mappings** - Complex data structures
4. **Storage nodes** - Grouped storage with Maps/Vecs
5. **Events** - Emitting contract events
6. **Cross-contract calls** - Interacting with other contracts

Each builds on previous concepts.

## Questions Answered

### Q1: How are code examples organized in the listings/ directory?

**Location:** `/listings/chXX-chapter-name/`

**Structure:**
- Each chapter has a directory: `ch02-common-programming-concepts/`, `ch10-testing-cairo-programs/`, etc.
- Within each chapter directory, individual examples are separate Scarb packages
- Naming: `listing_XX_YY` for numbered listings, `no_listing_NN_description` for inline examples

**Entry Point:** Each listing directory contains:
- `Scarb.toml` - Package configuration
- `src/lib.cairo` - Main code file
- `output.txt` - Captured output (for executable examples)

### Q2: How are ANCHOR tags used to mark code sections?

**Pattern:** Code files use `// ANCHOR: name` and `// ANCHOR_END: name` comments

**Usage:**
```cairo
// ANCHOR: section_name
fn example() {
    // Code to show in book
}
// ANCHOR_END: section_name
```

**In Markdown:**
```markdown
{{#rustdoc_include ../listings/path/to/file.cairo:section_name}}
```

**Benefits:**
- Show specific parts of larger files
- Reuse same code in multiple places
- Maintain single source of truth
- Enable nested sections (e.g., `all` contains `storage` contains `owner`)

### Q3: How is code referenced in markdown files?

**Two main patterns:**

1. **Full file inclusion:**
   ```markdown
   {{#include ../listings/ch02-common-programming-concepts/no_listing_02_adding_mut/src/lib.cairo}}
   ```

2. **Anchored section inclusion:**
   ```markdown
   {{#rustdoc_include ../listings/ch05-using-structs/listing_03_no_struct/src/lib.cairo:here}}
   ```

**Additional patterns:**
- Output inclusion: `{{#include ../listings/.../output.txt}}`
- Code block annotations: ` ```cairo,noplayground`, ` ```cairo,does_not_compile`
- Filename labels: `<span class="filename">Filename: src/lib.cairo</span>`

**Critical Rule:** NEVER inline Cairo code in markdown files. Always reference external listings.

### Q4: What progression patterns are used within chapters?

**Four main patterns identified:**

1. **Incremental Refinement** - Show naive approach, then improve it step by step
   - Example: Rectangle area calculation (separate params → tuples → structs)

2. **Demonstrate Failure Then Fix** - Show broken code with error, then corrected version
   - Example: Immutable variables error → add `mut` keyword

3. **Test-Driven Progression** - Start simple, add tests, demonstrate bug detection
   - Example: Basic test → failing test → real-world test → catch bugs

4. **Concept Building Blocks** - Introduce simple concept, then add complexity
   - Example: Non-generic trait → generic trait → multiple implementations → usage

**Common thread:** Each example builds on previous understanding, adding one new concept at a time.

### Q5: How are explanations interspersed with code blocks?

**Three main patterns:**

1. **Code → Explanation → Detail**
   - Show full example
   - Extract specific line/section with ANCHOR
   - Explain why it matters
   - Show improved version

2. **Before/After with Narrative**
   - Explain what we want to do
   - Show attempt (may fail)
   - Show error/output
   - Explain the issue
   - Show correct approach
   - Show successful output

3. **Progressive Revelation**
   - Show complete code
   - Explain each component separately (using different ANCHORs)
   - Show output/results
   - Iterate with variations

**Key technique:** Use ANCHOR tags to highlight specific parts of larger examples for focused discussion without repeating entire code blocks.

## Conventions Discovered

### Code Style

- **Naming:**
  - Files/packages: `snake_case`
  - Structs/Enums: `PascalCase`
  - Functions/variables: `snake_case`
  - Constants: `UPPER_SNAKE_CASE`

- **Comments:**
  - ANCHOR tags: `// ANCHOR: name` (lowercase, no extra spacing)
  - TAG directives: `//TAG: does_not_compile` (uppercase, no space after //)
  - Doc comments: `///` for items, `//!` for modules

- **Organization:**
  - Tests in `#[cfg(test)] mod tests` at end of file
  - Interface definitions before contract modules (for Starknet)
  - Imports at top of module

### Markdown Style

- **Headings:** Use "## " for major sections
- **Code blocks:** Always specify language (```cairo, ```shell)
- **Filenames:** Use `<span class="filename">Filename: src/lib.cairo</span>`
- **Captions:** Use `{{#label name}}` and `{{#ref name}}` for cross-references
- **Lists:** Use `-` for unordered, `1.` for ordered
- **Emphasis:** `_italics_` for new terms, `**bold**` for strong emphasis

### Chapter Organization

- `chXX-00-topic.md` → Chapter introduction (brief overview)
- `chXX-01-subtopic.md` → First major section
- `chXX-02-subtopic.md` → Second major section
- Cairo language: ch01-ch12
- Smart contracts: ch100-ch104
- Cairo VM: ch200-ch206

## Key Files Reference

| File | Purpose | Key Patterns |
|------|---------|--------------|
| `src/SUMMARY.md` | Book structure/TOC | Defines navigation |
| `book.toml` | mdBook config | Sets build options |
| `listings/chXX-name/` | Code examples | Each is Scarb package |
| `.tool-versions` | Toolchain versions | Scarb 2.13.1 |
| `scripts/cairo-listings` | Verification tool | `verify`, `format`, `output` |

## Best Practices Extracted

### For Code Examples

1. **One concept per listing** - Each example demonstrates a single idea clearly
2. **Complete, runnable code** - Every example is a full Scarb package that builds
3. **Use meaningful names** - `no_listing_02_adding_mut` is better than `example_02`
4. **Strategic ANCHOR placement** - Mark logical units (structs, functions, tests)
5. **Include output** - Show what the code produces, don't just show code
6. **Show both success and failure** - Demonstrate errors with `does_not_compile` tag

### For Progression

1. **Start simple, add complexity** - Don't dump everything at once
2. **Show the why** - Demonstrate why the improved approach is needed
3. **Error-driven learning** - Show common mistakes and how to fix them
4. **Build on previous examples** - Reference earlier concepts explicitly
5. **Provide complete context** - Each example should be understandable standalone

### For Documentation

1. **Separate code from prose** - Never inline code in markdown
2. **Single source of truth** - One code file, referenced multiple ways
3. **Verify everything** - CI ensures all code works
4. **Link related concepts** - Use `[text][reference]` style links
5. **Include output** - Capture and show actual program results

## Architecture Diagram

```
[Markdown Files] ─────include─────→ [Code Listings]
     (src/)                            (listings/)
        │                                   │
        │                                   │
        ├── SUMMARY.md                      ├── ch02-.../
        ├── ch02-01-*.md ──references──→    │   ├── no_listing_01_.../
        ├── ch05-02-*.md ──references──→    │   │   ├── src/lib.cairo (with ANCHORs)
        └── ch10-01-*.md ──references──→    │   │   ├── output.txt
                                            │   │   └── Scarb.toml
                                            │   └── no_listing_02_.../
                                            │
                                            └── ch05-.../
                                                └── listing_03_no_struct/

                    │
                    ▼
            [cairo-listings verify]
                    │
                    ├─→ scarb build (for each package)
                    ├─→ scarb test (run tests)
                    ├─→ scarb fmt -c (check format)
                    └─→ Capture output → output.txt
                    
                    │
                    ▼
            [mdbook build]
                    │
                    └─→ Resolves {{#include}} directives
                        Applies ANCHOR filters
                        Generates HTML
```

## Open Questions

- How are multi-file listings handled? (Most examples are single-file lib.cairo)
- Is there a pattern for interactive/playground examples? (Seen `noplayground` annotation)
- How are language-specific code examples (Python, TypeScript in Cairo VM sections) handled?

---

## Summary of Key Findings

1. **Strict separation**: Code lives in `listings/`, markdown in `src/`, never mixed
2. **ANCHOR system**: Granular code inclusion using tagged sections
3. **Progressive complexity**: Examples build incrementally, one concept at a time
4. **Verification-first**: All code must compile/test/format correctly
5. **Show don't tell**: Include actual output, demonstrate both success and failure
6. **Single source**: One code file, referenced multiple ways via ANCHORs
7. **Complete packages**: Each example is a full Scarb project, not snippets
8. **Naming clarity**: Directory names describe the concept being demonstrated

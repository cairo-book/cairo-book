# Helper scripts

This directory contains helper scripts for the project.
You will need to have [bun](https://bun.sh) installed to run them.

## Listings script

A script to manage listings in the book.
Enables you to:

- Manually rename the name of a listing and propagate the change to Scarb.toml & .md files, as well as renaming the directory
- Automatically fix bad chapter numbers in listing captions, and reorder listings automatically. This will
  also automatically rename the directories and update the Scarb.toml & .md files.

To install dependencies:

```bash
bun install
```

To run:

```bash
bun start
```

# Diff script

Displays the diff between two builds of the book. Useful when moving snippet folders around but not modifying the content a lot.

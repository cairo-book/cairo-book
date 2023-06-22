# Cli tool to verify cairo programs

This tool is designed to wrap all cairo and starknet plugins for quickly verifying cairo programs.

The tool scans for all `*.cairo` files in the specified directory and performs the following actions:

For a Starknet contract:
- `starknet-compile`
- If it has tests: `cairo-test --starknet`

Cairo program:
- If it has a `main` function: `cairo-run`
- Else, `cairo-compile`
- If it has tests: `cairo-test`
- `cairo-fmt`

To specify which tests to run, you can add a comment at the top of your file with the following format:

```rust
// TAG: <tag1>
// TAGS: <tag1>, <tag2>
```

Here is a list of available tags:
- `does_not_compile`: don't run `cairo-compile`/`starknet-compile`
- `does_not_run`: don't run `cairo-run`
- `ignore_fmt`: don't run `cairo-fmt`
- `tests_fails`: don't run `cairo-test`/`cairo-test --starknet`

You can skip and ignore a specific test by adding the corresponding flag:

```sh
$ cairo-verify --help

Usage: cairo-verify [OPTIONS]

Options:
  -p, --path <PATH>    The path to explore for *.cairo files [default: ./listings]
  -v, --verbose        Print more information
  -q, --quiet          Only print final results
  -f, --formats-skip   Skip cairo-format checks
  -s, --starknet-skip  Skip starknet-compile checks
  -c, --compile-skip   Skip cairo-compile checks
  -r, --run-skip       Skip cairo-run checks
  -t, --test-skip      Skip cairo-test checks
      --file <FILE>    Specify file to check
  -h, --help           Print help
  -V, --version        Print version
```

# Useful links:

- https://github.com/cairo-book/cairo-book.github.io/pull/209
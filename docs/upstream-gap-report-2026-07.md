# Cairo Book — Upstream Gap Report (2026-07-27)

Audit of everything that changed upstream since the book's last release, and
what the book must do about it.

**Baseline:** release tag `v2.16.1`, dated 2026-04-01 (commit `05802ae8`). Only
3 commits have landed since, all housekeeping (`487d91ff`, `8c701b58`,
`d8fb146a`). Effective drift: **~4 months**.

**Research method:** four parallel research agents over GitHub Releases API,
starknet.io, docs.starknet.io, community.starknet.io, and the SNIPs repo. Two
agents independently caught hallucinated `WebFetch` output from GitHub's
JS-rendered release pages and re-verified everything through
`gh api repos/<org>/<repo>/releases`. All version numbers and dates below come
from that verified API data. Items that could not be verified are marked
**[unverified]**.

---

## 1. Version delta

| Component              | Book pins (`.tool-versions`, lockfiles) | Latest as of 2026-07-27      |
| ---------------------- | --------------------------------------- | ---------------------------- |
| Cairo compiler / Scarb | 2.16.1                                  | **2.20.0** (2026-07-23)      |
| starknet-foundry       | 0.58.1                                  | **0.62.1** (2026-07-03)      |
| OpenZeppelin Cairo     | 3.0.0                                   | 3.0.0 (v4.0.0 only rc/alpha) |
| Starknet protocol      | ~v0.14.1 era                            | **v0.14.3** (mainnet 07-06)  |
| Sierra                 | —                                       | 1.9.3                        |

Intermediate releases: Cairo/Scarb 2.17.0 (04-07/04-09), 2.18.0 (04-20/04-21),
2.19.0 (06-24/06-30), 2.19.1–2.19.4 (07-03 → 07-21), 2.20.0 (07-23). snforge
0.59.0 (04-10), 0.60.0 (04-27), 0.61.0 (05-27), 0.62.0 (06-26), 0.62.1 (07-03).

Note: Scarb and the Cairo compiler share version numbers but ship on slightly
different dates. `starkware-libs/cairo` has **no `CHANGELOG.md`** — GitHub
Releases are the only changelog. Release bodies for 2.19.2/2.19.3/2.19.4 are
literally just "Cairo compiler."; their contents were recovered from commit
logs.

---

## 2. Confirmed breakage in this repo

Verified by grep against `src/` and `listings/`.

### 2.1 `#[panic_with]` deprecated — Cairo 2.20.0 (PR #10095, #10096)

Using the attribute without `#[feature("deprecated-panic-with")]` now emits a
warning. Recommended migration: `.expect(...)`, or const-context calculation.

Affected:

- `src/ch09-01-unrecoverable-errors-with-panic.md:104-115` — the whole
  "`panic_with` Attribute" section
- `src/appendix-02-operators-and-symbols.md:108` — table row for
  `#[panic_with('...', wrapper_name)]`
- `listings/ch09-error-handling/no_listing_06_panic_with/src/lib.cairo` — the
  listing itself (tagged `does_not_run`)

Note the _function_ `panic_with_felt252` (used at `ch09-01:36,38,50,62`) is
**not** deprecated — only the attribute. Do not conflate them.

### 2.2 Corelib wrapper removals — **NOT AN ISSUE**

Cairo 2.20.0 removed the `#[panic_with]`-generated corelib wrappers `array_at`,
`u128_from_felt252`, `u128_sub`, `u256_sub`, and the `u*_as_non_zero` helpers.

`grep -rn "u128_from_felt252\|u128_sub\|u256_sub\|as_non_zero" --include="*.cairo" --include="*.md" listings src`
returns **zero hits**. The apparent hit on `array_at` is a false positive: the
directory `listings/ch03-common-collections/no_listing_04_array_at/` is named
after the `.at()` method, and its source uses `a.at(0)` and `a[1]`, not the
removed `array_at` function. **No action required.**

### 2.3 Newly-erroring constructs — audit needed, no known hits

Cairo 2.20.0 turned several previously-silent constructs into hard errors.
Nothing in the book is known to use them, but `cairo-listings verify` after the
toolchain bump is the authoritative check:

- Phantom types as values, in signatures, or as array elements → `E2019`
  (#10120, #10169, #10171, #10175)
- `Felt252Dict` construction with illegal value types → rejected (#10118)
- Glob `use *` in statement position → `E2075` (#10148)
- `#[default]` on a struct member → rejected (#10228)
- `extern` type/function outside corelib → warning `E2201` (#10147)

### 2.4 Tooling commands the book does _not_ use — no action

Checked and clean, listed so nobody re-investigates:

- `snforge clean-cache` removed in snforge 0.61.0 (→ `snforge clean cache`) —
  **not in book**
- `sncast_std` and Cairo Deployment Scripts, slated for permanent removal after
  0.62.1 — **not in book**
- `argent` value for `sncast account --type` removed in 0.61.0 (→ `ready`) —
  **not in book**
- RPC version references (0.8 sunset in v0.14.3) — **book cites no RPC
  versions**

---

## 3. Content that is now factually wrong

### 3.1 Storage cost figures — SNIP-37

`src/ch103-01-optimizing-storage-costs.md` (153 lines) argues for struct packing
qualitatively — lines 9–11 and 78 say storage writes "cost gas" without numbers.
SNIP-37 repriced storage access to reflect real proving cost:

| Operation                      | Before    | After          | Change  |
| ------------------------------ | --------- | -------------- | ------- |
| `StorageRead`                  | ~9,000 L2 | 18,000 L2      | +100%   |
| `StorageWrite` (warm cell)     | ~9,600 L2 | 45,000 L2      | +368%   |
| `StorageWrite` (cold/new cell) | ~9,600 L2 | **447,000 L2** | +4,556% |

Base L2 gas price dropped 20% to compensate; max tx size raised 1B → 1.1B L2
gas. Source:
[SNIP-37 — revisit storage access cost](https://community.starknet.io/t/snip-37-revisit-storage-access-cost/116143)
(2026-03-03). StarkWare stated the cost model will be re-derived "once or twice
a year" — so quote the numbers with a date stamp, or state magnitudes rather
than exact figures.

Compounding: SNIP-40 (v0.14.3) cut target L2 gas per block by 30% and raised
read/write gas amounts proportionally.

The book's packing argument is now _much_ stronger than it currently reads. This
is a content-improvement opportunity, not just a correction.

### 3.2 Compiled class hash is BLAKE, not Poseidon

`src/ch100-01-contracts-classes-and-instances.md:46,51` states:

- line 46: "`h` is the Poseidon hash function"
- line 51: "`sierra_program_hash` is the Poseidon hash of the program's bytecode
  array"

Starknet v0.14.1 (Dec 2025) moved **compiled class hash** computation from
Poseidon to BLAKE (blake2s) — ~8x cheaper to prove under Stwo. `declare`
transactions must supply `compiled_class_hash` under the new function; existing
classes migrate gradually (feeder gateway `get_state_update` gained a
`migrated_compiled_classes` field). Starknet v0.14.3 additionally moved program
and config hashes from Pedersen to Blake.

**Care required:** the _Sierra program hash_ and the _class hash_ are distinct
from the _compiled class hash_. Verify which of the three each line refers to
before editing; do not blanket-replace "Poseidon" with "BLAKE".

Source:
[Starknet version notes](https://docs.starknet.io/learn/cheatsheets/version-notes)

### 3.3 Prover references

S-two ("Stwo") fully replaced Stone as the sole mainnet prover on 2025-11-03.
Audit the Cairo VM chapters (`ch200`–`ch206`) and
`src/ch01-03-proving-a-prime-number.md` for stale Stone references. Source:
[S-two is live on Starknet mainnet](https://www.starknet.io/blog/s-two-is-live-on-starknet-mainnet-the-fastest-prover-for-a-more-private-future/)

---

## 4. New language features the book should cover

Ordered by how much book surface they touch.

### 4.1 Tuple element access via `t.0` — Cairo 2.20.0 (#10111, #10153)

Positional dot-notation on tuples: `t.0`, `t.1`, nested access, assignment,
passing as `ref` arguments, and access through snapshots.

`src/ch02-02-data-types.md:216-226` currently teaches tuples via destructuring
only. Needs a new subsection plus a listing. This is core syntax — highest-value
addition in this batch.

### 4.2 `Span<T>` destructuring via fixed-size array patterns — Cairo 2.19.0 (#9823)

Touches `src/ch03-01-arrays.md` and the pattern-matching material in
`src/ch06-02-the-match-control-flow-construct.md`.

### 4.3 `sha512` and `sha384` — Cairo 2.19.0 (#9947, #9990)

`sha512` ships as a syscall + libfuncs; `sha384` as an implementation.

- `src/appendix-08-system-calls.md` lists `sha256_process_block` at line 30/490
  but no sha512 equivalent
- `src/ch12-04-hash.md` covers only Pedersen and Poseidon (lines 12–40)

snforge 0.62.1 added `sha512_process_block` syscall support, so listings can be
tested.

### 4.4 Starknet interface forwarding impls — Cairo 2.18.0 (#9847)

Auto-generated forwarding impls let a contract include an interface declared in
another contract by forwarding library calls. Genuinely new material for
`src/ch102-00-starknet-contract-interactions.md` /
`src/ch102-03-executing-code-from-another-class.md`.

### 4.5 Expanded `const` contexts

- Struct-update `..base` syntax in const expressions — 2.20.0 (#10136)
- Boolean `!`, `&`, `|`, `^` in const contexts — 2.20.0 (#10212)
- Const calculation for inner variants and `let`s — 2.19.0 (#9899)

### 4.6 Smaller corelib additions — Cairo 2.19.0

- `/=` and `%=` for `i32`/`i64`/`i128` via non-deprecated `*Assign` traits
  (#10027) → `src/appendix-02-operators-and-symbols.md`
- `bounded-int` type made `pub` (#9882)
- `Take::nth(usize::MAX)` returns `None` instead of overflowing (#10022)
- `Take::advance_by` made panic-free (#10036)
- `ByteSpan::get` out-of-bounds empty-range fix (#10051)
- Non-safe array-hash variant removed (#9988)

Corelib doc-comment corrections landed in 2.20.0 for `DivRem`,
`keccak_u256s_be_inputs`, `get_curve_size`, `egcd`, `Iterator::sum`, and
byte-array examples (#10092, #10100–10106, #10122, #10152, #10204). Worth
spot-checking book examples against them.

---

## 5. Tooling changes affecting book instructions

### 5.1 Scarb

- **`scarb prove --proof-format`** (2.19.0) — controls `cairo_serde` output
  format. Relevant to `src/ch01-03-proving-a-prime-number.md`.
- **`scarb doc` runs doc examples** (2.19.0) — compiles and executes runnable
  Cairo code blocks from doc comments in parallel temp workspaces;
  `--show-run-output` displays output. Proc-macro packages skipped with a
  warning. Worth evaluating against the existing `cairo-listings` flow —
  **separate investigation, not part of this update.**
- Unknown `Scarb.toml` fields now warn instead of being silently ignored
  (2.19.0).
- `assert_on_const` lint **disabled by default** since 2.19.1 (perf issues on
  large codebases). Only matters if the book documents it.
- Manifest diagnostic anchors (2.17.0) — inline CairoLS squiggles on
  `Scarb.toml` errors.
- 2.20.0 itself is quiet: registry error-surfacing fix, stdlib builtin patch
  defaults, proc-macro server channels. No new user-facing CLI.

### 5.2 starknet-foundry

- **Minimum recommended Scarb climbed to 2.17.0** (0.62.1), from 2.16.1
  (0.60.0), from 2.14.0. The book's current pin of 2.16.1 is already below
  snforge's own minimum.
- **`#[derive(Fuzzable)]`** (0.61.0) — auto-generates `Fuzzable` impls for
  structs and enums. New material for `src/ch104-02-03-fuzz-testing.md`.
- **`#[should_panic(expected: (...))]`** now accepts regular strings inside
  mixed tuples (0.61.0). Touches `src/ch10-01-how-to-write-tests.md`.
- **Live debugging** handles structs, enums, tuples, arrays, spans (0.62.0);
  best with Scarb ≥2.19.0 and `add-types-debug-info = true`. `--launch-debugger`
  flag added in 0.60.0 (integrates `cairo-debugger`).
- **Backtraces** now cover panics in test function bodies, not just called
  contracts; output reformatted under a single `stack backtrace:` header
  (0.62.0).
- **`snforge_std::declare`** errors deterministically on ambiguous contract
  names and accepts module-tree paths (`my_package::module::MyContract`) to
  disambiguate (0.62.0).
- `snforge test` fails fast if `[cairo] enable-gas = false` (0.61.0).
- `SNFOUNDRY_CACHE` env var for cache directory (0.61.0).
- **`sncast --profile` semantics changed** (0.60.0): now selects only the
  `snfoundry.toml` profile. Use `--scarb-profile` or the `scarb-profile` field
  in `snfoundry.toml` for the Scarb profile. `[sncast.default]` is always the
  base layer.
- New sncast surface: `get spec-version`, `get tx-receipt`, `get block`,
  `get class-hash-at`, `utils contract-address`, `utils selector` (sn_keccak),
  `--no-abi`, `--dry-run`, `--detailed`, `--with-proof-facts`, `--proof-file`,
  `--proof-facts-file`.
- `proof_facts` transaction-info cheats (0.59.0).

### 5.3 OpenZeppelin Cairo Contracts

**v3.0.0 remains the latest stable** — no action needed now. v4.0.0 is at `rc.1`
(2026-05-18) and carries breaking changes worth pre-reading:

- ERC-6909 multi-token standard: `ERC6909Component` +
  ContentURI/Metadata/TokenSupply extensions, `ERC6909ABI`
- `ERC721ConsecutiveComponent` — **breaking**: adds `ERC721TokenOwnerTrait` as a
  required dependency hook on `ERC721Component` (mitigated by
  `ERC721OwnerOfDefaultImpl`)
- `ERC20WrapperComponent`, `ERC721WrapperComponent`, `ERC1155SupplyComponent`,
  `ERC20FlashMintComponent` (ERC-3156)
- `SafeERC20DispatcherTrait` and unified `'SafeERC20: failed operation'` error
  string — **breaking**: removes `Errors::TRANSFER_FAILED` and
  `ERC4626Component::Errors::TOKEN_TRANSFER_FAILED`
- **Breaking**: `ERC6909MetadataComponent` internal setters renamed
  (`_set_token_name`, `_set_token_symbol`, `_set_token_decimals`);
  `ERC6909ContentURIComponent` → `_set_contract_uri`, `_set_token_uri`
- `BitMap` struct and `lower_lookup` checkpoint utility in `openzeppelin_utils`
- `generate_spy_event_helpers` macro
- Requires Scarb ≥2.18.0

### 5.4 Other

- **Cairo Native** (`lambdaclass/cairo_native`): latest is `v0.9.0-rc.7`
  (2026-05-25); last stable `v0.8.0` (2025-12-09). Not GA — do not reference as
  such.
- **cairo-vm** (`lambdaclass/cairo-vm`): the Releases API returned no tagged
  releases at query time. **[unverified]** — version history could not be
  checked.
- **CairoLS / cairo-lint**: ship bundled inside Scarb releases. Only notable
  change is the 2.19.1 `assert_on_const` disable.

---

## 6. Starknet protocol context

Mostly background — the book cites few protocol-version specifics — but relevant
to the smart-contract and VM chapters' framing.

### v0.14.3 — mainnet 2026-07-06

- **SNIP-35**: dynamic EIP-1559-style L2 gas base fee, recalibrated
  block-to-block against a utilization target and tied to STRK price. Replaces
  the sequencer-set floor.
- **SNIP-40**: shorter block times; target L2 gas per block cut 30%, read/write
  gas amounts raised proportionally.
- **RPC 0.8 dropped** — clients must be on 0.9, preferably 0.10.1.
- Program and config hashes move Pedersen → Blake.
- Reported ~2x throughput increase.
- Governance note: L2BEAT's governance team voted against mainnet adoption of
  SNIP-35, citing incentive issues under decentralized sequencers.

Sources:
[pre-release notes](https://community.starknet.io/t/starknet-0-14-3-pre-release-notes/116211),
[thirdweb explainer](https://blog.thirdweb.com/starknet-v0-14-3-explained-dynamic-gas-fees-30-cost-cut-and-what-builders-need-to-know/)

### v0.14.2 — testnet 2026-03-23, mainnet 2026-04-13

- **SNIP-36**: in-protocol Stwo proof verification. New optional `proof` and
  `proof_facts` fields on Invoke V3. L1 finality cut to ~3 hours.
- **New `get_execution_info` syscall v3** — and Cairo 2.17.0 (#9775) made v3 the
  compiler default. Check `src/appendix-08-system-calls.md:61-66`, which
  documents `get_execution_info_syscall` without a version note.
- **SNIP-37** storage repricing (see §3.1).
- StarkGate token contracts moved to v3.0.0 / Scarb project format; USDC renamed
  USDC.e.

Source:
[0.14.2 pre-release notes](https://community.starknet.io/t/0-14-2-pre-release-notes/116146)

### v0.14.1 — mainnet Dec 2025

- Compiled class hash: Poseidon → BLAKE (see §3.2).
- JSON-RPC v0.10.0 released.
- Adaptive block timing.

### v0.15 — targeted September 2026, NOT SHIPPED

Decentralized block validation by independent stakers, further RPC 0.9
deprecation, ~2x throughput, <1.5h L1 finality. **Do not document as current.**

### Merged SNIPs since April 2026

SNIP-35 (dynamic STRK-linked pricing), SNIP-38 (strkBTC), SNIP-39 (strkBTC as
stakable token), SNIP-40 (shorter block times). None are Cairo-language or VM
SNIPs — economic/ecosystem only, low book relevance beyond SNIP-35/40 above.

### 2026-01-05 mainnet incident

A blockifier bug (a state write inside a reverted nested call being incorrectly
retained) caused invalid execution 09:24–09:42 UTC; block production halted
until 14:17 UTC; 18 minutes of activity reorged. Never reached L1 finality — the
proving layer caught it. No funds lost. Not a spec change, but a strong
real-world illustration for any "why proving matters" / finality discussion.
Source:
[incident report](https://www.starknet.io/blog/starknet-incident-report-january-5-2026/)

---

## 7. Research gaps

Stated explicitly so nobody assumes these were covered.

- **No forum thread was found saying "the book is wrong about X."** The forum's
  old "Cairo Development" category no longer appears in `categories.json` — it
  seems to have been folded into "📜 Development Proposals" (id 14), date
  unknown.
- **`starkware-libs/cairo` GitHub Discussions** returned only pre-Oct-2024
  cached content. Treat as "not retrievable," not "nothing there."
- **No Cairo Core Devs Call notes** for 2026 were located.
- Developer pain-point signal (ownership, snapshots, dictionaries, components,
  felt252 vs integers) is **absent from this pass**. The only inferential
  signals are compiler-side: the `Felt252Dict` illegal-value-type rejection and
  the phantom-type rejection both imply real-world footguns worth a book
  callout.
- A Discord/Telegram sweep would close the qualitative gap.

Community tooling noted in passing: **CrossGuard**, an open-source static
analyzer for Starknet bridge contracts (L1 Solidity + L2 Cairo), announced
2026-05-31. Community-built, not core-team. Possible mention in
`src/ch104-03-static-analysis-tools.md`.
[Thread](https://community.starknet.io/t/crossguard-open-source-static-analyzer-for-starknet-bridge-contracts/116223)

---

## 8. Execution plan — one change per PR

Agreed sequencing. Each step merges independently and only if the previous is
green.

### PR 1 — Toolchain bump (~2–4h)

Scope: `.tool-versions` → Scarb 2.20.0, starknet-foundry 0.62.1. Refresh all
`Scarb.lock` files. Run `cairo-listings verify`, `cairo-listings format`,
`typos`, `mdbook build`.

Merge **only if nothing breaks.** Anything that does break gets split into its
own follow-up PR rather than being fixed inside PR 1. Expect §2.3 constructs to
be the likely surprises.

### PR 2 — `#[panic_with]` → `.expect(...)` (~30min)

Scope: the three locations in §2.1. Rewrite the
`src/ch09-01-unrecoverable-errors-with-panic.md` section to present `.expect()`
as the idiom and note the attribute's deprecation; update the `appendix-02`
table row; update or retire
`listings/ch09-error-handling/no_listing_06_panic_with/`.

### PR 3 onward — one item each

Suggested order, highest value first:

1. Tuple `t.0` access — new section in `ch02-02` + listing (§4.1)
2. Storage cost figures — `ch103-01` (§3.1)
3. Compiled class hash BLAKE correction — `ch100-01` (§3.2)
4. `sha512`/`sha384` — `appendix-08` + `ch12-04` (§4.3)
5. `Span<T>` destructuring — `ch03-01` / `ch06-02` (§4.2)
6. Interface forwarding impls — `ch102-*` (§4.4)
7. snforge testing refresh — `ch10-01`, `ch104-02-03` (§5.2)
8. `const` context expansion (§4.5), corelib odds and ends (§4.6)
9. Stwo/Stone audit across `ch200`–`ch206` and `ch01-03` (§3.3)
10. `get_execution_info` v3 note — `appendix-08` (§6)

### Deferred — tracked, not part of this update

**A. Edition migration `2024_07` → `2025_12` (own PR).** Scarb 2.20.0's
`scarb new` now defaults to edition `2025_12`, and the generated template
prefers `[executable]` over `[[target.executable]]`. All 236 listings currently
declare `edition = "2024_07"`; both the old edition and the old target form
still compile cleanly under 2.20.0, so this is not urgent. It is a semantic
migration touching every listing and must not be folded into a version bump.
Before doing it, read the edition's behavioral differences — an edition bump can
change name resolution and trait/prelude semantics, so `cairo-listings verify`
is the gate.

**B. Remove the `#[inline(never)]` closure workaround.** Two occurrences at
`listings/ch12-advanced-features/listing_closures/src/lib.cairo:4` and `:21`,
commented "Needed in Cairo 2.11.4 because of a bug in inlining analysis."
Verified 2026-07-27: stripping both attributes builds and executes correctly
under 2.20.0 (`double: [2, 4, 6]`, `another: [1, 4, 9]`, `even: [4, 6]`). Also
remove the explanatory note at `src/ch11-01-closures.md:257-258`.

**C. `llms-full.txt` / `summary.md` generation is incoherent — decide and fix.**
See §10.

**D.** Evaluating `scarb doc --show-run-output` against the `cairo-listings`
flow; OZ v4.0.0 (still rc).

---

## 10. Build/tooling notes discovered during the 2.20.0 bump

### 10.1 Universal Sierra Compiler ≥ 2.0.0 is now required

snforge 0.62.1 hard-requires USC ≥ 2.0.0. A leftover USC 1.0.0 (from a
starknet-foundry 0.10.1 install) at `~/.local/bin/universal-sierra-compiler`
makes **every** snforge listing fail. mise's starknet-foundry package does not
ship USC, so it must be installed separately. Resolved locally on 2026-07-27 by
replacing the binary with 2.9.1. **Confirm CI's starkup/snfoundryup path
provides USC ≥ 2.0.0.**

### 10.2 snforge warns on Scarb 2.20.0

snforge 0.62.1 prints
`Scarb Version 2.20.0 doesn't satisfy maximal recommended 2.19.1` on every run.
Warning only; all listings pass. starknet-foundry has not yet declared 2.20.0
support. Accepted, no action.

### 10.3 `llms-full.txt` and `summary.md` conflict

Two different generators produce the same deployed artifact, and the second
wins:

- `scripts/combine-markdown.sh` concatenates `book/markdown/*.md` into
  `llms-full.txt` (committed to the repo) and copies it to `book/html/`.
- `scripts/dspy-summarizer.py` writes `summary.md` (committed, requires an LLM
  API).
- `.github/workflows/mdbook.yml:74-75` then runs
  `cp summary.md book/html/llms-full.txt`, **overwriting** the combine-markdown
  output.

So the repo's `llms-full.txt` never reaches production; the deployed
`llms-full.txt` is actually `summary.md`. Deleting `summary.md` without editing
line 75 breaks the deploy job. Pick one generator and delete the other path.

### 10.4 `{{#chap …}}` is unresolved everywhere — pre-existing bug

31 occurrences of `{{#chap <anchor>}}` across `src/` render **literally** in the
built output. No preprocessor in `book.toml` (`cairo`, `gettext`, `quiz-cairo`)
handles the directive.

Verified 2026-07-27 by building `main` in a clean worktree with the full CI
toolchain: `main` produces **63** unresolved `{{#chap}}` in `book/html/` and
**31** in `book/markdown/` — identical to the 2.20.0 branch. **This bug is on
`main` today and the published site shows raw `{{#chap getting-started}}`
text.** It is unrelated to the toolchain bump.

The previously-committed `llms-full.txt` contained zero of these only because it
was stale — generated before the directive was introduced (see commits
`32368f7d`, `f843b4f2`, `3794f9e5`). Regenerating it faithfully surfaces 29 of
them.

**Own PR:** either implement the directive in `mdbook-cairo` or replace all 31
uses with plain chapter links.

### 10.5 Local tooling required to rebuild the book

CI pins these in `.github/workflows/install-mdbook/action.yml`; match them
locally or `mdbook build` silently emits unresolved `{{#chap …}}` placeholders:

- mdbook **v0.4.48**
- mdbook-i18n-helpers 0.3.5
- mdbook-cairo (git `enitrat/mdbook-cairo`, `--locked`)
- mdbook-quiz-cairo (git `cairo-book/mdbook-quiz-cairo` @ `b7450fdf`, needs
  cargo-make + depot, `cargo make init-bindings` first). **Requires pnpm 9**, as
  CI pins via `pnpm/action-setup@v4`. pnpm 10+ fails the build with
  `ERR_PNPM_IGNORED_BUILDS` (it blocks unapproved postinstall scripts for
  `@biomejs/biome`, `@parcel/watcher`, `esbuild`, which pnpm 9 runs by default).
- The quiz preprocessor compiles Cairo from temp directories **outside** the
  repo, where `.tool-versions` does not apply. With mise, the `scarb` shim then
  fails with `No version is set for shim: scarb` and every quiz reports "program
  does not compile". Fix by putting the real binary on PATH
  (`~/.local/share/mise/installs/scarb/<ver>/bin`) or setting a global default.
- mdbook-last-changed 0.1.4 — installed by CI but **not** registered as a
  preprocessor in `book.toml`; only a `theme/css/last-changed.css` reference
  remains. Probably vestigial.

---

## 9. Sources

**Primary (verified via `gh api`)**

- `starkware-libs/cairo` releases —
  https://github.com/starkware-libs/cairo/releases
- `software-mansion/scarb` releases —
  https://github.com/software-mansion/scarb/releases
- `foundry-rs/starknet-foundry` releases —
  https://github.com/foundry-rs/starknet-foundry/releases
- `OpenZeppelin/cairo-contracts` releases —
  https://github.com/OpenZeppelin/cairo-contracts/releases

Note: `raw.githubusercontent.com/starkware-libs/cairo/main/CHANGELOG.md` and the
Scarb equivalent both 404. Neither repo maintains a top-level changelog file.
GitHub's HTML release pages are JS-rendered and produced fabricated content when
fetched — **use the API, not WebFetch, for these repos.**

**Protocol and community**

- Starknet version releases —
  https://www.starknet.io/developers/version-releases/
- Starknet version notes —
  https://docs.starknet.io/learn/cheatsheets/version-notes
- Starknet 2026 technical roadmap —
  https://www.starknet.io/blog/technical-roadmap/
- S-two live on mainnet —
  https://www.starknet.io/blog/s-two-is-live-on-starknet-mainnet-the-fastest-prover-for-a-more-private-future/
- Incident report 2026-01-05 —
  https://www.starknet.io/blog/starknet-incident-report-january-5-2026/
- SNIP-37 storage access cost —
  https://community.starknet.io/t/snip-37-revisit-storage-access-cost/116143
- Starknet 0.14.2 pre-release notes —
  https://community.starknet.io/t/0-14-2-pre-release-notes/116146
- Starknet 0.14.3 pre-release notes —
  https://community.starknet.io/t/starknet-0-14-3-pre-release-notes/116211
- CrossGuard announcement —
  https://community.starknet.io/t/crossguard-open-source-static-analyzer-for-starknet-bridge-contracts/116223
- SNIPs repo — https://github.com/starknet-io/SNIPs

**Secondary**

- thirdweb, v0.14.3 explainer —
  https://blog.thirdweb.com/starknet-v0-14-3-explained-dynamic-gas-fees-30-cost-cut-and-what-builders-need-to-know/
- cryptobriefing, v0.14.3 mainnet —
  https://cryptobriefing.com/starknet-v0143-mainnet-upgrade-fees-latency/

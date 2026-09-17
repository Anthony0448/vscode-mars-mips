# Changelog

All notable changes made in this fork are documented here. The fork began from upstream version 1.0.4; the inherited upstream history remains available in the repository's Git history.

## [1.2.0] - 2026-09-17

### Instruction, directive, and register documentation

- Rebuilt the instruction, directive, and register tables from the bundled MARS simulator's own data, so hovers and completion now describe all 187 mnemonics MARS accepts instead of 130.
- Added the previously missing floating point, coprocessor, and unaligned load/store instructions, along with the `$f0`-`$f31` floating point registers.
- Replaced the 23 instructions that had a blank description, including `la` and `li`, which previously produced an empty hover.
- Added an operand-order example to every instruction hover, so the `$Rd`/`$Rs`/`$Rt` placeholders in the descriptions have something concrete to refer to, and labelled pseudo-instructions as such.
- Extended register hovers to cover numbers and floating point registers: `$9` resolves to `$t1`, and every general purpose register reports its number and whether it survives a function call.
- Removed the 15 mipsy-only mnemonics that MARS cannot assemble: `bal`, `begin`, `copy`, `decr`, `end`, `incr`, `mod`, `modu`, `pop`, `push`, `zeb`, `zeh`, and the `dbg_print_char`, `dbg_print_int`, and `dbg_print_str` debugging family.
- Removed the 5 MIPS32r2 mnemonics that MARS reports as unrecognized operators: `rotr`, `rotrv`, `seb`, `seh`, and `wsbh`.
- Added the `.extern`, `.set`, `.eqv`, and `.include` directives.

### Highlighting

- Matched mnemonics and directives case-insensitively, as MARS does, so `LA`, `BEQ`, and `.DATA` are now highlighted. Register names stay case-sensitive because MARS rejects `$T1`.
- Scoped registers as `variable.language.register.*` instead of `keyword.operator.register.*`. VS Code's default dark themes paint `keyword.operator` in the editor's own foreground colour, so every register rendered as plain text; they are now coloured like the language-defined values they are.
- Stopped a mnemonic from being highlighted when it is only the leading part of a longer word such as `add.s` or `adder`.
- Resolved hovers by sigil, so a label named `data` or `at` is no longer described as a directive or a register.

### Tooling and quality

- Added a grammar regression suite that tokenizes sample MIPS with the same TextMate and Oniguruma engines VS Code uses, and a data suite asserting every documented term has a description.

## [1.1.0] - 2026-08-30

### Project identity and distribution

- Renamed the extension package to `mars-mips-toolkit` and the display name to **MARS MIPS Toolkit** so it has a distinct, publication-ready identity while remaining installable alongside the upstream extension.
- Changed the publisher and repository metadata to `anthony0448`, and added explicit homepage, issue tracker, license, categories, and Marketplace keywords.
- Added a focused VSIX inclusion list, reproducible local package commands, CI validation, and an opt-in Marketplace publishing workflow.
- Rewrote the README around the current feature set, runtime requirements, settings, commands, limitations, development workflow, and project lineage.

### Formatter and parser

- Replaced the stateful formatter path with a pure formatting core and a small VS Code adapter, making the behavior independently testable and idempotent.
- Made parsing quote-aware so commas and `#` or `;` comment markers inside string and character literals are preserved.
- Kept parenthesized address expressions such as `4($sp)` intact.
- Normalized conventional MIPS layout: comment-only lines and section directives remain at column zero, instruction operands use compact comma spacing, labels/directives/instructions align consistently, isolated spacer lines are removed from loosely spaced input, and deliberate paragraph breaks collapse to one separator.
- Added `mars-mips.formatterCommentColumn` for predictable inline-comment alignment, with at least two spaces before comments when a statement exceeds the preferred column.
- Respected VS Code's requested tab size, tabs-versus-spaces setting, and document line-ending style.
- Added regression coverage based on real unformatted/formatted MIPS input, including strings, character literals, address expressions, comments, blank lines, and a second-pass idempotence check.

### MARS execution

- Replaced shell command construction with argument-safe VS Code process tasks so Java, JAR, and source paths are not interpolated by a shell.
- Saved dirty files before execution and added clear errors for untrusted workspaces, non-MIPS editors, unsaved or virtual files, failed saves, and missing MARS JARs.
- Ran command-line MARS tasks from the source file's directory and launched the graphical simulator as a detached process.
- Added `mars-mips.javaPath` and `mars-mips.marsPath` machine-overridable settings while retaining the bundled simulator as the default.
- Declared limited support for untrusted and virtual workspaces: language features remain available while local code execution is restricted.

### VS Code integration and language features

- Registered all language providers and commands during activation and tracked their disposables through the extension context.
- Updated the extension entry point, workspace extension kind, command categories, menus, icons, enablement expressions, and configuration metadata for current VS Code APIs.
- Corrected definition and reference matching, identifier boundaries, source ranges, constant lookup, and reference inclusion behavior.
- Made semantic tokens deterministic by sorting and de-duplicating symbols and aligned token scopes with standard semantic token types.
- Improved completion trigger handling and typed configuration access, and preserved source spelling in hover results.
- Corrected escaped-string and comment handling shared by the language providers.

### Tooling and quality

- Enabled strict TypeScript checking with TypeScript's Node16 module resolution mode and an ES2022 target.
- Migrated to ESLint's flat configuration and current TypeScript ESLint tooling.
- Updated the VS Code, Node, TypeScript, Webpack, ESLint, and Prettier development dependencies.
- Added Node's built-in test runner with parser and formatter regression suites.
- Standardized source, snippet, language-configuration, and Webpack formatting.

[1.2.0]: https://github.com/Anthony0448/vscode-mars-mips/compare/1.1.0...1.2.0
[1.1.0]: https://github.com/Anthony0448/vscode-mars-mips/compare/19065e493d1a518d81b6d136347e1b187794f725...1.1.0

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { before, describe, it } from "node:test";
import * as oniguruma from "vscode-oniguruma";
import * as textmate from "vscode-textmate";
import { allInstructions, directives } from "../constants";

const repositoryRoot = path.join(__dirname, "..", "..");
const grammarPath = path.join(repositoryRoot, "syntaxes", "mips.tmLanguage.json");

let grammar: textmate.IGrammar;

/** Returns the most specific scope applied to `text` within `line`. */
function scopeOf(line: string, text: string): string | undefined {
    const startIndex = line.indexOf(text);
    assert.notEqual(startIndex, -1, `${text} does not appear in ${line}`);

    const token = grammar
        .tokenizeLine(line, textmate.INITIAL)
        .tokens.find((candidate) => candidate.startIndex <= startIndex && candidate.endIndex > startIndex);

    return token?.scopes[token.scopes.length - 1];
}

void describe("grammar", () => {
    before(async () => {
        const wasm = fs.readFileSync(
            path.join(repositoryRoot, "node_modules", "vscode-oniguruma", "release", "onig.wasm"),
        );
        await oniguruma.loadWASM(wasm.buffer);

        const registry = new textmate.Registry({
            onigLib: Promise.resolve({
                createOnigScanner: (sources) => new oniguruma.OnigScanner(sources),
                createOnigString: (source) => new oniguruma.OnigString(source),
            }),
            loadGrammar: () =>
                Promise.resolve(textmate.parseRawGrammar(fs.readFileSync(grammarPath, "utf8"), grammarPath)),
        });

        const loaded = await registry.loadGrammar("source.mips");
        assert.ok(loaded, "source.mips grammar failed to load");
        grammar = loaded;
    });

    void it("highlights every documented instruction", () => {
        for (const mnemonic of Object.keys(allInstructions)) {
            assert.match(
                scopeOf(`\t${mnemonic}\t$t0, $t1`, mnemonic) ?? "",
                /^support\.function\./,
                `${mnemonic} is not highlighted`,
            );
        }
    });

    void it("highlights every documented directive", () => {
        for (const directive of Object.keys(directives)) {
            assert.equal(scopeOf(`\t.${directive}\t0`, `.${directive}`), "keyword.control.directive.mips");
        }
    });

    // MARS accepts mnemonics and directives in any case, so the grammar has to
    // as well, even though register names stay case-sensitive.
    void it("highlights upper case mnemonics and directives", () => {
        assert.match(scopeOf("\tBEQ\t$t1, $zero, done", "BEQ") ?? "", /^support\.function\./);
        assert.match(scopeOf("\tLA\t$a0, PROMPT", "LA") ?? "", /^support\.function\./);
        assert.match(scopeOf("\tLI\t$v0, 4", "LI") ?? "", /^support\.function\./);
        assert.match(scopeOf("\tMul\t$t1, $t2, $t3", "Mul") ?? "", /^support\.function\./);
        assert.equal(scopeOf("\t.DATA", ".DATA"), "keyword.control.directive.mips");
    });

    void it("does not treat upper case register names as registers", () => {
        assert.equal(scopeOf("\tli\t$T1, 4", "$T1"), "source.mips");
    });

    // Registers are scoped under variable.language rather than keyword.operator
    // because VS Code's default dark themes paint keyword.operator in the exact
    // editor foreground colour, which leaves registers looking unhighlighted.
    void it("highlights registers by name and by number", () => {
        assert.equal(scopeOf("\tmul\t$t1, $t2, $t3", "$t1"), "variable.language.register.temporary.mips");
        assert.equal(scopeOf("\tlw\t$s0, 0($sp)", "$s0"), "variable.language.register.saved.mips");
        assert.equal(scopeOf("\tlw\t$s0, 0($sp)", "$sp"), "variable.language.register.pointer.mips");
        assert.equal(scopeOf("\tsw\t$8, 4($29)", "$8"), "variable.language.register.number.mips");
        assert.equal(scopeOf("\tsw\t$8, 4($29)", "$29"), "variable.language.register.number.mips");
        assert.equal(scopeOf("\tadd.s\t$f2, $f4, $f12", "$f12"), "variable.language.register.float.mips");
    });

    void it("keeps a dotted mnemonic whole", () => {
        assert.equal(scopeOf("\tadd.s\t$f0, $f1, $f2", "add.s"), "support.function.instruction.mips");
        assert.equal(scopeOf("\tc.eq.d\t$f2, $f4", "c.eq.d"), "support.function.instruction.mips");
    });

    void it("does not highlight mnemonics inside comments, strings or labels", () => {
        assert.equal(scopeOf('msg:\t.asciiz\t"add or sub"', "add or sub"), "string.quoted.double.mips");
        assert.equal(scopeOf("\tli\t$v0, 10\t# add them", "add them"), "comment.line.number-sign.mips");
        assert.equal(scopeOf("add:\tnop", "add"), "support.class.label.mips");
    });

    void it("does not highlight a mnemonic that is only part of a longer word", () => {
        assert.equal(scopeOf("\tjal\tadder", "adder"), "source.mips");
        assert.equal(scopeOf("\tjal\tmy_add", "my_add"), "source.mips");
    });
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatLines, type MipsFormattingOptions } from "../formatting";
import Line from "../Line";

const options: MipsFormattingOptions = {
    commentColumn: 32,
    insertSpaces: true,
    tabSize: 4,
};

function format(source: readonly string[]): string[] {
    return formatLines(
        source.map((text) => new Line({ text })),
        options,
    );
}

void describe("formatLines", () => {
    void it("produces compact conventional MIPS layout", () => {
        const formatted = format([
            "    # polynomial example",
            ".data",
            " X:       .word     0",
            ' result: .asciiz    "result = "',
            ' prompt: .asciiz "a very long prompt that must not move unrelated comments"',
            " .eqv     a      4",
            ".text",
            " li $v0, 5 # input an integer",
            " mul $t0, $a0, $t0 # calculate",
        ]);

        assert.deepEqual(formatted, [
            "# polynomial example",
            ".data",
            "X:      .word   0",
            'result: .asciiz "result = "',
            'prompt: .asciiz "a very long prompt that must not move unrelated comments"',
            ".eqv    a 4",
            ".text",
            `    li      $v0, 5${" ".repeat(14)}# input an integer`,
            `    mul     $t0, $a0, $t0${" ".repeat(7)}# calculate`,
        ]);
    });

    void it("keeps two spaces before comments when code exceeds the preferred column", () => {
        const [formatted] = format(["li $v0, a_very_long_constant_name # comment"]);

        assert.equal(formatted, "    li      $v0, a_very_long_constant_name  # comment");
    });

    void it("is idempotent", () => {
        const firstPass = format(["value: .word 1", "add $t0,$t1,$t2 # sum"]);
        const secondPass = format(firstPass);

        assert.deepEqual(secondPass, firstPass);
    });

    void it("collapses repeated blank lines while preserving one separator", () => {
        const formatted = format([".data", "", "   ", "", "value: .word 1"]);

        assert.deepEqual(formatted, [".data", "", "value:  .word   1"]);
    });
});

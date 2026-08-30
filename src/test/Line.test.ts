import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Line from "../Line";

void describe("Line", () => {
    void it("parses a label, instruction, and arguments", () => {
        const line = new Line({ text: "loop: add $t0, $t1, $t2" });

        assert.equal(line.label, "loop:");
        assert.equal(line.instruction, "add");
        assert.deepEqual(line.arguments, ["$t0", "$t1", "$t2"]);
    });

    void it("preserves commas and comment markers inside string literals", () => {
        const line = new Line({ text: 'message: .asciiz "hello, # world" # greeting' });

        assert.equal(line.label, "message:");
        assert.equal(line.directive, ".asciiz");
        assert.deepEqual(line.arguments, ['"hello, # world"']);
        assert.equal(line.comment, "# greeting");
    });

    void it("preserves comment markers inside character literals", () => {
        const line = new Line({ text: "li $a0, '#' ; hash character" });

        assert.equal(line.instruction, "li");
        assert.deepEqual(line.arguments, ["$a0", "'#'"]);
        assert.equal(line.comment, "; hash character");
    });

    void it("does not split an address expression", () => {
        const line = new Line({ text: "lw $t0, 4($sp)" });

        assert.deepEqual(line.arguments, ["$t0", "4($sp)"]);
    });

    void it("parses a comment-only line", () => {
        const line = new Line({ text: "    # explanation" });

        assert.equal(line.comment, "# explanation");
        assert.equal(line.instruction, undefined);
        assert.deepEqual(line.arguments, []);
    });
});

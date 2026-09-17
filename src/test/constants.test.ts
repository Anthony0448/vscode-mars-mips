import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { allInstructions, directives, floatRegisters, registers } from "../constants";

void describe("constants", () => {
    void it("documents every instruction", () => {
        for (const [mnemonic, instruction] of Object.entries(allInstructions)) {
            assert.notEqual(instruction.description, "", `${mnemonic} has no description`);
            assert.notEqual(instruction.syntax, "", `${mnemonic} has no syntax`);
        }
    });

    void it("starts each syntax example with its own mnemonic", () => {
        for (const [mnemonic, instruction] of Object.entries(allInstructions)) {
            assert.equal(instruction.syntax.split(" ")[0], mnemonic);
        }
    });

    void it("covers the instructions students reach for most", () => {
        for (const mnemonic of ["beq", "mul", "la", "li", "syscall", "add.s", "jr"]) {
            assert.ok(allInstructions[mnemonic], `${mnemonic} is missing`);
        }
    });

    void it("documents every directive", () => {
        for (const [name, description] of Object.entries(directives)) {
            assert.notEqual(description, "", `.${name} has no description`);
        }
    });

    void it("numbers the general purpose registers 0 to 31 exactly once", () => {
        const numbers = Object.values(registers).map((register) => register.number);
        assert.deepEqual(
            [...numbers].sort((a, b) => a - b),
            [...Array(32).keys()],
        );
    });

    void it("names the temporary registers $t0-$t9 as caller-saved", () => {
        for (let index = 0; index <= 9; index++) {
            const register = registers[`t${index}`];
            assert.ok(register, `$t${index} is missing`);
            assert.match(register.description, /Temporary register/);
            assert.match(register.description, /Caller-saved/);
        }
        assert.equal(registers.t1?.number, 9);
    });

    void it("covers the floating point registers $f0-$f31", () => {
        assert.equal(Object.keys(floatRegisters).length, 32);
        assert.ok(floatRegisters.f31);
    });
});

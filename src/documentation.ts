import * as vscode from "vscode";
import { allInstructions, directives, floatRegisters, pseudoInstructions, registers } from "./constants";
import type { Instruction, Register } from "./constants";

type ResolvedRegister = { name: string; register: Register; alias?: string };

const registersByNumber = new Map(
    Object.entries(registers).map(([name, register]) => [
        register.number,
        { name, register, alias: `$${register.number}` },
    ]),
);

/**
 * Resolves a register operand such as `$t1`, `t1`, `$9` or `$f12`. MARS matches
 * register names case-sensitively, so anything but lower case is rejected here
 * too rather than documenting a name the assembler will refuse.
 */
function findRegister(text: string): ResolvedRegister | undefined {
    const name = text.startsWith("$") ? text.slice(1) : text;

    if (/^\d+$/.test(name)) {
        return registersByNumber.get(Number(name));
    }

    const floatRegister = floatRegisters[name];
    if (floatRegister !== undefined) {
        return { name, register: floatRegister };
    }

    const register = registers[name];
    return register === undefined ? undefined : { name, register, alias: `$${register.number}` };
}

function findInstruction(text: string): Instruction | undefined {
    return allInstructions[text.toLowerCase()];
}

function findDirective(text: string): string | undefined {
    return directives[(text.startsWith(".") ? text.slice(1) : text).toLowerCase()];
}

/** MARS writes its descriptions as "Short title : longer explanation". */
function emphasiseTitle(description: string): string {
    const separator = description.indexOf(" : ");
    if (separator === -1) {
        return description;
    }
    return `**${description.slice(0, separator)}** — ${description.slice(separator + 3)}`;
}

function describeInstruction(mnemonic: string, instruction: Instruction): vscode.MarkdownString {
    const markdown = new vscode.MarkdownString();
    markdown.appendCodeblock(instruction.syntax, "mips");
    markdown.appendMarkdown(emphasiseTitle(instruction.description));
    if (pseudoInstructions[mnemonic.toLowerCase()] !== undefined) {
        markdown.appendMarkdown("\n\n*Pseudo-instruction: the assembler expands it into real instructions.*");
    }
    return markdown;
}

function describeRegister({ name, register, alias }: ResolvedRegister): vscode.MarkdownString {
    const markdown = new vscode.MarkdownString();
    markdown.appendCodeblock(`$${name}`, "mips");
    markdown.appendMarkdown(register.description);
    if (alias) {
        markdown.appendMarkdown(`\n\nAlso written \`${alias}\`.`);
    }
    return markdown;
}

function describeDirective(name: string, description: string): vscode.MarkdownString {
    const markdown = new vscode.MarkdownString();
    markdown.appendCodeblock(`.${name}`, "mips");
    markdown.appendMarkdown(description);
    return markdown;
}

export { describeDirective, describeInstruction, describeRegister, findDirective, findInstruction, findRegister };
export type { ResolvedRegister };

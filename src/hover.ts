import * as vscode from "vscode";
import {
    describeDirective,
    describeInstruction,
    describeRegister,
    findDirective,
    findInstruction,
    findRegister,
} from "./documentation";
import { getConstantDefinitionFor, positionValid } from "./helpers";

// Probed in order of specificity: the "$" and "." sigils identify a register or
// a directive unambiguously, so a label called "data" is not mistaken for one.
const registerPattern = /\$[A-Za-z0-9]+/;
const directivePattern = /\.[A-Za-z_]\w*/;
const mnemonicPattern = /[A-Za-z_][\w.]*/;
const identifierPattern = /[A-Za-z_]\w*/;

class MipsyHoverProvider implements vscode.HoverProvider {
    public provideHover(document: vscode.TextDocument, position: vscode.Position): vscode.ProviderResult<vscode.Hover> {
        if (!positionValid(document, position)) {
            return;
        }

        const registerRange = document.getWordRangeAtPosition(position, registerPattern);
        if (registerRange) {
            const register = findRegister(document.getText(registerRange));
            return register && new vscode.Hover(describeRegister(register), registerRange);
        }

        const directiveRange = document.getWordRangeAtPosition(position, directivePattern);
        if (directiveRange) {
            const name = document.getText(directiveRange).slice(1);
            const description = findDirective(name);
            return description === undefined
                ? undefined
                : new vscode.Hover(describeDirective(name.toLowerCase(), description), directiveRange);
        }

        const mnemonicRange = document.getWordRangeAtPosition(position, mnemonicPattern);
        if (mnemonicRange) {
            const mnemonic = document.getText(mnemonicRange);
            const instruction = findInstruction(mnemonic);
            if (instruction) {
                return new vscode.Hover(describeInstruction(mnemonic, instruction), mnemonicRange);
            }
        }

        const identifierRange = document.getWordRangeAtPosition(position, identifierPattern);
        if (!identifierRange) {
            return undefined;
        }

        const constantDefinition = getConstantDefinitionFor(document, document.getText(identifierRange));
        if (constantDefinition) {
            const definitionLineText = document.lineAt(constantDefinition.range.start.line).text;
            return new vscode.Hover(
                new vscode.MarkdownString().appendCodeblock(definitionLineText.trim(), "mips"),
                identifierRange,
            );
        }

        return undefined;
    }
}

export { MipsyHoverProvider };

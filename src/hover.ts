import * as vscode from "vscode";
import { allInstructions, directives, registers } from "./constants";
import { getConstantDefinitionFor, positionValid } from "./helpers";

class MipsyHoverProvider implements vscode.HoverProvider {
    public provideHover(document: vscode.TextDocument, position: vscode.Position): vscode.ProviderResult<vscode.Hover> {
        if (!positionValid(document, position)) {
            return;
        }

        const wordRange = document.getWordRangeAtPosition(position, /[A-Za-z_][\w]*/);
        if (!wordRange) {
            return;
        }

        const rawWord = document.getText(wordRange);
        const word = rawWord.toLowerCase();
        const instructionDescription = allInstructions[word];
        if (instructionDescription !== undefined) {
            return new vscode.Hover(instructionDescription);
        }

        const directiveDescription = directives[word];
        if (directiveDescription !== undefined) {
            return new vscode.Hover(directiveDescription);
        }

        const registerDescription = registers[word];
        if (registerDescription !== undefined) {
            return new vscode.Hover(registerDescription);
        }

        const constantDefinition = getConstantDefinitionFor(document, rawWord);
        if (constantDefinition) {
            const definitionLineText = document.lineAt(constantDefinition.range.start.line).text;
            return new vscode.Hover(new vscode.MarkdownString().appendCodeblock(definitionLineText, "mips"));
        }

        return undefined;
    }
}

export { MipsyHoverProvider };

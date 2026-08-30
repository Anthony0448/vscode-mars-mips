import type * as vscode from "vscode";
import {
    getConstantDefinitionFor,
    getConstantUsagesFor,
    getLabelDefinitionFor,
    getLabelUsagesFor,
    positionValid,
} from "./helpers";

function getWordAtPosition(document: vscode.TextDocument, position: vscode.Position): string | undefined {
    if (!positionValid(document, position)) {
        return undefined;
    }

    const range = document.getWordRangeAtPosition(position, /[A-Za-z_.$][\w.$]*/);
    return range ? document.getText(range) : undefined;
}

class MipsyDefinitionProvider implements vscode.DefinitionProvider {
    public provideDefinition(
        document: vscode.TextDocument,
        position: vscode.Position,
    ): vscode.ProviderResult<vscode.Definition> {
        const word = getWordAtPosition(document, position);
        if (!word) {
            return undefined;
        }

        return getLabelDefinitionFor(document, word) ?? getConstantDefinitionFor(document, word);
    }
}

class MipsyReferenceProvider implements vscode.ReferenceProvider {
    public provideReferences(
        document: vscode.TextDocument,
        position: vscode.Position,
        context: vscode.ReferenceContext,
    ): vscode.ProviderResult<vscode.Location[]> {
        const word = getWordAtPosition(document, position);
        if (!word) {
            return undefined;
        }

        const labelDefinition = getLabelDefinitionFor(document, word);
        const definition = labelDefinition ?? getConstantDefinitionFor(document, word);
        if (!definition) {
            return undefined;
        }

        const references = labelDefinition ? getLabelUsagesFor(document, word) : getConstantUsagesFor(document, word);

        return context.includeDeclaration
            ? references
            : references.filter((reference) => !reference.range.isEqual(definition.range));
    }
}

export { MipsyDefinitionProvider, MipsyReferenceProvider };

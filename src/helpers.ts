import * as vscode from "vscode";

type Keyword = { name: string; location: vscode.Location };
type KeywordUsages = { name: string; locations: vscode.Location[] };

const labelPattern = /(?:^|[^A-Za-z0-9_.$])([A-Za-z_.$][\w.$]*)\s*:/g;
const constantPattern = /(?:^|[^A-Za-z0-9_.$])([A-Za-z_.$][\w.$]*)\s*=(?!=)/g;

function getDefinitions(document: vscode.TextDocument, pattern: RegExp): Keyword[] {
    const definitions: Keyword[] = [];

    for (let lineIndex = 0; lineIndex < document.lineCount; lineIndex++) {
        const text = document.lineAt(lineIndex).text;
        for (const match of text.matchAll(pattern)) {
            const name = match[1];
            if (!name || match.index === undefined) {
                continue;
            }

            const character = match.index + match[0].indexOf(name);
            const start = new vscode.Position(lineIndex, character);
            if (!positionValid(document, start)) {
                continue;
            }

            definitions.push({
                name,
                location: new vscode.Location(document.uri, new vscode.Range(start, start.translate(0, name.length))),
            });
        }
    }

    return definitions;
}

function escapeRegularExpression(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getUsagesFor(document: vscode.TextDocument, symbol: string): vscode.Location[] {
    const usages: vscode.Location[] = [];
    const pattern = new RegExp(`(^|[^A-Za-z0-9_.$])(${escapeRegularExpression(symbol)})(?![A-Za-z0-9_.$])`, "g");

    for (let lineIndex = 0; lineIndex < document.lineCount; lineIndex++) {
        const text = document.lineAt(lineIndex).text;
        for (const match of text.matchAll(pattern)) {
            const prefix = match[1] ?? "";
            const character = (match.index ?? 0) + prefix.length;
            const start = new vscode.Position(lineIndex, character);
            if (!positionValid(document, start)) {
                continue;
            }

            usages.push(new vscode.Location(document.uri, new vscode.Range(start, start.translate(0, symbol.length))));
        }
    }

    return usages;
}

function getLabelDefinitions(document: vscode.TextDocument): Keyword[] {
    return getDefinitions(document, labelPattern);
}

function getLabelDefinitionFor(document: vscode.TextDocument, label: string): vscode.Location | undefined {
    return getLabelDefinitions(document).find(({ name }) => name === label)?.location;
}

function getLabelUsages(document: vscode.TextDocument): KeywordUsages[] {
    return [...new Set(getLabelDefinitions(document).map(({ name }) => name))].map((name) => ({
        name,
        locations: getLabelUsagesFor(document, name),
    }));
}

function getLabelUsagesFor(document: vscode.TextDocument, label: string): vscode.Location[] {
    return getUsagesFor(document, label);
}

function getConstantDefinitions(document: vscode.TextDocument): Keyword[] {
    return getDefinitions(document, constantPattern);
}

function getConstantDefinitionFor(document: vscode.TextDocument, constant: string): vscode.Location | undefined {
    return getConstantDefinitions(document).find(({ name }) => name === constant)?.location;
}

function getConstantUsages(document: vscode.TextDocument): KeywordUsages[] {
    return [...new Set(getConstantDefinitions(document).map(({ name }) => name))].map((name) => ({
        name,
        locations: getConstantUsagesFor(document, name),
    }));
}

function getConstantUsagesFor(document: vscode.TextDocument, constant: string): vscode.Location[] {
    return getUsagesFor(document, constant);
}

function positionValid(document: vscode.TextDocument, position: vscode.Position): boolean {
    const textBefore = document.lineAt(position.line).text.slice(0, position.character);
    let quote: "'" | '"' | undefined;
    let escaped = false;

    for (const character of textBefore) {
        if (escaped) {
            escaped = false;
            continue;
        }

        if (character === "\\" && quote) {
            escaped = true;
            continue;
        }

        if (character === quote) {
            quote = undefined;
        } else if (!quote && (character === "'" || character === '"')) {
            quote = character;
        } else if (!quote && (character === "#" || character === ";")) {
            return false;
        }
    }

    return quote === undefined;
}

export {
    getConstantDefinitionFor,
    getConstantDefinitions,
    getConstantUsages,
    getConstantUsagesFor,
    getLabelDefinitionFor,
    getLabelDefinitions,
    getLabelUsages,
    getLabelUsagesFor,
    positionValid,
};

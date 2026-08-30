import * as vscode from "vscode";
import { getConstantUsages, getLabelUsages } from "./helpers";

const tokensLegend = new vscode.SemanticTokensLegend(["label", "variable"], ["readonly"]);

type SemanticToken = {
    range: vscode.Range;
    type: "label" | "variable";
    modifiers?: readonly string[];
};

class MipsySemanticTokensProvider implements vscode.DocumentSemanticTokensProvider {
    public provideDocumentSemanticTokens(document: vscode.TextDocument): vscode.ProviderResult<vscode.SemanticTokens> {
        const tokens = new Map<string, SemanticToken>();

        for (const label of getLabelUsages(document)) {
            for (const location of label.locations) {
                tokens.set(this.rangeKey(location.range), { range: location.range, type: "label" });
            }
        }

        for (const constant of getConstantUsages(document)) {
            for (const location of constant.locations) {
                const key = this.rangeKey(location.range);
                if (!tokens.has(key)) {
                    tokens.set(key, { range: location.range, type: "variable", modifiers: ["readonly"] });
                }
            }
        }

        const builder = new vscode.SemanticTokensBuilder(tokensLegend);
        const sortedTokens = [...tokens.values()].sort((left, right) => left.range.start.compareTo(right.range.start));
        for (const token of sortedTokens) {
            builder.push(token.range, token.type, token.modifiers);
        }

        return builder.build();
    }

    private rangeKey(range: vscode.Range): string {
        return `${range.start.line}:${range.start.character}:${range.end.character}`;
    }
}

export { tokensLegend, MipsySemanticTokensProvider };

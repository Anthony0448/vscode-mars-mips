import * as vscode from "vscode";
import { MipsyCompletionItemProvider } from "./completion";
import * as commands from "./commands";
import { MipsyDefinitionProvider, MipsyReferenceProvider } from "./definitions";
import formatter from "./formatter";
import { MipsyHoverProvider } from "./hover";
import { MipsySemanticTokensProvider, tokensLegend } from "./semanticTokens";

const LANGUAGE_ID = "MIPS";

export function activate(context: vscode.ExtensionContext): void {
    const completionProvider = new MipsyCompletionItemProvider();

    context.subscriptions.push(
        vscode.languages.registerHoverProvider(LANGUAGE_ID, new MipsyHoverProvider()),
        vscode.languages.registerCompletionItemProvider(
            LANGUAGE_ID,
            completionProvider,
            ...MipsyCompletionItemProvider.triggerCharacters,
        ),
        vscode.languages.registerDefinitionProvider(LANGUAGE_ID, new MipsyDefinitionProvider()),
        vscode.languages.registerReferenceProvider(LANGUAGE_ID, new MipsyReferenceProvider()),
        vscode.languages.registerDocumentSemanticTokensProvider(
            LANGUAGE_ID,
            new MipsySemanticTokensProvider(),
            tokensLegend,
        ),
        vscode.languages.registerDocumentFormattingEditProvider(LANGUAGE_ID, {
            provideDocumentFormattingEdits: formatter,
        }),
    );

    commands.registerCommands(context);
}

function splitComment(text: string): { code: string; comment?: string } {
    let quote: "'" | '"' | undefined;
    let escaped = false;

    for (let index = 0; index < text.length; index++) {
        const character = text[index];

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
            continue;
        }

        if (!quote && (character === "'" || character === '"')) {
            quote = character;
            continue;
        }

        if (!quote && (character === "#" || character === ";")) {
            return {
                code: text.slice(0, index).trimEnd(),
                comment: text.slice(index),
            };
        }
    }

    return { code: text.trimEnd() };
}

function splitArguments(text: string): string[] {
    const argumentsList: string[] = [];
    let start = 0;
    let quote: "'" | '"' | undefined;
    let escaped = false;
    let parenthesisDepth = 0;

    for (let index = 0; index < text.length; index++) {
        const character = text[index];

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
            continue;
        }

        if (!quote && (character === "'" || character === '"')) {
            quote = character;
            continue;
        }

        if (quote) {
            continue;
        }

        if (character === "(") {
            parenthesisDepth++;
        } else if (character === ")") {
            parenthesisDepth = Math.max(0, parenthesisDepth - 1);
        } else if (character === "," && parenthesisDepth === 0) {
            const argument = text.slice(start, index).trim();
            if (argument) {
                argumentsList.push(argument);
            }
            start = index + 1;
        }
    }

    const finalArgument = text.slice(start).trim();
    if (finalArgument) {
        argumentsList.push(finalArgument);
    }

    return argumentsList;
}

export default class Line {
    public directive?: string;

    public label?: string;

    public instruction?: string;

    public arguments: string[] = [];

    public comment?: string;

    public constructor(line: { readonly text: string }) {
        const parsed = splitComment(line.text.trim());
        let text = parsed.code.trim();
        this.comment = parsed.comment;

        const labelMatch = text.match(/^[A-Za-z_.$][\w.$]*:/);
        if (labelMatch) {
            this.label = labelMatch[0];
            text = text.slice(this.label.length).trimStart();
        }

        const directiveMatch = text.match(/^\.[A-Za-z_][\w.]*/);
        if (directiveMatch) {
            this.directive = directiveMatch[0];
            text = text.slice(this.directive.length).trimStart();
        } else {
            const instructionMatch = text.match(/^\S+/);
            if (instructionMatch) {
                this.instruction = instructionMatch[0];
                text = text.slice(this.instruction.length).trimStart();
            }
        }

        this.arguments = splitArguments(text);
    }
}

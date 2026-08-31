import type Line from "./Line";

export type MipsFormattingOptions = {
    commentColumn: number;
    insertSpaces: boolean;
    tabSize: number;
};

function nextTabStop(value: number, tabSize: number): number {
    return Math.floor(value / tabSize + 1) * tabSize;
}

function visualWidth(text: string, tabSize: number): number {
    let width = 0;
    for (const character of text) {
        width = character === "\t" ? width + tabSize - (width % tabSize) : width + 1;
    }
    return width;
}

function normalizeWhitespace(text: string): string {
    let result = "";
    let quote: "'" | '"' | undefined;
    let escaped = false;
    let pendingSpace = false;

    for (const character of text.trim()) {
        if (escaped) {
            result += character;
            escaped = false;
            continue;
        }

        if (character === "\\" && quote) {
            result += character;
            escaped = true;
            continue;
        }

        if (character === quote) {
            result += character;
            quote = undefined;
            continue;
        }

        if (!quote && (character === "'" || character === '"')) {
            if (pendingSpace && result) {
                result += " ";
            }
            pendingSpace = false;
            result += character;
            quote = character;
            continue;
        }

        if (!quote && /\s/.test(character)) {
            pendingSpace = true;
            continue;
        }

        if (pendingSpace && result) {
            result += " ";
        }
        pendingSpace = false;
        result += character;
    }

    return result;
}

function padForComment(text: string, commentColumn: number, tabSize: number): string {
    const width = visualWidth(text, tabSize);
    return text + " ".repeat(Math.max(2, commentColumn - width));
}

function normalizeBlankLines(formattedLines: readonly string[], sourceLines: readonly Line[]): string[] {
    const hasParagraphBreaks = formattedLines.some((line, index) => !line && index > 0 && !formattedLines[index - 1]);

    if (!hasParagraphBreaks) {
        return formattedLines.filter((line, index) => line || index === 0 || formattedLines[index - 1] !== "");
    }

    const normalized: string[] = [];
    for (let index = 0; index < formattedLines.length;) {
        const line = formattedLines[index];
        if (line) {
            normalized.push(line);
            index += 1;
            continue;
        }

        let nextContent = index;
        while (nextContent < formattedLines.length && !formattedLines[nextContent]) {
            nextContent += 1;
        }

        const blankCount = nextContent - index;
        const previousLine = sourceLines[index - 1];
        const nextLine = sourceLines[nextContent];
        const interruptsCode =
            nextLine?.instruction !== undefined &&
            (previousLine?.instruction !== undefined || previousLine?.label !== undefined);
        const shouldKeep = blankCount > 1 || !interruptsCode;
        if (shouldKeep && normalized.length > 0 && nextContent < formattedLines.length) {
            normalized.push("");
        }
        index = nextContent;
    }

    return normalized;
}

export function formatLines(lines: readonly Line[], options: MipsFormattingOptions): string[] {
    const tabSize = Math.max(1, options.tabSize);
    const commentColumn = Math.max(1, options.commentColumn);
    const indent = options.insertSpaces ? " ".repeat(tabSize) : "\t";

    const longestLabel = lines.reduce(
        (length, line) => Math.max(length, line.label && (line.directive || line.instruction) ? line.label.length : 0),
        0,
    );
    const longestDirective = lines.reduce(
        (length, line) => Math.max(length, line.directive && line.arguments.length > 0 ? line.directive.length : 0),
        0,
    );
    const longestInstruction = lines.reduce(
        (length, line) => Math.max(length, line.instruction && line.arguments.length > 0 ? line.instruction.length : 0),
        0,
    );

    const labelWidth = longestLabel > 0 ? nextTabStop(longestLabel, tabSize) : 0;
    const directiveWidth = longestDirective > 0 ? nextTabStop(longestDirective, tabSize) : 0;
    const instructionWidth =
        longestInstruction > 0 ? Math.max(2 * tabSize, nextTabStop(longestInstruction, tabSize)) : 0;

    const formattedLines = lines.map((line) => {
        let result = "";

        if (line.label) {
            result += line.directive || line.instruction ? line.label.padEnd(labelWidth, " ") : line.label;
        }

        if (line.directive) {
            result += line.arguments.length > 0 ? line.directive.padEnd(directiveWidth, " ") : line.directive;
        }

        if (line.instruction) {
            if (!line.label) {
                result += indent;
            }
            result += line.arguments.length > 0 ? line.instruction.padEnd(instructionWidth, " ") : line.instruction;
        }

        if (line.arguments.length > 0) {
            result += line.arguments.map(normalizeWhitespace).join(", ");
        }

        if (line.comment) {
            result = result ? `${padForComment(result, commentColumn, tabSize)}${line.comment}` : line.comment;
        }

        return result.trimEnd();
    });

    return normalizeBlankLines(formattedLines, lines);
}

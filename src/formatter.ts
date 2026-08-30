import { EndOfLine, Position, Range, type FormattingOptions, type TextDocument, TextEdit, workspace } from "vscode";
import { formatLines } from "./formatting";
import Line from "./Line";

export default function formatter(document: TextDocument, options: FormattingOptions): TextEdit[] {
    const lines = Array.from({ length: document.lineCount }, (_, index) => new Line(document.lineAt(index)));
    const commentColumn = workspace.getConfiguration("mars-mips", document).get<number>("formatterCommentColumn", 32);
    const edits = formatLines(lines, {
        commentColumn,
        insertSpaces: options.insertSpaces,
        tabSize: options.tabSize,
    });

    const range = new Range(new Position(0, 0), document.lineAt(document.lineCount - 1).range.end);
    const endOfLine = document.eol === EndOfLine.CRLF ? "\r\n" : "\n";
    return [TextEdit.replace(range, edits.join(endOfLine))];
}

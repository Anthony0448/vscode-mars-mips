import { spawn } from "node:child_process";
import { access } from "node:fs/promises";
import * as vscode from "vscode";

const CONFIGURATION_SECTION = "mars-mips";
const TASK_TYPE = "mars-mips";

function getJavaPath(resource?: vscode.Uri): string {
    return (
        vscode.workspace.getConfiguration(CONFIGURATION_SECTION, resource).get<string>("javaPath", "java").trim() ||
        "java"
    );
}

function getMarsPath(context: vscode.ExtensionContext, resource?: vscode.Uri): string {
    const configuredPath = vscode.workspace
        .getConfiguration(CONFIGURATION_SECTION, resource)
        .get<string>("marsPath")
        ?.trim();

    return configuredPath || vscode.Uri.joinPath(context.extensionUri, "mars.jar").fsPath;
}

async function getRunnableDocument(): Promise<vscode.TextDocument | undefined> {
    if (!vscode.workspace.isTrusted) {
        await vscode.window.showErrorMessage("Trust this workspace before running MARS code.");
        return undefined;
    }

    const document = vscode.window.activeTextEditor?.document;
    if (!document || document.languageId !== "MIPS") {
        await vscode.window.showErrorMessage("Open a MIPS file before running MARS.");
        return undefined;
    }

    if (document.isUntitled || document.uri.scheme !== "file") {
        await vscode.window.showErrorMessage("Save the MIPS file before running MARS.");
        return undefined;
    }

    if (document.isDirty && !(await document.save())) {
        await vscode.window.showErrorMessage("The MIPS file could not be saved.");
        return undefined;
    }

    return document;
}

async function ensureMarsExists(marsPath: string): Promise<boolean> {
    try {
        await access(marsPath);
        return true;
    } catch {
        await vscode.window.showErrorMessage(
            "MARS could not be found. Set mars-mips.marsPath to a valid MARS JAR file.",
        );
        return false;
    }
}

async function executeMarsTask(
    context: vscode.ExtensionContext,
    name: string,
    marsArguments: readonly string[],
): Promise<void> {
    const document = await getRunnableDocument();
    if (!document) {
        return;
    }

    const marsPath = getMarsPath(context, document.uri);
    if (!(await ensureMarsExists(marsPath))) {
        return;
    }

    const execution = new vscode.ProcessExecution(
        getJavaPath(document.uri),
        ["-jar", marsPath, ...marsArguments, document.uri.fsPath],
        {
            cwd: vscode.Uri.joinPath(document.uri, "..").fsPath,
        },
    );
    const task = new vscode.Task(
        { type: TASK_TYPE, command: name },
        vscode.TaskScope.Workspace,
        name,
        "MARS MIPS",
        execution,
    );
    task.presentationOptions = {
        clear: true,
        echo: true,
        focus: false,
        panel: vscode.TaskPanelKind.Shared,
        reveal: vscode.TaskRevealKind.Always,
    };

    await vscode.tasks.executeTask(task);
}

async function openMars(context: vscode.ExtensionContext): Promise<void> {
    const marsPath = getMarsPath(context);
    if (!(await ensureMarsExists(marsPath))) {
        return;
    }

    const child = spawn(getJavaPath(), ["-jar", marsPath], {
        detached: true,
        stdio: "ignore",
    });

    child.once("error", (error) => {
        void vscode.window.showErrorMessage(`MARS could not be opened: ${error.message}`);
    });
    child.unref();
}

export function registerCommands(context: vscode.ExtensionContext): void {
    context.subscriptions.push(
        vscode.commands.registerCommand("mars-mips.assembleExec", () =>
            executeMarsTask(context, "Assemble and run", ["nc", "me"]),
        ),
        vscode.commands.registerCommand("mars-mips.assembleMips", () =>
            executeMarsTask(context, "Assemble", ["me", "a"]),
        ),
        vscode.commands.registerCommand("mars-mips.debugMips", () =>
            executeMarsTask(context, "Debug", ["nc", "me", "d"]),
        ),
        vscode.commands.registerCommand("mars-mips.openMars", () => openMars(context)),
    );
}

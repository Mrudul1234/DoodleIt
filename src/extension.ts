import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

let panel: vscode.WebviewPanel | undefined;

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('doodleit.open', () => {
    if (panel) {
      panel.reveal(vscode.ViewColumn.Two);
      return;
    }

    panel = vscode.window.createWebviewPanel(
      'doodleit',
      '✏️ DoodleIt',
      vscode.ViewColumn.Two,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [
          vscode.Uri.file(path.join(context.extensionPath, 'media'))
        ]
      }
    );

    const htmlPath = path.join(context.extensionPath, 'media', 'whiteboard.html');
    panel.webview.html = fs.readFileSync(htmlPath, 'utf8');

    panel.webview.onDidReceiveMessage(
      message => {
        if (message.command === 'alert') {
          vscode.window.showInformationMessage(message.text);
        }
      },
      undefined,
      context.subscriptions
    );

    panel.onDidDispose(() => {
      panel = undefined;
    }, null, context.subscriptions);
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}

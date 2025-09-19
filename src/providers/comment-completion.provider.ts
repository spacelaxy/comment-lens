import * as vscode from 'vscode';
import { ConfigurationService } from '../services';

export class CommentCompletionProvider implements vscode.CompletionItemProvider {
  
  provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, _token: vscode.CancellationToken, _context: vscode.CompletionContext): vscode.ProviderResult<Array<vscode.CompletionItem>> {
    const commentPatterns = ConfigurationService.getPatterns();
    
    if(this.isInsideComment(document, position)) {
      const completionItems = commentPatterns.map(pattern => {
        const item = new vscode.CompletionItem(pattern.pattern, vscode.CompletionItemKind.Text);
        item.insertText = pattern.pattern.startsWith('@') ? pattern.pattern.substring(1) : pattern.pattern;
        item.detail = `Comment Lens: ${pattern.name}`;
        return item;
      });
      return completionItems;
    }
    
    return [];
  }
  
  private isInsideComment(document: vscode.TextDocument, position: vscode.Position): boolean {
    const lineText = document.lineAt(position.line).text.substring(0, position.character);
    const trimmedLine = lineText.trim();

    if (trimmedLine.startsWith('//') || trimmedLine.startsWith('/*') || trimmedLine.startsWith('*') || trimmedLine.startsWith('#') || trimmedLine.startsWith('<!--')) {
      return true;
    }

    if (document.languageId === 'python') {
      const text = document.getText();
      const offset = document.offsetAt(position);
      const docstringRegex = /("""[\s\S]*?"""|'''[\s\S]*?''')/g;
      let match;
      while ((match = docstringRegex.exec(text)) !== null) {
        const start = match.index;
        const end = start + match[0].length;
        if (offset >= start && offset <= end) {
          return true;
        }
      }
    }

    return false;
  }
}
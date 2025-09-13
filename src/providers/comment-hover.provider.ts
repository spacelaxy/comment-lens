import * as vscode from 'vscode';
import { CommentHighlightProvider } from './comment-highlight.provider';

export class CommentHoverProvider implements vscode.HoverProvider {
  private highlightProvider: CommentHighlightProvider;

  constructor(highlightProvider: CommentHighlightProvider) {
    this.highlightProvider = highlightProvider;
  }

  provideHover(_document: vscode.TextDocument, position: vscode.Position, _token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> {
    const highlightComment = this.highlightProvider.getHighlightComment(position);
    
    if(highlightComment) {
      const hoverMessage = new vscode.MarkdownString();
      hoverMessage.appendMarkdown(`**@highlight**\n\n${highlightComment}`);
      return new vscode.Hover(hoverMessage);
    }

    return null;
  }
}
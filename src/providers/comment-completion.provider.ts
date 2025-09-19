import * as vscode from 'vscode';
import { CommentPattern } from '../types';

export class CommentCompletionProvider implements vscode.CompletionItemProvider {
  private patterns: Array<CommentPattern> = [];

  constructor(patterns: Array<CommentPattern>) {
    this.patterns = patterns;
  }

  updatePatterns(patterns: Array<CommentPattern>): void {
    this.patterns = patterns;
  }

  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    _token: vscode.CancellationToken,
    _context: vscode.CompletionContext
  ): vscode.ProviderResult<Array<vscode.CompletionItem> | vscode.CompletionList> {
    const line = document.lineAt(position);
    const textBeforeCursor = line.text.substring(0, position.character);
    
    if(!this.isInComment(line.text, position.character)) return [];

    const atMatch = textBeforeCursor.match(/@(\w*)$/);
    if(!atMatch) return [];

    const typedText = atMatch[1] || '';
    const completionItems: Array<vscode.CompletionItem> = [];

    this.patterns.forEach(pattern => {
        if(pattern.enabled && pattern.pattern.startsWith('@')) {
          const patternText = pattern.pattern.substring(1);
          
          if(patternText.toLowerCase().startsWith(typedText.toLowerCase())) {
            const item = new vscode.CompletionItem(
              patternText,
              vscode.CompletionItemKind.Keyword
            );
            
            item.detail = pattern.name;
            item.documentation = this.getPatternDocumentation(pattern);
            item.insertText = patternText;
            item.sortText = pattern.id;
            
            completionItems.push(item);
          }
        }
    });

    return completionItems;
  }

  private isInComment(line: string, character: number): boolean {
    const trimmedLine = line.trim();
    
    if(trimmedLine.startsWith('//')) return true;
    if(trimmedLine.startsWith('#')) return true;
    if(trimmedLine.startsWith('<!--')) return true;
    if(trimmedLine.startsWith('--')) return true;
    
    const blockCommentMatch = line.match(/\/\*(.*?)\*\//);
    const luaBlockCommentMatch = line.match(/--\[\[(.*?)\]\]/);
    if(blockCommentMatch) {
      const commentStart = line.indexOf('/*');
      const commentEnd = line.indexOf('*/');
      return character >= commentStart && character <= commentEnd + 2;
    }
    
    if(luaBlockCommentMatch) {
      const commentStart = line.indexOf('--[[');
      const commentEnd = line.indexOf(']]');
      return character >= commentStart && character <= commentEnd + 2;
    }
    
    return false;
  }

  private getPatternDocumentation(pattern: CommentPattern): vscode.MarkdownString {
    const md = new vscode.MarkdownString();
    
    switch (pattern.id) {
      case 'warn':
        md.appendMarkdown('**Warning** - For important warnings and alerts');
        break;
      case 'question':
        md.appendMarkdown('**Question** - For questions and doubts');
        break;
      case 'todo':
        md.appendMarkdown('**TODO** - For pending tasks');
        break;
      case 'fixme':
        md.appendMarkdown('**FIXME** - For bugs and necessary fixes');
        break;
      case 'note':
        md.appendMarkdown('**Note** - For important notes and observations');
        break;
      case 'highlight':
        md.appendMarkdown('**Highlight** - For highlighting specific lines\n\nExample: `@highlight: 5-10`');
        break;
      case 'test':
        md.appendMarkdown('**Test** - For marking test code');
        break;
      case 'status':
        md.appendMarkdown('**Status** - For indicating code status');
        break;
      default:
        md.appendMarkdown(`**${pattern.name}** - ${pattern.pattern}`);
    }
    
    return md;
  }
}
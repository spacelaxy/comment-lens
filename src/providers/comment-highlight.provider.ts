import * as vscode from 'vscode';
import { CommentPattern } from '../types';
import { ConfigurationService } from '../services';
import { LINE_COMMENT_PREFIXES, BLOCK_COMMENT_REGEX, BLOCK_COMMENT_START_LENGTH } from '../config';

export class CommentHighlightProvider {
  private decorations: Map<string, vscode.TextEditorDecorationType> = new Map();
  private activeEditor: vscode.TextEditor | undefined;
  private highlightComments: Map<vscode.Range, string> = new Map();
  private highlightRanges: Map<vscode.Range, string> = new Map();
  private highlightCommentLines: Map<number, Array<vscode.Range>> = new Map();
  private currentCursorLine: number = -1;
  private highlightLinesDecoration: vscode.TextEditorDecorationType | undefined;
  
  constructor() {
    this.activeEditor = vscode.window.activeTextEditor;
    this.setupEventListeners();
    this.updateDecorations();
  }
  
  private setupEventListeners(): void {
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      this.activeEditor = editor;
      this.updateDecorations();
    });
    
    vscode.workspace.onDidChangeTextDocument((e) => {
      if(this.activeEditor && e.document === this.activeEditor.document) this.updateDecorations();
    });
    
    vscode.workspace.onDidOpenTextDocument(() => {
      this.activeEditor = vscode.window.activeTextEditor;
      this.updateDecorations();
    });
    
    vscode.window.onDidChangeTextEditorSelection((event) => {
      if(event.textEditor === this.activeEditor) {
        const newLine = event.selections[0]?.active.line ?? -1;
        if(newLine !== this.currentCursorLine) {
          this.currentCursorLine = newLine;
          this.updateHighlightDecorations();
        }
      }
    });
    
    ConfigurationService.onConfigurationChanged(() => {
      this.clearDecorations();
      this.updateDecorations();
    });
  }
  
  private createDecorationType(pattern: CommentPattern): vscode.TextEditorDecorationType {
    const decorationOptions: vscode.DecorationRenderOptions = {
      fontWeight: '500'
    };
    
    if(pattern.id === 'highlight') {
      decorationOptions.border = `0 0 0 3px ${pattern.textColor}`;
      decorationOptions.borderRadius = '2px';
      decorationOptions.backgroundColor = pattern.backgroundColor;
      decorationOptions.color = pattern.textColor;
    } else {
      if(pattern.showTextColor) decorationOptions.color = pattern.textColor;
      if(pattern.showBackgroundColor) {
        decorationOptions.backgroundColor = pattern.backgroundColor;
        decorationOptions.borderRadius = '3px';
      }
    }
    
    const decorationType = vscode.window.createTextEditorDecorationType(decorationOptions);
    
    this.decorations.set(pattern.id, decorationType);
    return decorationType;
  }

  private getHighlightLinesDecorationType(pattern: CommentPattern): vscode.TextEditorDecorationType {
    if(!this.highlightLinesDecoration) {
      const decorationOptions: vscode.DecorationRenderOptions = {
        border: `0 0 0 3px ${pattern.textColor}`,
        borderRadius: '2px',
        backgroundColor: pattern.backgroundColor
      };
      
      this.highlightLinesDecoration = vscode.window.createTextEditorDecorationType(decorationOptions);
    }
    return this.highlightLinesDecoration;
  }
  
  
  private getDecorationType(pattern: CommentPattern): vscode.TextEditorDecorationType {
    let decorationType = this.decorations.get(pattern.id);
    if(!decorationType) decorationType = this.createDecorationType(pattern);
    return decorationType;
  }
  
  private findCommentRanges(text: string, pattern: CommentPattern): Array<vscode.Range> {
    const ranges: Array<vscode.Range> = [];
    const lines = text.split('\n');
    
    for(let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex];
      if(!line) continue;
      
      const commentMatch = this.findCommentInLine(line);
      if(!commentMatch) continue;
      
      const { commentText, commentStart } = commentMatch;
      const patternIndex = commentText.indexOf(pattern.pattern);
      
      if(patternIndex !== -1) {
        if(pattern.id === 'highlight') {
          const highlightRanges = this.parseHighlightRanges(commentText, lineIndex, pattern);
          
          highlightRanges.forEach(range => {
            this.highlightRanges.set(range, commentText);
          });
          
          ranges.push(...highlightRanges);
          
          const commentPrefix = this.getLineCommentPrefix(this.activeEditor?.document.languageId);
          const prefixIndex = commentStart - commentPrefix.length;
          const startPos = new vscode.Position(lineIndex, prefixIndex);
          const endPos = new vscode.Position(lineIndex, line.length);
          ranges.push(new vscode.Range(startPos, endPos));
        } else if(pattern.showBackgroundColor) {
          const commentPrefix = this.getLineCommentPrefix(this.activeEditor?.document.languageId);
          const prefixIndex = commentStart - commentPrefix.length;
          const startPos = new vscode.Position(lineIndex, prefixIndex);
          const endPos = new vscode.Position(lineIndex, line.length);
          ranges.push(new vscode.Range(startPos, endPos));
        } else {
          const startPos = new vscode.Position(lineIndex, commentStart + patternIndex);
          const endPos = new vscode.Position(lineIndex, commentStart + patternIndex + pattern.pattern.length);
          ranges.push(new vscode.Range(startPos, endPos));
        }
      }
    }
    
    return ranges;
  }
  
  private parseHighlightRanges(commentText: string, commentLineIndex: number, _pattern: CommentPattern): Array<vscode.Range> {
    const ranges: Array<vscode.Range> = [];
    
    const highlightMatch = commentText.match(/@highlight:\s*(\d+)-(\d+)(.*)/);
    if(!highlightMatch) return ranges;
    
    const startLine = parseInt(highlightMatch[1] || '0') - 1;
    const endLine = parseInt(highlightMatch[2] || '0') - 1;
    const comment = highlightMatch[3]?.trim() || '';
    
    if(startLine < 0 || endLine < startLine) return ranges;
    
    const totalLines = this.activeEditor?.document.lineCount || 0;
    const actualEndLine = Math.min(endLine, totalLines - 1);
    
    for(let lineIndex = startLine; lineIndex <= actualEndLine; lineIndex++) {
      const line = this.activeEditor?.document.lineAt(lineIndex);
      if(!line) continue;
      
      const startPos = new vscode.Position(lineIndex, 0);
      const endPos = new vscode.Position(lineIndex, line.text.length);
      const range = new vscode.Range(startPos, endPos);
      
      this.highlightComments.set(range, comment);
      ranges.push(range);
    }
    
    this.highlightCommentLines.set(commentLineIndex, ranges);
    return ranges;
  }
  
  private findCommentInLine(line: string): { commentText: string; commentStart: number } | null {
    const trimmedLine = line.trim();
    const languageId = this.getEffectiveLanguageId();
    
    if(this.isBlockComment(trimmedLine, languageId)) {
      const blockMatch = line.match(this.getBlockCommentRegex(languageId));
      if(blockMatch && blockMatch[1] !== undefined) {
        return {
          commentText: blockMatch[1],
          commentStart: line.indexOf(blockMatch[0]) + this.getBlockCommentStartLength(languageId)
        };
      }
    }
    
    if(this.isLineComment(trimmedLine, languageId)) {
      const prefixes = this.getLineCommentPrefixes(languageId);
      const commentPrefix = prefixes.find(prefix => trimmedLine.startsWith(prefix)) || prefixes[0];
      if(!commentPrefix) return null;
      
      const prefixIndex = line.indexOf(commentPrefix);
      return {
        commentText: line.substring(prefixIndex + commentPrefix.length),
        commentStart: prefixIndex + commentPrefix.length
      };
    }
    
    return null;
  }
  
  private getEffectiveLanguageId(): string {
    const languageId = this.activeEditor?.document.languageId;
    const fileName = this.activeEditor?.document.fileName;
    
    if(fileName) {
      if(fileName.endsWith('.env') || fileName.endsWith('.env.local') || fileName.endsWith('.env.production')) return 'dotenv';
      if(fileName.endsWith('.prisma')) return 'prisma';
      if(fileName.endsWith('.lua')) return 'lua';
    }
    
    return languageId || 'plaintext';
  }

  private isLineComment(line: string, languageId?: string): boolean {
    const effectiveLanguageId = languageId || this.getEffectiveLanguageId();
    const prefixes = this.getLineCommentPrefixes(effectiveLanguageId);
    return prefixes.some(prefix => line.startsWith(prefix));
  }
  
  private isBlockComment(line: string, languageId?: string): boolean {
    const effectiveLanguageId = languageId || this.getEffectiveLanguageId();
    const regex = this.getBlockCommentRegex(effectiveLanguageId);
    return regex.test(line);
  }
  
  private getLineCommentPrefix(languageId?: string): string {
    const effectiveLanguageId = languageId || this.getEffectiveLanguageId();
    const prefixes = this.getLineCommentPrefixes(effectiveLanguageId);
    return prefixes[0] || '//';
  }
  
  private getLineCommentPrefixes(languageId?: string): Array<string> {
    return LINE_COMMENT_PREFIXES[languageId || ''] || ['//', '#', '<!--'];
  }
  
  private getBlockCommentRegex(languageId?: string): RegExp {
    return BLOCK_COMMENT_REGEX[languageId || ''] || /\/\*(.*?)\*\//;
  }
  
  private getBlockCommentStartLength(languageId?: string): number {
    return BLOCK_COMMENT_START_LENGTH[languageId || ''] || 2;
  }
  
  private updateDecorations(): void {
    if(!this.activeEditor) return;
    
    this.highlightComments.clear();
    this.highlightRanges.clear();
    this.highlightCommentLines.clear();
    
    const patterns = ConfigurationService.getPatterns().filter(p => p.enabled);
    
    patterns.forEach(pattern => {
      const decorationType = this.getDecorationType(pattern);
      const ranges = this.findCommentRanges(this.activeEditor!.document.getText(), pattern);
      
      this.activeEditor!.setDecorations(decorationType, ranges);
    });
    
    this.applyHighlightTooltips();
    this.updateHighlightDecorations();
  }
  
  private applyHighlightTooltips(): void {
    if(!this.activeEditor || this.highlightComments.size === 0) return;
    
    const highlightPattern = ConfigurationService.getPatterns().find(p => p.id === 'highlight');
    if(!highlightPattern) return;
    
    const decorationType = this.getDecorationType(highlightPattern);
    const ranges: Array<vscode.Range> = [];
    const hoverMessages: Array<vscode.MarkdownString> = [];
    
    this.highlightComments.forEach((comment, range) => {
      if(!comment) return;
      
      ranges.push(range);
      const hoverMessage = new vscode.MarkdownString();
      hoverMessage.appendMarkdown(`**@highlight**\n\n${comment}`);
      hoverMessages.push(hoverMessage);
    });
    
    if(ranges.length > 0) this.activeEditor.setDecorations(decorationType, ranges);
  }

  private updateHighlightDecorations(): void {
    if(!this.activeEditor) return;
    
    const highlightMode = ConfigurationService.getHighlightMode();
    const highlightPattern = ConfigurationService.getPatterns().find(p => p.id === 'highlight');
    if(!highlightPattern) return;
    
    const commentDecorationType = this.getDecorationType(highlightPattern);
    const linesDecorationType = this.getHighlightLinesDecorationType(highlightPattern);
    
    let commentRanges: Array<vscode.Range> = [];
    let lineRanges: Array<vscode.Range> = [];
    
    if(highlightMode === 'always') {
      lineRanges = Array.from(this.highlightRanges.keys());
      
      this.highlightCommentLines.forEach((_ranges, lineIndex) => {
        if(!this.activeEditor) return;
        
        const commentLine = this.activeEditor.document.lineAt(lineIndex);
        const commentPrefix = this.getLineCommentPrefix(this.activeEditor.document.languageId);
        const prefixIndex = commentLine.text.indexOf(commentPrefix);
        if(prefixIndex === -1) return;
        
        const startPos = new vscode.Position(lineIndex, prefixIndex);
        const endPos = new vscode.Position(lineIndex, commentLine.text.length);
        commentRanges.push(new vscode.Range(startPos, endPos));
      });
    } else if(highlightMode === 'onHover') {
      this.highlightCommentLines.forEach((_ranges, lineIndex) => {
        if(!this.activeEditor) return;
        
        const commentLine = this.activeEditor.document.lineAt(lineIndex);
        const commentPrefix = this.getLineCommentPrefix(this.activeEditor.document.languageId);
        const prefixIndex = commentLine.text.indexOf(commentPrefix);
        if(prefixIndex === -1) return;
        
        const startPos = new vscode.Position(lineIndex, prefixIndex);
        const endPos = new vscode.Position(lineIndex, commentLine.text.length);
        commentRanges.push(new vscode.Range(startPos, endPos));
      });
      
      if(this.currentCursorLine >= 0) {
        const specificRanges = this.highlightCommentLines.get(this.currentCursorLine);
        if(specificRanges) lineRanges.push(...specificRanges);
      }
    }
    
    this.activeEditor.setDecorations(commentDecorationType, commentRanges);
    this.activeEditor.setDecorations(linesDecorationType, lineRanges);
  }

  private clearDecorations(): void {
    this.decorations.forEach(decoration => decoration.dispose());
    this.decorations.clear();
    this.highlightComments.clear();
    this.highlightRanges.clear();
    this.highlightCommentLines.clear();
    
    if(this.highlightLinesDecoration) {
      this.highlightLinesDecoration.dispose();
      this.highlightLinesDecoration = undefined;
    }
  }
  
  getHighlightComment(position: vscode.Position): string | null {
    for(const [range, comment] of this.highlightComments) {
      if(range.contains(position)) return comment;
    }
    return null;
  }

  dispose(): void {
    this.clearDecorations();
  }
}
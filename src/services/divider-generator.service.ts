import * as vscode from 'vscode';
import { DividerStyle, CommentBoxStyle } from '../types';
import { DEFAULT_DIVIDER_STYLES, DEFAULT_COMMENT_BOX_STYLES, DIVIDER_CONFIG, COMMENT_BOX_CONFIG, CommentType } from '../config';

export class DividerGeneratorService {
  private static readonly DIVIDER_CONFIG_KEY = 'commentLens.dividers';
  private static readonly COMMENT_BOX_CONFIG_KEY = 'commentLens.commentBoxes';

  static getDividerStyles(): Array<DividerStyle> {
    const config = vscode.workspace.getConfiguration();
    const customStyles = config.get<Array<DividerStyle>>(this.DIVIDER_CONFIG_KEY, []);
    
    const allStyles = [...DEFAULT_DIVIDER_STYLES];
    const enabledCustomStyles = customStyles.filter(style => style.enabled);
    allStyles.push(...enabledCustomStyles);
    
    return allStyles;
  }

  static getCommentBoxStyles(): Array<CommentBoxStyle> {
    const config = vscode.workspace.getConfiguration();
    const customStyles = config.get<Array<CommentBoxStyle>>(this.COMMENT_BOX_CONFIG_KEY, []);
    
    const allStyles = [...DEFAULT_COMMENT_BOX_STYLES];
    const enabledCustomStyles = customStyles.filter(style => style.enabled);
    allStyles.push(...enabledCustomStyles);
    
    return allStyles;
  }

  static generateDivider(style: DividerStyle, length?: number, text?: string): string {
    const actualLength = length || style.length;
    const pattern = style.pattern.repeat(Math.ceil(actualLength / style.pattern.length));
    const basePattern = pattern.substring(0, actualLength);
    
    if(!text) return basePattern;
    
    const config = vscode.workspace.getConfiguration();
    const textPosition = config.get<'left' | 'center' | 'right'>('commentLens.dividerTextPosition', 'center');
    const textWithPadding = ` ${text} `;
    const textLength = textWithPadding.length;
    
    if(textLength >= actualLength) return textWithPadding;
    
    const availableLength = actualLength - textLength;
    const sideLength = Math.floor(availableLength / 2);
    const sidePattern = style.pattern.repeat(Math.ceil(sideLength / style.pattern.length)).substring(0, sideLength);
    
    switch(textPosition) {
      case 'left':
        return `${textWithPadding}${sidePattern}${style.pattern.repeat(actualLength - textLength - sideLength)}`;
      case 'right':
        return `${sidePattern}${style.pattern.repeat(actualLength - textLength - sideLength)}${textWithPadding}`;
      case 'center':
      default:
        const leftSide = sidePattern;
        const rightSide = style.pattern.repeat(actualLength - textLength - sideLength);
        return `${leftSide}${textWithPadding}${rightSide}`;
    }
  }

  static generateCommentBox(style: CommentBoxStyle, text: string, width?: number): string {
    const actualWidth = width || 50;
    const config = vscode.workspace.getConfiguration();
    const textPosition = config.get<'left' | 'center' | 'right'>('commentLens.commentBoxTextPosition', 'center');
    const paddedText = this.padText(text, actualWidth, textPosition);
    const topLine = style.topLeft + style.horizontal.repeat(actualWidth - 2) + style.topRight;
    const bottomLine = style.bottomLeft + style.horizontal.repeat(actualWidth - 2) + style.bottomRight;
    const middleLine = style.vertical + ' ' + paddedText + ' ' + style.vertical;
    
    return `${topLine}\n${middleLine}\n${bottomLine}`;
  }

  static insertDivider(style: DividerStyle, length?: number, text?: string): void {
    const editor = vscode.window.activeTextEditor;
    if(!editor) return;

    const languageId = editor.document.languageId;
    const commentConfig = this.getDividerConfig(languageId);
    const divider = this.generateDivider(style, length, text);
    
    const position = editor.selection.active;
    const currentIndentation = this.getLineIndentation(editor.document.lineAt(position.line).text);
    
    const commentDivider = this.formatDivider(divider, commentConfig);
    
    this.insertText(editor, position, commentDivider, commentConfig, currentIndentation);
  }

  static insertCommentBox(style: CommentBoxStyle, text: string, width?: number): void {
    const editor = vscode.window.activeTextEditor;
    if(!editor) return;

    const languageId = editor.document.languageId;
    const commentConfig = this.getCommentBoxConfig(languageId);
    const commentBox = this.generateCommentBox(style, text, width);
    
    const position = editor.selection.active;
    const currentLine = editor.document.lineAt(position.line);
    let currentIndentation = this.getLineIndentation(currentLine.text);
    
    if(currentLine.text.trim() === '') {
      for(let i = position.line - 1; i >= 0; i--) {
        const line = editor.document.lineAt(i);
        if(line.text.trim() !== '') {
          currentIndentation = this.getLineIndentation(line.text);
          break;
        }
      }
    }
    
    const lines = commentBox.split('\n');
    const commentedLines = this.formatCommentBox(lines, currentIndentation, commentConfig);
    
    const insertPosition = commentConfig.isBlock 
      ? new vscode.Position(position.line, currentIndentation.length)
      : new vscode.Position(position.line, 0);
    
    this.insertText(editor, insertPosition, commentedLines, commentConfig, currentIndentation);
  }

  static async updateDividerStyles(styles: Array<DividerStyle>): Promise<void> {
    const config = vscode.workspace.getConfiguration();
    await config.update(this.DIVIDER_CONFIG_KEY, styles, vscode.ConfigurationTarget.Global);
  }

  static async updateCommentBoxStyles(styles: Array<CommentBoxStyle>): Promise<void> {
    const config = vscode.workspace.getConfiguration();
    await config.update(this.COMMENT_BOX_CONFIG_KEY, styles, vscode.ConfigurationTarget.Global);
  }

  private static getDividerConfig(languageId: string): CommentType {
    return DIVIDER_CONFIG[languageId] || DIVIDER_CONFIG['plaintext']!;
  }

  private static getCommentBoxConfig(languageId: string): CommentType {
    return COMMENT_BOX_CONFIG[languageId] || COMMENT_BOX_CONFIG['plaintext']!;
  }

  private static getLineIndentation(line: string): string {
    const match = line.match(/^\s*/);
    return match ? match[0] : '';
  }

  private static padText(text: string, width: number, position: 'left' | 'center' | 'right'): string {
    switch(position) {
      case 'left':
        return text.padEnd(width - 4);
      case 'right':
        return text.padStart(width - 4);
      case 'center':
      default:
        const padding = Math.floor((width - 4 - text.length) / 2);
        return ' '.repeat(padding) + text + ' '.repeat(width - 4 - text.length - padding);
    }
  }

  private static formatDivider(divider: string, config: CommentType): string {
    if(config.isHtml) return `${config.prefix} ${divider} ${config.suffix}`;
    return `${config.prefix} ${divider}`;
  }

  private static formatCommentBox(lines: Array<string>, indentation: string, config: CommentType): string {
    if(config.isHtml) return this.formatHtmlComment(lines, indentation, config);
    if(config.isBlock) return this.formatBlockComment(lines, indentation, config);
    return this.formatLineComment(lines, indentation, config);
  }

  private static formatHtmlComment(lines: Array<string>, indentation: string, config: CommentType): string {
    const indentedLines = lines.map(line => `${indentation}${line}`);
    return `${config.prefix}\n${indentedLines.join('\n')}\n${indentation}${config.suffix}`;
  }

  private static formatBlockComment(lines: Array<string>, indentation: string, config: CommentType): string {
    const indentedLines = lines.map(line => `${indentation}${line}`);
    return `${config.prefix}\n${indentedLines.join('\n')}\n${indentation}${config.suffix}`;
  }

  private static formatLineComment(lines: Array<string>, indentation: string, config: CommentType): string {
    return lines.map((line, index) => {
      const lineIndent = index === 0 ? indentation : indentation;
      return `${lineIndent}${config.prefix} ${line}`;
    }).join('\n');
  }

  private static insertText(
    editor: vscode.TextEditor, 
    position: vscode.Position, 
    text: string, 
    config: CommentType, 
    indentation: string
  ): void {
    editor.edit(editBuilder => {
      editBuilder.insert(position, text);
    }).then(() => {
      const lineCount = text.split('\n').length;
      const newPosition = config.isBlock 
        ? new vscode.Position(position.line + lineCount, 0)
        : new vscode.Position(position.line + lineCount, indentation.length);
      editor.selection = new vscode.Selection(newPosition, newPosition);
    });
  }
}
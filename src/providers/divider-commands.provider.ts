import * as vscode from 'vscode';
import { DividerGeneratorService } from '../services';
import { DividerStyle, CommentBoxStyle } from '../types';

export class DividerCommandsProvider {
  static registerCommands(context: vscode.ExtensionContext): void {
    this.registerDividerCommands(context);
    this.registerCommentBoxCommands(context);
  }

  private static registerDividerCommands(context: vscode.ExtensionContext): void {
    const dividerStyles = DividerGeneratorService.getDividerStyles();
    
    dividerStyles.forEach(style => {
      const command = vscode.commands.registerCommand(
        `comment-lens.insertDivider.${style.id}`,
        () => this.insertDivider(style)
      );
      context.subscriptions.push(command);
    });

    const quickPickCommand = vscode.commands.registerCommand(
      'comment-lens.insertDivider.quickPick',
      () => this.showDividerQuickPick()
    );
    context.subscriptions.push(quickPickCommand);
  }

  private static registerCommentBoxCommands(context: vscode.ExtensionContext): void {
    const commentBoxStyles = DividerGeneratorService.getCommentBoxStyles();
    
    commentBoxStyles.forEach(style => {
      const command = vscode.commands.registerCommand(
        `comment-lens.insertCommentBox.${style.id}`,
        () => this.insertCommentBox(style)
      );
      context.subscriptions.push(command);
    });

    const quickPickCommand = vscode.commands.registerCommand(
      'comment-lens.insertCommentBox.quickPick',
      () => this.showCommentBoxQuickPick()
    );
    context.subscriptions.push(quickPickCommand);
  }

  private static insertDivider(style: DividerStyle): void {
    vscode.window.showInputBox({
      prompt: 'Enter text for divider (leave empty for no text)',
      placeHolder: 'Your text here...',
      value: ''
    }).then(text => {
      DividerGeneratorService.insertDivider(style, undefined, text || undefined);
    });
  }

  private static insertCommentBox(style: CommentBoxStyle): void {
    vscode.window.showInputBox({
      prompt: 'Enter text for comment box',
      placeHolder: 'Your comment text here...'
    }).then(text => {
      if(text) {DividerGeneratorService.insertCommentBox(style, text);}
    });
  }

  private static async showDividerQuickPick(): Promise<void> {
    const styles = DividerGeneratorService.getDividerStyles();
    const items = styles.map(style => ({
      label: style.name,
      description: style.pattern.repeat(Math.min(style.length, 20)),
      style
    }));

    const selected = await vscode.window.showQuickPick(items, {
      placeHolder: 'Select a divider style'
    });

    if(selected) {this.insertDivider(selected.style);}
  }

  private static async showCommentBoxQuickPick(): Promise<void> {
    const styles = DividerGeneratorService.getCommentBoxStyles();
    const items = styles.map(style => ({
      label: style.name,
      description: `${style.topLeft}...${style.bottomRight}`,
      style
    }));

    const selected = await vscode.window.showQuickPick(items, {
      placeHolder: 'Select a comment box style'
    });

    if(selected) {this.insertCommentBox(selected.style);}
  }
}
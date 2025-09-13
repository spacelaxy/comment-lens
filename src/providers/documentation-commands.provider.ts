import * as vscode from 'vscode';
import { DocumentationGeneratorService } from '../services';

export class DocumentationCommandsProvider {
  
  static registerCommands(context: vscode.ExtensionContext): void {
    const generateFromFileCommand = vscode.commands.registerCommand(
      'comment-lens.generateDocumentation.fromFile',
      () => DocumentationGeneratorService.generateFromCurrentFile()
    );
    
    context.subscriptions.push(generateFromFileCommand);
  }
}

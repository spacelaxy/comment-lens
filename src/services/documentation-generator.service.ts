import * as vscode from 'vscode';
import { DocumentationParserService } from './documentation-parser.service';
import { MarkdownGeneratorService } from './markdown-generator.service';

export class DocumentationGeneratorService {
  
  static async generateFromCurrentFile(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if(!editor) {
      vscode.window.showErrorMessage('No active editor found');
      return;
    }
    
    const document = editor.document;
    
    if(!this.isSupportedFileType(document.languageId)) {
      vscode.window.showErrorMessage(`File type '${document.languageId}' is not supported for documentation generation`);
      return;
    }
    
    try {
      const fileName = await vscode.window.showInputBox({
        prompt: 'Enter documentation filename',
        placeHolder: 'documentation.md',
        value: 'documentation.md',
        validateInput: (value) => {
          if(!value || !value.trim()) {return 'Filename is required';}
          if(!value.endsWith('.md')) {return 'Filename must end with .md';}
          return null;
        }
      });
      
      if(!fileName) {return;}
      
      const folderName = await vscode.window.showInputBox({
        prompt: 'Enter folder name (optional, leave empty for root)',
        placeHolder: 'docs',
        value: 'docs'
      });
      
      const comments = DocumentationParserService.parseFile(document);
      
      if(comments.length === 0) {
        vscode.window.showWarningMessage('No documentation comments found in this file');
        return;
      }
      
      const config = MarkdownGeneratorService.getDefaultConfig();
      const docFileName = document.fileName.split(/[/\\]/).pop() || 'Unknown';
      config.template.title = `Documentation - ${docFileName}`;
      config.template.description = `Generated documentation from ${docFileName}`;
      
      const markdown = MarkdownGeneratorService.generateDocumentation(comments, config);
      
      const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
      if(!workspaceFolder) {
        vscode.window.showErrorMessage('No workspace folder found');
        return;
      }
      
      const folderPath = folderName && folderName.trim() ? `/${folderName.trim()}` : '';
      const filePath = vscode.Uri.joinPath(workspaceFolder.uri, `${folderPath}/${fileName}`);
      
      if(folderName && folderName.trim()) {
        const folderUri = vscode.Uri.joinPath(workspaceFolder.uri, folderName.trim());
        try {
          await vscode.workspace.fs.createDirectory(folderUri);
        } catch(error) {
        }
      }
      
      const encoder = new TextEncoder();
      await vscode.workspace.fs.writeFile(filePath, encoder.encode(markdown));
      
      const doc = await vscode.workspace.openTextDocument(filePath);
      await vscode.window.showTextDocument(doc);
      
      vscode.window.showInformationMessage(`Generated documentation for ${comments.length} items and saved to ${fileName}`);
      
    } catch(error) {
      vscode.window.showErrorMessage(`Error generating documentation: ${error}`);
    }
  }
  
  private static isSupportedFileType(languageId: string): boolean {
    const supportedTypes = ['javascript', 'typescript', 'javascriptreact', 'typescriptreact', 'php', 'java', 'csharp', 'cpp', 'c', 'cuda-cpp', 'rust', 'ruby'];
    return supportedTypes.includes(languageId);
  }
}
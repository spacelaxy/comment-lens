import * as vscode from 'vscode';
import {
  CommentCompletionProvider,
  CommentHighlightProvider,
  CommentHoverProvider,
  DividerCommandsProvider,
  DocumentationCommandsProvider
} from './providers';
import { ConfigurationService } from './services';

let completionProvider: CommentCompletionProvider;

export function activate(context: vscode.ExtensionContext) {
  
  new ConfigurationService();
  
  const highlightProvider = new CommentHighlightProvider();
  const hoverProvider = new CommentHoverProvider(highlightProvider);
  completionProvider = new CommentCompletionProvider();
  new DividerCommandsProvider();
  new DocumentationCommandsProvider();
  
  context.subscriptions.push(highlightProvider);
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      { scheme: 'file' },
      completionProvider,
      '@'
    )
  );

  context.subscriptions.push(
    vscode.languages.registerHoverProvider(
      { scheme: 'file' },
      hoverProvider
    )
  );

  ConfigurationService.onConfigurationChanged(() => {
    
  });
  
  console.log('Comment Lens activated');
}

export function deactivate() {}
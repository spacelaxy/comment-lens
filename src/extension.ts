import * as vscode from 'vscode';
import { CommentHighlightProvider, CommentCompletionProvider, CommentHoverProvider, DividerCommandsProvider, DocumentationCommandsProvider } from './providers';
import { ConfigurationService } from './services';

let commentHighlightProvider: CommentHighlightProvider;
let commentCompletionProvider: CommentCompletionProvider;
let commentHoverProvider: CommentHoverProvider;

export function activate(context: vscode.ExtensionContext) {
	console.log('Comment Lens is active!');
	const patterns = ConfigurationService.getPatterns();
	
	commentHighlightProvider = new CommentHighlightProvider();
	commentCompletionProvider = new CommentCompletionProvider(patterns);
	commentHoverProvider = new CommentHoverProvider(commentHighlightProvider);
	
	context.subscriptions.push(commentHighlightProvider);
	
	const completionDisposable = vscode.languages.registerCompletionItemProvider(
		{ scheme: 'file' },
		commentCompletionProvider,
		'@'
	);
	
	const hoverDisposable = vscode.languages.registerHoverProvider(
		{ scheme: 'file' },
		commentHoverProvider
	);
	
	context.subscriptions.push(completionDisposable);
	context.subscriptions.push(hoverDisposable);

	DividerCommandsProvider.registerCommands(context);
	DocumentationCommandsProvider.registerCommands(context);

	ConfigurationService.onConfigurationChanged(() => {
		const updatedPatterns = ConfigurationService.getPatterns();
		commentCompletionProvider.updatePatterns(updatedPatterns);
	});
}

export function deactivate() {
	if(commentHighlightProvider) commentHighlightProvider.dispose();
}
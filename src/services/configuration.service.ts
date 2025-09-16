import * as vscode from 'vscode';
import { CommentPattern } from '../types';
import { DEFAULT_PATTERNS } from '../config';

export class ConfigurationService {
  private static readonly CONFIG_KEY = 'commentLens.patterns';
  private static readonly HIGHLIGHT_MODE_KEY = 'commentLens.highlightMode';

  static getPatterns(): Array<CommentPattern> {
    const config = vscode.workspace.getConfiguration();
    const customPatterns = config.get<Array<CommentPattern>>(this.CONFIG_KEY, []);
    
    if(customPatterns.length === 0) {return DEFAULT_PATTERNS;}
    
    const result: Array<CommentPattern> = [];
    
    for (const defaultPattern of DEFAULT_PATTERNS) {
      const customPattern = customPatterns.find(p => 
        p.id === defaultPattern.id || 
        p.pattern === defaultPattern.pattern ||
        (p.id && p.id.startsWith('@') && p.id.substring(1) === defaultPattern.id) ||
        (p.id && defaultPattern.id && p.id === `@${defaultPattern.id}`)
      );
      
      if(customPattern && customPattern.overrideDefault) {
        const normalizedPattern = {
          ...customPattern,
          id: defaultPattern.id
        };
        result.push(normalizedPattern);
      } else {
        result.push(defaultPattern);
      }
    }
  
    const newCustomPatterns = customPatterns.filter(p => 
      !DEFAULT_PATTERNS.some(dp => 
        (p.id === dp.id || 
         p.pattern === dp.pattern ||
         (p.id && p.id.startsWith('@') && p.id.substring(1) === dp.id) ||
         (p.id && dp.id && p.id === `@${dp.id}`)) &&
        p.overrideDefault
      )
    );
    result.push(...newCustomPatterns);
    
    return result;
  }
  
  static async updatePatterns(patterns: Array<CommentPattern>): Promise<void> {
    const config = vscode.workspace.getConfiguration();
    await config.update(this.CONFIG_KEY, patterns, vscode.ConfigurationTarget.Global);
  }
  
  static getHighlightMode(): 'always' | 'onHover' {
    const config = vscode.workspace.getConfiguration();
    return config.get<'always' | 'onHover'>(this.HIGHLIGHT_MODE_KEY, 'always');
  }

  static onConfigurationChanged(callback: () => void): vscode.Disposable {
    return vscode.workspace.onDidChangeConfiguration((e) => {
      if(e.affectsConfiguration(this.CONFIG_KEY) || e.affectsConfiguration(this.HIGHLIGHT_MODE_KEY)) {callback();}
    });
  }
}
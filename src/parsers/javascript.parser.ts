import { DocComment, DocParam, DocType } from '../types/documentation.interface';
import { AbstractParser } from '../types/parser.interface';
import { ParserPatterns, cleanCommentLine } from '../config/parser-patterns.config';

export class JavaScriptParser extends AbstractParser {
  
  canParse(line: string): boolean {
    return ParserPatterns.commentDetection.javascript.test(line);
  }
  
  extractCommentBlock(lines: Array<string>, startLine: number): { content: string; endLine: number } | null {
    let content = '';
    let currentLine = startLine;
    
    if(ParserPatterns.commentDetection.javascript.test(lines[startLine] || '')) {
      content += (lines[currentLine] || '') + '\n';
      currentLine++;
      
      while(currentLine < lines.length) {
        const line = lines[currentLine] || '';
        content += line + '\n';
        
        if(ParserPatterns.commentBlockExtraction.javascript.end.test(line)) {
          return { content: content.trim(), endLine: currentLine };
        }
        currentLine++;
      }
    }
    
    return null;
  }
  
  parseCommentBlock(content: string, lineNumber: number, filePath: string): DocComment | null {
    const lines = content.split('\n');
    
    const docComment: DocComment = {
      type: DocType.FUNCTION,
      name: '',
      description: '',
      params: [],
      examples: [],
      throws: [],
      tags: [],
      lineNumber,
      filePath
    };
    
    let descriptionLines: Array<string> = [];
    
    for(const line of lines) {
      const cleanLine = cleanCommentLine(line, 'javascript');
      
      if(!cleanLine) continue;
      
      if(cleanLine.startsWith('@param')) {
        this.parseJSDocParam(cleanLine, docComment);
      } else if(cleanLine.startsWith('@return') || cleanLine.startsWith('@returns')) {
        this.parseJSDocReturn(cleanLine, docComment);
      } else if(cleanLine.startsWith('@throws')) {
        this.parseJSDocThrows(cleanLine, docComment);
      } else if(!cleanLine.startsWith('@')) {
        descriptionLines.push(cleanLine);
      }
    }
    
    if(descriptionLines.length > 0) {
      docComment.description = descriptionLines.join(' ').replace(/\s+/g, ' ').trim();
    }
    
    this.determineTypeAndName(docComment);
    
    return docComment.name ? docComment : null;
  }
  
  extractFunctionNameFromCode(lines: Array<string>, startLine: number): string | null {
    try {
      for(let i = startLine; i < Math.min(startLine + 15, lines.length); i++) {
        const line = lines[i]?.trim() || '';
        
        if(!line || line.startsWith('//') || line.startsWith('/*') || line.startsWith('*')) continue;
        
        const functionMatch = line.match(ParserPatterns.codeExtraction.javascript.function);
        if(functionMatch && functionMatch[1]) return functionMatch[1];
        
        const arrowMatch = line.match(ParserPatterns.codeExtraction.javascript.arrow);
        if(arrowMatch && arrowMatch[1]) return arrowMatch[1];
        
        const methodMatch = line.match(ParserPatterns.codeExtraction.javascript.method);
        if(methodMatch && methodMatch[1]) {
          const name = methodMatch[1];
          if(!ParserPatterns.codeExtraction.javascript.keywords.includes(name)) return name;
        }
        
        const classMatch = line.match(ParserPatterns.codeExtraction.javascript.class);
        if(classMatch && classMatch[1]) return classMatch[1];
        
        const constMatch = line.match(ParserPatterns.codeExtraction.javascript.const);
        if(constMatch && constMatch[1]) return constMatch[1];
      }
    } catch(error) {
      console.error('Error extracting function name:', error);
    }
    
    return null;
  }
  
  private parseJSDocParam(paramText: string, docComment: DocComment): void {
    const paramMatch = paramText.match(ParserPatterns.documentationParsing.javascript.param);
    if(!paramMatch) return;
    
    const param: DocParam = {
      type: paramMatch[1] || 'unknown',
      name: paramMatch[2] || '',
      description: paramMatch[3] || '',
      optional: false,
      nullable: false,
      variadic: false
    };
    
    docComment.params.push(param);
  }
  
  private parseJSDocReturn(returnText: string, docComment: DocComment): void {
    const returnMatch = returnText.match(ParserPatterns.documentationParsing.javascript.return);
    if(!returnMatch) return;
    
    docComment.returns = {
      type: returnMatch[1] || 'unknown',
      description: returnMatch[2] || '',
      nullable: false
    };
  }
  
  private parseJSDocThrows(throwsText: string, docComment: DocComment): void {
    const throwsMatch = throwsText.match(ParserPatterns.documentationParsing.javascript.throws);
    if(!throwsMatch) return;
    
    docComment.throws.push({
      type: throwsMatch[1] || 'Error',
      description: throwsMatch[2] || ''
    });
  }
}
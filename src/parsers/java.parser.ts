import { DocComment, DocParam, DocType } from '../types/documentation.interface';
import { AbstractParser } from '../types/parser.interface';
import { ParserPatterns, cleanCommentLine } from '../config/parser-patterns.config';

export class JavaParser extends AbstractParser {
  
  canParse(line: string): boolean {
    return ParserPatterns.commentDetection.java.test(line);
  }
  
  extractCommentBlock(lines: Array<string>, startLine: number): { content: string; endLine: number } | null {
    let content = '';
    let currentLine = startLine;
    
    if(ParserPatterns.commentDetection.java.test(lines[startLine] || '')) {
      content += (lines[currentLine] || '') + '\n';
      currentLine++;
      
      while(currentLine < lines.length) {
        const line = lines[currentLine] || '';
        content += line + '\n';
        
        if(ParserPatterns.commentBlockExtraction.java.end.test(line)) {
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
      const cleanLine = cleanCommentLine(line, 'java');
      
      if(!cleanLine) {continue;}
      
      if(cleanLine.startsWith('@param')) {
        this.parseJavaParam(cleanLine, docComment);
      } else if(cleanLine.startsWith('@return')) {
        this.parseJavaReturn(cleanLine, docComment);
      } else if(cleanLine.startsWith('@throws') || cleanLine.startsWith('@exception')) {
        this.parseJavaThrows(cleanLine, docComment);
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
        
        if(!line || line.startsWith('//') || line.startsWith('/*') || line.startsWith('*')) {continue;}
        
        const classMatch = line.match(ParserPatterns.codeExtraction.java.class);
        if(classMatch && classMatch[1]) {return classMatch[1];}
        
        const interfaceMatch = line.match(ParserPatterns.codeExtraction.java.interface);
        if(interfaceMatch && interfaceMatch[1]) {return interfaceMatch[1];}
        
        const methodMatch = line.match(ParserPatterns.codeExtraction.java.method);
        if(methodMatch && methodMatch[1]) {
          const name = methodMatch[1];
          if(!ParserPatterns.codeExtraction.java.keywords.includes(name)) {
            return name;
          }
        }
        
        const constructorMatch = line.match(ParserPatterns.codeExtraction.java.constructor);
        if(constructorMatch && constructorMatch[1]) {
          const name = constructorMatch[1];
          if(name.match(ParserPatterns.codeExtraction.java.capitalized) && !ParserPatterns.codeExtraction.java.keywords.includes(name)) {
            return 'constructor';
          }
        }
      }
    } catch(error) {
      console.error('Error extracting function name:', error);
    }
    
    return null;
  }
  
  private parseJavaParam(paramText: string, docComment: DocComment): void {
    const paramMatch = paramText.match(ParserPatterns.documentationParsing.java.param);
    if(!paramMatch) {return;}
    
    const param: DocParam = {
      type: 'unknown',
      name: paramMatch[1] || '',
      description: paramMatch[2] || '',
      optional: false,
      nullable: false,
      variadic: false
    };
    
    docComment.params.push(param);
  }
  
  private parseJavaReturn(returnText: string, docComment: DocComment): void {
    const returnMatch = returnText.match(ParserPatterns.documentationParsing.java.return);
    if(!returnMatch) {return;}
    
    docComment.returns = {
      type: 'unknown',
      description: returnMatch[1] || '',
      nullable: false
    };
  }
  
  private parseJavaThrows(throwsText: string, docComment: DocComment): void {
    const throwsMatch = throwsText.match(ParserPatterns.documentationParsing.java.throws);
    if(!throwsMatch) {return;}
    
    docComment.throws.push({
      type: throwsMatch[1] || 'Exception',
      description: throwsMatch[2] || ''
    });
  }
}
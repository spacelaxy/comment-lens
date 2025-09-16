import { DocComment, DocParam, DocType } from '../types/documentation.interface';
import { AbstractParser } from '../types/parser.interface';
import { ParserPatterns } from '../config/parser-patterns.config';

export class CSharpParser extends AbstractParser {
  
  canParse(line: string): boolean {
    return ParserPatterns.commentDetection.csharp.test(line);
  }
  
  extractCommentBlock(lines: Array<string>, startLine: number): { content: string; endLine: number } | null {
    let content = '';
    let currentLine = startLine;
    
    if(ParserPatterns.commentDetection.csharp.test(lines[startLine] || '')) {
      while(currentLine < lines.length) {
        const line = lines[currentLine] || '';
        
        if(!line.trim().startsWith('///')) {break;}
        
        content += line + '\n';
        currentLine++;
        
        if(ParserPatterns.commentBlockExtraction.csharp.endSummary.test(line)) {
          const nextLine = lines[currentLine] || '';
          if(!nextLine.trim().startsWith('///') || !ParserPatterns.commentBlockExtraction.csharp.xmlTag.test(nextLine)) {
            break;
          }
        }
      }
      
      return { content: content.trim(), endLine: currentLine - 1 };
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
    let inSummary = false;
    
    for(const line of lines) {
      let cleanLine = line.replace(ParserPatterns.contentCleaning.csharp.cleanLine, '').trim();
      
      if(!cleanLine) {continue;}
      
      if(cleanLine.startsWith('<summary>')) {
        inSummary = true;
        cleanLine = cleanLine.replace(/<summary>/, '').replace(/<\/summary>/, '').trim();
        if(cleanLine) {descriptionLines.push(cleanLine);}
      } else if(cleanLine.startsWith('</summary>')) {
        inSummary = false;
      } else if(cleanLine.startsWith('<param name=')) {
        this.parseCSharpParam(cleanLine, docComment);
      } else if(cleanLine.startsWith('<returns>')) {
        this.parseCSharpReturns(cleanLine, docComment);
      } else if(cleanLine.startsWith('<exception cref=')) {
        this.parseCSharpException(cleanLine, docComment);
      } else if(cleanLine.startsWith('<remarks>')) {
        cleanLine = cleanLine.replace(/<remarks>/, '').replace(/<\/remarks>/, '').trim();
        if(cleanLine) {descriptionLines.push(cleanLine);}
      } else if(inSummary) {
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
        
        const classMatch = line.match(ParserPatterns.codeExtraction.csharp.class);
        if(classMatch && classMatch[1]) {return classMatch[1];}
        
        const interfaceMatch = line.match(ParserPatterns.codeExtraction.csharp.interface);
        if(interfaceMatch && interfaceMatch[1]) {return interfaceMatch[1];}
        
        const structMatch = line.match(ParserPatterns.codeExtraction.csharp.struct);
        if(structMatch && structMatch[1]) {return structMatch[1];}
        
        const enumMatch = line.match(ParserPatterns.codeExtraction.csharp.enum);
        if(enumMatch && enumMatch[1]) {return enumMatch[1];}
        
        const methodMatch = line.match(ParserPatterns.codeExtraction.csharp.method);
        if(methodMatch && methodMatch[2]) {
          const name = methodMatch[2];
          if(!ParserPatterns.codeExtraction.csharp.keywords.includes(name)) {
            return name;
          }
        }
        
        const constructorMatch = line.match(ParserPatterns.codeExtraction.csharp.constructor);
        if(constructorMatch && constructorMatch[1]) {
          const name = constructorMatch[1];
          if(name.match(ParserPatterns.codeExtraction.csharp.capitalized) && !ParserPatterns.codeExtraction.csharp.keywords.includes(name)) {
            return 'constructor';
          }
        }
        
        const propertyMatch = line.match(ParserPatterns.codeExtraction.csharp.property);
        if(propertyMatch && propertyMatch[2]) {return propertyMatch[2];}
        
        const autoPropertyMatch = line.match(ParserPatterns.codeExtraction.csharp.autoProperty);
        if(autoPropertyMatch && autoPropertyMatch[2]) {return autoPropertyMatch[2];}
        
        const fieldMatch = line.match(ParserPatterns.codeExtraction.csharp.field);
        if(fieldMatch && fieldMatch[2]) {return fieldMatch[2];}
      }
    } catch(error) {
      console.error('Error extracting function name:', error);
    }
    
    return null;
  }
  
  private parseCSharpParam(paramText: string, docComment: DocComment): void {
    const paramMatch = paramText.match(ParserPatterns.documentationParsing.csharp.param);
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
  
  private parseCSharpReturns(returnsText: string, docComment: DocComment): void {
    const returnsMatch = returnsText.match(ParserPatterns.documentationParsing.csharp.returns);
    if(!returnsMatch) {return;}
    
    docComment.returns = {
      type: 'unknown',
      description: returnsMatch[1] || '',
      nullable: false
    };
  }
  
  private parseCSharpException(exceptionText: string, docComment: DocComment): void {
    const exceptionMatch = exceptionText.match(ParserPatterns.documentationParsing.csharp.exception);
    if(!exceptionMatch) {return;}
    
    docComment.throws.push({
      type: exceptionMatch[1] || 'Exception',
      description: exceptionMatch[2] || ''
    });
  }
}
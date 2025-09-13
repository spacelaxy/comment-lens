import { DocComment, DocType } from '../types/documentation.interface';
import { AbstractParser } from '../types/parser.interface';
import { ParserPatterns } from '../config/parser-patterns.config';

export class RustParser extends AbstractParser {
  
  canParse(line: string): boolean {
    const trimmed = line.trim();
    if(!ParserPatterns.commentDetection.rust.test(trimmed) || trimmed.startsWith('//!')) {
      return false;
    }
    return true;
  }
  
  extractCommentBlock(lines: Array<string>, startLine: number): { content: string; endLine: number } | null {
    let content = '';
    let currentLine = startLine;
    
    content += lines[startLine] + '\n';
    currentLine++;
    
    while(currentLine < lines.length) {
      const line = lines[currentLine] || '';
      const trimmedLine = line.trim();
      
      if(!ParserPatterns.commentDetection.rust.test(trimmedLine)) {
        break;
      }
      
      content += line + '\n';
      currentLine++;
    }
    
    return { content: content.trim(), endLine: currentLine - 1 };
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
      lineNumber: lineNumber,
      filePath: filePath
    };
    
    let currentSection = 'description';
    
    for(const line of lines) {
      const trimmedLine = line.replace(ParserPatterns.contentCleaning.rust.cleanLine, '').trim();
      
      if(trimmedLine.startsWith('```')) {
        if(currentSection === 'description') {
          currentSection = 'codeblock';
          continue;
        } else if(currentSection === 'codeblock') {
          currentSection = 'description';
          continue;
        }
      }
      
      if(currentSection === 'codeblock') {
        if(docComment.examples.length === 0) {
          docComment.examples.push({ code: '', language: 'rust', description: '' });
        }
        const lastExample = docComment.examples[docComment.examples.length - 1];
        if(lastExample) {
          lastExample.code += line + '\n';
        }
        continue;
      }
      
      if(trimmedLine.startsWith('#')) {
        const sectionMatch = trimmedLine.match(ParserPatterns.documentationParsing.rust.section);
        if(sectionMatch && sectionMatch[1]) {
          currentSection = sectionMatch[1].toLowerCase();
          continue;
        }
      }
      
      if(currentSection === 'arguments' || currentSection === 'args') {
        this.parseRustArgs(trimmedLine, docComment);
        continue;
      }
      
      if(currentSection === 'returns') {
        this.parseRustReturns(trimmedLine, docComment);
        continue;
      }
      
      if(currentSection === 'panics') {
        this.parseRustPanics(trimmedLine, docComment);
        continue;
      }
      
      if(currentSection === 'examples' || currentSection === 'example') {
        if(trimmedLine.startsWith('```')) {
          continue;
        }
        if(docComment.examples.length === 0) {
          docComment.examples.push({ code: '', language: 'rust', description: '' });
        }
        const lastExample = docComment.examples[docComment.examples.length - 1];
        if(lastExample) {
          lastExample.code += line + '\n';
        }
        continue;
      }
      
      if(currentSection === 'notes' || currentSection === 'note' || 
         currentSection === 'warnings' || currentSection === 'warning') {
        this.processMarkdownLine(trimmedLine, docComment);
        continue;
      }
      
      if(trimmedLine) {
        this.processMarkdownLine(trimmedLine, docComment);
      }
    }
    
    docComment.description = docComment.description.trim();
    return docComment;
  }
  
  extractFunctionNameFromCode(lines: Array<string>, startLine: number): string | null {
    try {
      for(let i = startLine; i < Math.min(startLine + 15, lines.length); i++) {
        const line = lines[i]?.trim() || '';
        
        if(!line || line.startsWith('//') || line.startsWith('/*')) continue;
        
        if(line.startsWith('///')) {
          continue;
        }
        
        const structMatch = line.match(ParserPatterns.codeExtraction.rust.struct);
        if(structMatch && structMatch[2]) return structMatch[2];
        
        const enumMatch = line.match(ParserPatterns.codeExtraction.rust.enum);
        if(enumMatch && enumMatch[2]) return enumMatch[2];
        
        if(ParserPatterns.codeExtraction.rust.enumVariant.test(line) && !ParserPatterns.codeExtraction.rust.structEnumTrait.test(line)) {
          continue;
        }
        
        const traitMatch = line.match(ParserPatterns.codeExtraction.rust.trait);
        if(traitMatch && traitMatch[2]) return traitMatch[2];
        
        const implMatch = line.match(ParserPatterns.codeExtraction.rust.impl);
        if(implMatch && implMatch[1]) return implMatch[1];
        
        const functionMatch = line.match(ParserPatterns.codeExtraction.rust.function);
        if(functionMatch && functionMatch[2]) return functionMatch[2];
        
        const methodMatch = line.match(ParserPatterns.codeExtraction.rust.method);
        if(methodMatch && methodMatch[2]) return methodMatch[2];
        
        const constMatch = line.match(ParserPatterns.codeExtraction.rust.const);
        if(constMatch && constMatch[2]) return constMatch[2];
        
        const typeMatch = line.match(ParserPatterns.codeExtraction.rust.type);
        if(typeMatch && typeMatch[2]) return typeMatch[2];
        
        const macroMatch = line.match(ParserPatterns.codeExtraction.rust.macro);
        if(macroMatch && macroMatch[2]) return macroMatch[2];
      }
    } catch(error) {
      console.error('Error extracting function name:', error);
      return null;
    }
    
    return null;
  }
  
  determineTypeFromCode(lines: Array<string>, startLine: number): string {
    try {
      for(let i = startLine; i < Math.min(startLine + 15, lines.length); i++) {
        const line = lines[i]?.trim() || '';
        
        if(!line || line.startsWith('//') || line.startsWith('/*')) continue;
        
        const structMatch = line.match(ParserPatterns.codeExtraction.rust.struct);
        if(structMatch && structMatch[2]) return DocType.CLASS;
        
        const enumMatch = line.match(ParserPatterns.codeExtraction.rust.enum);
        if(enumMatch && enumMatch[2]) return DocType.CLASS;
        
        const traitMatch = line.match(ParserPatterns.codeExtraction.rust.trait);
        if(traitMatch && traitMatch[2]) return DocType.INTERFACE;
        
        const implMatch = line.match(/^(pub\s+)?impl(?:\s+<[^>]+>)?\s+(?:\w+::)*\w+\s+for\s+(\w+)/);
        if(implMatch && implMatch[2]) return DocType.CLASS;
        
        const functionMatch = line.match(ParserPatterns.codeExtraction.rust.function);
        if(functionMatch && functionMatch[2]) return DocType.FUNCTION;
        
        const methodMatch = line.match(ParserPatterns.codeExtraction.rust.method);
        if(methodMatch && methodMatch[2]) return DocType.METHOD;
        
        const constMatch = line.match(ParserPatterns.codeExtraction.rust.const);
        if(constMatch && constMatch[2]) return DocType.VARIABLE;
        
        const typeMatch = line.match(ParserPatterns.codeExtraction.rust.type);
        if(typeMatch && typeMatch[2]) return DocType.PROPERTY;
        
        const macroMatch = line.match(ParserPatterns.codeExtraction.rust.macro);
        if(macroMatch && macroMatch[2]) return DocType.FUNCTION;
      }
    } catch(error) {
      console.error('Error determining type:', error);
    }
    
    return DocType.FUNCTION;
  }
  
  private parseRustArgs(line: string, docComment: DocComment): void {
    const argsMatch = line.match(ParserPatterns.documentationParsing.rust.args);
    if(argsMatch) {
      const param = {
        name: argsMatch[1] || '',
        type: 'unknown',
        description: argsMatch[2]?.trim() || '',
        optional: false,
        nullable: false,
        variadic: false
      };
      docComment.params.push(param);
      return;
    }
    
    const simpleArgsMatch = line.match(ParserPatterns.documentationParsing.rust.simpleArgs);
    if(simpleArgsMatch) {
      const param = {
        name: simpleArgsMatch[1] || '',
        type: 'unknown',
        description: simpleArgsMatch[2]?.trim() || '',
        optional: false,
        nullable: false,
        variadic: false
      };
      docComment.params.push(param);
    }
  }
  
  private parseRustReturns(line: string, docComment: DocComment): void {
    if(line.trim() && !line.startsWith('*')) {
      docComment.returns = {
        type: 'unknown',
        description: line.trim(),
        nullable: false
      };
    }
  }
  
  private parseRustPanics(line: string, docComment: DocComment): void {
    if(line.trim() && !line.startsWith('*')) {
      docComment.throws.push({
        type: 'Panic',
        description: line.trim()
      });
    }
  }
  
  private processMarkdownLine(line: string, docComment: DocComment): void {
    if(line === '```' || line === '') {
      return;
    }
    
    let processedLine = line.replace(ParserPatterns.contentCleaning.rust.markdownLink, '$1 ($2)');
    
    if(processedLine.match(ParserPatterns.contentCleaning.rust.listItem)) {
      processedLine = processedLine.substring(2);
    }
    
    if(processedLine.trim()) {
      docComment.description += processedLine + ' ';
    }
  }
}
import { DocComment, DocParam, DocType } from '../types/documentation.interface';
import { AbstractParser } from '../types/parser.interface';
import { ParserPatterns, cleanCommentLine } from '../config/parser-patterns.config';

export class CppParser extends AbstractParser {
  
  canParse(line: string): boolean {
    return ParserPatterns.commentDetection.cpp.xml.test(line) ||
           ParserPatterns.commentDetection.cpp.doxygen.test(line) ||
           ParserPatterns.commentDetection.cpp.doxygenCommands.test(line);
  }
  
  extractCommentBlock(lines: Array<string>, startLine: number): { content: string; endLine: number } | null {
    let content = '';
    let currentLine = startLine;
    const startLineContent = lines[startLine] || '';
    
    if(ParserPatterns.commentDetection.cpp.xml.test(startLineContent) || ParserPatterns.commentDetection.cpp.doxygenCommands.test(startLineContent)) {
      content += startLineContent + '\n';
      currentLine++;
      
      while(currentLine < lines.length) {
        const line = lines[currentLine] || '';
        
        if(!line.trim().startsWith('///')) break;
        
        content += line + '\n';
        currentLine++;
        
        if(ParserPatterns.commentBlockExtraction.cpp.xmlEnd.test(line)) {
          const nextLine = lines[currentLine] || '';
          if(!nextLine.trim().startsWith('///')) break;
        }
      }
      
      return { content: content.trim(), endLine: currentLine - 1 };
    }
    
    if(ParserPatterns.commentDetection.cpp.doxygen.test(startLineContent)) {
      content += startLineContent + '\n';
      currentLine++;
      
      while(currentLine < lines.length) {
        const line = lines[currentLine] || '';
        
        if(!line.trim().startsWith('*') && !line.trim().startsWith('*/')) break;
        
        content += line + '\n';
        currentLine++;
        
        if(ParserPatterns.commentBlockExtraction.cpp.doxygenEnd.test(line)) break;
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
      const cleanLine = cleanCommentLine(line, 'cpp');
      if(!cleanLine) continue;
      
      if(cleanLine.startsWith('<summary>')) {
        inSummary = true;
        const summaryContent = cleanLine.replace(/<summary>/, '').replace(/<\/summary>/, '').trim();
        if(summaryContent) descriptionLines.push(summaryContent);
      } else if(cleanLine.startsWith('</summary>')) {
        inSummary = false;
      } else if(cleanLine.startsWith('@brief') || cleanLine.startsWith('\\brief')) {
        inSummary = true;
        const briefContent = cleanLine.replace(/@brief\s*/, '').replace(/\\brief\s*/, '').trim();
        if(briefContent) descriptionLines.push(briefContent);
      } else if(cleanLine.startsWith('@param') || cleanLine.startsWith('\\param')) {
        this.parseDoxygenParam(cleanLine, docComment);
      } else if(cleanLine.startsWith('@return') || cleanLine.startsWith('\\return')) {
        this.parseDoxygenReturn(cleanLine, docComment);
      } else if(cleanLine.startsWith('@throws') || cleanLine.startsWith('\\throws')) {
        this.parseDoxygenThrows(cleanLine, docComment);
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
        
        if(!line || line.startsWith('//') || line.startsWith('/*') || line.startsWith('*')) continue;
        
        const classMatch = line.match(ParserPatterns.codeExtraction.cpp.class);
        if(classMatch && classMatch[1]) return classMatch[1];
        
        const namespaceMatch = line.match(ParserPatterns.codeExtraction.cpp.namespace);
        if(namespaceMatch && namespaceMatch[1]) return namespaceMatch[1];
        
        const functionMatch = line.match(ParserPatterns.codeExtraction.cpp.function);
        if(functionMatch && functionMatch[1]) {
          const name = functionMatch[1];
          if(!ParserPatterns.codeExtraction.cpp.keywords.includes(name)) return name;
        }
        
        const methodMatch = line.match(ParserPatterns.codeExtraction.cpp.method);
        if(methodMatch && methodMatch[1]) {
          const name = methodMatch[1];
          if(!ParserPatterns.codeExtraction.cpp.keywords.includes(name)) return name;
        }
        
        const constructorMatch = line.match(ParserPatterns.codeExtraction.cpp.constructor);
        if(constructorMatch && constructorMatch[1]) {
          const name = constructorMatch[1];
          if(name.match(ParserPatterns.codeExtraction.cpp.capitalized) && !ParserPatterns.codeExtraction.cpp.keywords.includes(name)) return 'constructor';
        }
        
        const destructorMatch = line.match(ParserPatterns.codeExtraction.cpp.destructor);
        if(destructorMatch && destructorMatch[1]) return 'destructor';
        
        const variableMatch = line.match(ParserPatterns.codeExtraction.cpp.variable);
        if(variableMatch && variableMatch[1]) return variableMatch[1];
      }
    } catch(error) {
      console.error('Error extracting function name:', error);
    }
    
    return null;
  }
  
  determineTypeFromCode(lines: Array<string>, startLine: number): string {
    try {
      for(let i = startLine; i < Math.min(startLine + 15, lines.length); i++) {
        const line = lines[i]?.trim() || '';
        
        if(!line || line.startsWith('//') || line.startsWith('/*') || line.startsWith('*')) continue;
        
        if(ParserPatterns.typeDetection.cpp.class.test(line)) return DocType.CLASS;
        if(ParserPatterns.typeDetection.cpp.namespace.test(line)) return DocType.NAMESPACE;
        if(ParserPatterns.typeDetection.cpp.destructor.test(line)) return DocType.METHOD;
        if(ParserPatterns.typeDetection.cpp.constructor.test(line) && line.match(ParserPatterns.codeExtraction.cpp.capitalized)) return DocType.CONSTRUCTOR;
        if(ParserPatterns.typeDetection.cpp.method.test(line)) return DocType.METHOD;
        if(ParserPatterns.typeDetection.cpp.function.test(line)) return DocType.FUNCTION;
        if(ParserPatterns.typeDetection.cpp.variable.test(line)) return DocType.VARIABLE;
      }
    } catch(error) {
      console.error('Error determining type:', error);
    }
    
    return DocType.FUNCTION;
  }
  
  private parseDoxygenParam(paramText: string, docComment: DocComment): void {
    const paramMatch = paramText.match(ParserPatterns.documentationParsing.cpp.param);
    if(!paramMatch) return;
    
    const name = paramMatch[1] || paramMatch[3] || '';
    const description = paramMatch[2] || paramMatch[4] || '';
    
    const param: DocParam = {
      type: 'unknown',
      name: name,
      description: description.trim(),
      optional: false,
      nullable: false,
      variadic: false
    };
    
    docComment.params.push(param);
  }
  
  private parseDoxygenReturn(returnText: string, docComment: DocComment): void {
    const returnMatch = returnText.match(ParserPatterns.documentationParsing.cpp.return);
    if(!returnMatch) return;
    
    const description = returnMatch[1] || returnMatch[2] || '';
    
    docComment.returns = {
      type: 'unknown',
      description: description.trim(),
      nullable: false
    };
  }
  
  private parseDoxygenThrows(throwsText: string, docComment: DocComment): void {
    const throwsMatch = throwsText.match(ParserPatterns.documentationParsing.cpp.throws);
    if(!throwsMatch) return;
    
    const type = throwsMatch[1] || throwsMatch[3] || 'Exception';
    const description = throwsMatch[2] || throwsMatch[4] || '';
    
    docComment.throws.push({
      type: type,
      description: description.trim()
    });
  }
}
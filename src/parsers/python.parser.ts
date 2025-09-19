import { DocComment, DocParam, DocType } from '../types/documentation.interface';
import { AbstractParser } from '../types/parser.interface';
import { ParserPatterns, cleanCommentLine } from '../config/parser-patterns.config';

export class PythonParser extends AbstractParser {
  
  canParse(line: string): boolean {
    return ParserPatterns.commentDetection.python.test(line);
  }
  
  extractCommentBlock(lines: Array<string>, startLine: number): { content: string; endLine: number } | null {
    let content = '';
    let currentLine = startLine;
    
    if(ParserPatterns.commentDetection.python.test(lines[startLine] || '')) {
      content += (lines[currentLine] || '') + '\n';
      const startMatch = (lines[startLine] || '').match(ParserPatterns.commentBlockExtraction.python.start);
      const startQuotes = startMatch ? startMatch[1] : null;
      currentLine++;
      
      // Handle single-line docstrings
      if (startQuotes && (lines[startLine] || '').trim().endsWith(startQuotes) && (lines[startLine] || '').trim().length > startQuotes.length) {
        return { content: content.trim(), endLine: startLine };
      }

      while(currentLine < lines.length) {
        const line = lines[currentLine] || '';
        content += line + '\n';
        
        if(ParserPatterns.commentBlockExtraction.python.end.test(line)) {
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
    let lastParsedTag: any = null;

    for(const rawLine of lines) {
      const line = cleanCommentLine(rawLine, 'python').trim();
      if (!line) continue;

      const tagMatch = line.match(ParserPatterns.documentationParsing.python.tag);
      if (tagMatch) {
        lastParsedTag = null; // Reset for each new tag
        const tagName = tagMatch[1];
        const tagContent = tagMatch[2] || '';

        switch (tagName) {
          case 'param': {
            const paramMatch = tagContent.match(/(\w+):\s*(.*)/);
            if (paramMatch) {
              const param: DocParam = {
                name: paramMatch[1] || '',
                type: 'unknown',
                description: paramMatch[2] || '',
                optional: false, nullable: false, variadic: false
              };
              docComment.params.push(param);
              lastParsedTag = param;
            }
            break;
          }
          case 'type': {
            const typeMatch = tagContent.match(/(\w+):\s*(.*)/);
            if (typeMatch) {
              const param = docComment.params.find(p => p.name === typeMatch[1]);
              if (param) {
                param.type = typeMatch[2] || 'unknown';
              }
            }
            break;
          }
          case 'return':
          case 'returns': {
            if (!docComment.returns) {
              docComment.returns = { type: 'unknown', description: '', nullable: false };
            }
            docComment.returns.description = (docComment.returns.description + ' ' + tagContent).trim();
            lastParsedTag = docComment.returns;
            break;
          }
          case 'rtype': {
            if (!docComment.returns) {
              docComment.returns = { type: 'unknown', description: '', nullable: false };
            }
            docComment.returns.type = tagContent;
            break;
          }
          case 'raises': {
            const raisesMatch = tagContent.match(/(\w+):\s*(.*)/);
            if (raisesMatch) {
              const exception = { type: raisesMatch[1] || 'Exception', description: raisesMatch[2] || '' };
              docComment.throws.push(exception);
              lastParsedTag = exception;
            }
            break;
          }
        }
      } else if (lastParsedTag && line.trim().length > 0) {
        lastParsedTag.description = (lastParsedTag.description + ' ' + line.trim()).trim();
      } else {
        descriptionLines.push(line);
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
        
        if(!line || line.startsWith('#')) continue;
        
        const functionMatch = line.match(ParserPatterns.codeExtraction.python.function);
        if(functionMatch && functionMatch[1]) return functionMatch[1];
        
        const classMatch = line.match(ParserPatterns.codeExtraction.python.class);
        if(classMatch && classMatch[1]) return classMatch[1];
        
        const methodMatch = line.match(ParserPatterns.codeExtraction.python.method);
        if(methodMatch && methodMatch[1]) {
          const name = methodMatch[1];
          if(!ParserPatterns.codeExtraction.python.keywords.includes(name)) return name;
        }
      }
    } catch(error) {
      console.error('Error extracting function name:', error);
    }
    
    return null;
  }
}

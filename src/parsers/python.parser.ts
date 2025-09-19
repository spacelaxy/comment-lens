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
    let currentSection: 'Args' | 'Returns' | 'Raises' | null = null;

    for(const line of lines) {
      const cleanLine = cleanCommentLine(line, 'python');
      if (!cleanLine) continue;

      const sectionMatch = cleanLine.match(ParserPatterns.documentationParsing.python.section);
      if (sectionMatch && sectionMatch[1]) {
        const section = sectionMatch[1];
        if (section === 'Args' || section === 'Returns' || section === 'Raises') {
          currentSection = section;
        } else {
          currentSection = null;
        }
        continue;
      }

      switch (currentSection) {
        case 'Args': {
          const paramMatch = cleanLine.match(ParserPatterns.documentationParsing.python.param);
          if (paramMatch) {
            const param: DocParam = {
              name: paramMatch[1] || '',
              type: paramMatch[2] || 'unknown',
              description: paramMatch[3] || '',
              optional: false,
              nullable: false,
              variadic: false
            };
            docComment.params.push(param);
          }
          break;
        }
        case 'Returns':
          if (!docComment.returns) {
            docComment.returns = { type: 'unknown', description: '', nullable: false };
          }
          docComment.returns.description += ' ' + cleanLine.trim();
          break;
        case 'Raises': {
          const throwsMatch = cleanLine.match(ParserPatterns.documentationParsing.python.param);
          if(throwsMatch) {
            docComment.throws.push({ type: throwsMatch[1] || 'Exception', description: throwsMatch[3] || '' });
          }
          break;
        }
        default:
          descriptionLines.push(cleanLine);
          break;
      }
    }

    if(descriptionLines.length > 0) {
      docComment.description = descriptionLines.join(' ').replace(/\s+/g, ' ').trim();
    }

    if (docComment.returns?.description) {
      docComment.returns.description = docComment.returns.description.trim();
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

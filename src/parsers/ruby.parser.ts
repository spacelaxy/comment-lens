import { DocComment, DocParam, DocType } from '../types/documentation.interface';
import { AbstractParser } from '../types/parser.interface';
import { ParserPatterns, cleanCommentLine } from '../config/parser-patterns.config';

export class RubyParser extends AbstractParser {
  canParse(line: string): boolean {
    return ParserPatterns.commentDetection.ruby.test(line);
  }

  extractCommentBlock(lines: Array<string>, startLine: number): { content: string; endLine: number } | null {
    let content = '';
    let currentLine = startLine;

    if (ParserPatterns.commentDetection.ruby.test(lines[startLine] || '')) {
      while (currentLine < lines.length && ParserPatterns.commentBlockExtraction.ruby.docComment.test(lines[currentLine] || '')) {
        content += lines[currentLine] + '\n';
        currentLine++;
      }
      
      if (content) {
        return { content: content.trim(), endLine: currentLine - 1 };
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

    for (const line of lines) {
      const cleanLine = cleanCommentLine(line, 'ruby');
      if (!cleanLine) continue;

      if (cleanLine.startsWith('@')) {
        this.parseTag(cleanLine, docComment);
      } else {
        descriptionLines.push(cleanLine);
      }
    }

    if (descriptionLines.length > 0) {
      docComment.description = descriptionLines.join(' ').replace(/\s+/g, ' ').trim();
    }

    this.determineTypeAndName(docComment);

    return docComment.name ? docComment : null;
  }

  extractFunctionNameFromCode(lines: Array<string>, startLine: number): string | null {
    try {
      for (let i = startLine; i < Math.min(startLine + 15, lines.length); i++) {
        const line = lines[i]?.trim() || '';

        if (!line || line.startsWith('#') || line.startsWith('=begin')) continue;

        const methodMatch = line.match(ParserPatterns.codeExtraction.ruby.method);
        if (methodMatch && methodMatch[1]) return methodMatch[1];

        const classMatch = line.match(ParserPatterns.codeExtraction.ruby.class);
        if (classMatch && classMatch[1]) return classMatch[1];

        const moduleMatch = line.match(ParserPatterns.codeExtraction.ruby.module);
        if (moduleMatch && moduleMatch[1]) return moduleMatch[1];
        
        const lambdaMatch = line.match(ParserPatterns.codeExtraction.ruby.lambda);
        if (lambdaMatch && lambdaMatch[1]) return lambdaMatch[1];
      }
    } catch (error) {
      console.error('Error extracting function name:', error);
    }

    return null;
  }

  override parseParam(paramText: string, docComment: DocComment): void {
    const paramMatch = paramText.match(ParserPatterns.documentationParsing.ruby.param);
    if (!paramMatch) return;

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

  override parseReturn(returnText: string, docComment: DocComment): void {
    const returnMatch = returnText.match(ParserPatterns.documentationParsing.ruby.return);
    if (!returnMatch) return;

    docComment.returns = {
      type: returnMatch[1] || 'unknown',
      description: returnMatch[2] || '',
      nullable: false
    };
  }

  override parseThrows(throwsText: string, docComment: DocComment): void {
    const throwsMatch = throwsText.match(ParserPatterns.documentationParsing.ruby.throws);
    if (!throwsMatch) return;

    docComment.throws.push({
      type: throwsMatch[1] || 'Exception',
      description: throwsMatch[2] || ''
    });
  }
}
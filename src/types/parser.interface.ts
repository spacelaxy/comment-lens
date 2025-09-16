import { DocComment, DocExample, DocParam, DocReturn, DocThrow, DocType } from './documentation.interface';
import { ParserPatterns } from '../config/parser-patterns.config';

export interface BaseParser {
  canParse(line: string): boolean;
  extractCommentBlock(lines: Array<string>, startLine: number): { content: string; endLine: number } | null;
  parseCommentBlock(content: string, lineNumber: number, filePath: string): DocComment | null;
  extractFunctionNameFromCode(lines: Array<string>, startLine: number): string | null;
}

export interface ParserWithTypeDetection extends BaseParser {
  determineTypeFromCode(lines: Array<string>, startLine: number): DocType;
}

export abstract class AbstractParser implements BaseParser {
  abstract canParse(line: string): boolean;
  abstract extractCommentBlock(lines: Array<string>, startLine: number): { content: string; endLine: number } | null;
  abstract parseCommentBlock(content: string, lineNumber: number, filePath: string): DocComment | null;
  abstract extractFunctionNameFromCode(lines: Array<string>, startLine: number): string | null;

  protected parseTag(line: string, docComment: DocComment): void {
    const tagMatch = line.match(ParserPatterns.parserInterface.tag);
    if(!tagMatch) {return;}
    
    const tagName = tagMatch[1];
    const tagValue = tagMatch[2] || '';
    
    switch(tagName) {
      case 'function':
        docComment.type = DocType.FUNCTION;
        docComment.name = tagValue;
        break;
      case 'method':
        docComment.type = DocType.METHOD;
        docComment.name = tagValue;
        break;
      case 'class':
        docComment.type = DocType.CLASS;
        docComment.name = tagValue;
        break;
      case 'interface':
        docComment.type = DocType.INTERFACE;
        docComment.name = tagValue;
        break;
      case 'property':
        docComment.type = DocType.PROPERTY;
        docComment.name = tagValue;
        break;
      case 'variable':
        docComment.type = DocType.VARIABLE;
        docComment.name = tagValue;
        break;
      case 'namespace':
        docComment.type = DocType.NAMESPACE;
        docComment.name = tagValue;
        break;
      case 'constructor':
        docComment.type = DocType.CONSTRUCTOR;
        docComment.name = 'constructor';
        break;
        
      case 'param':
      case 'parameter':
        this.parseParam(tagValue, docComment);
        break;
        
      case 'returns':
      case 'return':
        this.parseReturn(tagValue, docComment);
        break;
        
      case 'example':
        this.parseExample(tagValue, docComment);
        break;
        
      case 'throws':
      case 'throw':
        this.parseThrows(tagValue, docComment);
        break;
        
      case 'since':
        docComment.since = tagValue;
        break;
        
      case 'author':
        docComment.author = tagValue;
        break;
        
      case 'deprecated':
        docComment.deprecated = true;
        docComment.deprecatedText = tagValue;
        break;
        
      default:
        docComment.tags.push({
          name: tagName || '',
          value: tagValue || '',
          description: tagValue || ''
        });
        break;
    }
  }

  protected parseParam(paramText: string, docComment: DocComment): void {
    let paramMatch = paramText.match(ParserPatterns.parserInterface.param.withBraces);
    
    if(!paramMatch || !paramMatch[1]) {
      paramMatch = paramText.match(ParserPatterns.parserInterface.param.withTypes);
    }
    
    if(!paramMatch) {return;}
    
    let description = paramMatch[3] || '';
    description = description.replace(ParserPatterns.parserInterface.cleaning.removeDashPrefix, '').trim();
    
    let type = 'unknown';
    if(paramMatch[1]) {
      type = paramMatch[1].replace(ParserPatterns.parserInterface.cleaning.removeBraces, '');
    }
    
    const param: DocParam = {
      type: type,
      name: paramMatch[2] || '',
      description: description,
      optional: paramMatch[2]?.includes('?') || paramMatch[3]?.includes('optional') || false,
      nullable: type.includes('null') || type.includes('|'),
      variadic: paramMatch[2]?.includes('...') || false
    };
    
    docComment.params.push(param);
  }

  protected parseReturn(returnText: string, docComment: DocComment): void {
    let returnMatch = returnText.match(ParserPatterns.parserInterface.return.withBraces);
    
    if(!returnMatch || !returnMatch[1]) {
      returnMatch = returnText.match(ParserPatterns.parserInterface.return.withTypes);
    }
    
    if(!returnMatch) {return;}
    
    let type = 'unknown';
    let description = '';
    
    if(returnMatch[1]) {
      type = returnMatch[1].replace(ParserPatterns.parserInterface.cleaning.removeBraces, '');
      description = returnMatch[2] || '';
    } else {
      description = returnMatch[2] || '';
    }
    
    description = description.replace(ParserPatterns.parserInterface.cleaning.removeDashPrefix, '').trim();
    
    const docReturn: DocReturn = {
      type: type,
      description: description,
      nullable: type.includes('null') || type.includes('|')
    };
    
    docComment.returns = docReturn;
  }

  protected parseExample(exampleText: string, docComment: DocComment): void {
    const example = {
      description: exampleText,
      code: '',
      language: 'javascript'
    };
    
    docComment.examples.push(example);
    this.currentExample = example;
  }

  protected parseThrows(throwsText: string, docComment: DocComment): void {
    const throwsMatch = throwsText.match(ParserPatterns.parserInterface.throws);
    if(!throwsMatch) {return;}
    
    const docThrow: DocThrow = {
      type: throwsMatch[1]?.replace(ParserPatterns.parserInterface.cleaning.removeBraces, '') || 'Error',
      description: throwsMatch[2] || ''
    };
    
    docComment.throws.push(docThrow);
  }

  protected determineTypeAndName(docComment: DocComment): void {
    if(!docComment.name) {
      if(docComment.description.toLowerCase().includes('class that represents') || 
         docComment.description.toLowerCase().includes('class for')) {
        docComment.type = DocType.CLASS;
        docComment.name = 'Unknown';
      } else {
        docComment.name = 'Unknown';
      }
    }
  }

  protected currentExample: DocExample | null = null;
}
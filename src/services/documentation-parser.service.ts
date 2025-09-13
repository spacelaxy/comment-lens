import * as vscode from 'vscode';
import { DocComment, DocType } from '../types/documentation.interface';
import { ParserFactory } from '../parsers';
import { ParserPatterns } from '../config/parser-patterns.config';
import { ParserWithTypeDetection, BaseParser } from '../types/parser.interface';

export class DocumentationParserService {
  
  static parseFile(document: vscode.TextDocument): Array<DocComment> {
    const comments: Array<DocComment> = [];
    const text = document.getText();
    const lines = text.split('\n');
    
    for(let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      const parser = ParserFactory.getParser(document.languageId);
      if(parser && parser.canParse(line || '')) {
        const commentBlock = parser.extractCommentBlock(lines, i);
        if(commentBlock) {
          const docComment = parser.parseCommentBlock(commentBlock.content, i + 1, document.fileName || '');
          if(docComment) {
            const functionName = parser.extractFunctionNameFromCode(lines, commentBlock.endLine + 1);
            
            if(functionName) {
              docComment.name = functionName;
              
              if(this.hasTypeDetection(parser)) {
                docComment.type = parser.determineTypeFromCode(lines, commentBlock.endLine + 1);
              } else {
                const codeLines = lines.slice(commentBlock.endLine + 1, commentBlock.endLine + 10);
                const codeText = codeLines.join('\n');
                
                if(functionName === 'constructor') {
                  docComment.type = DocType.CONSTRUCTOR;
                } else if(ParserPatterns.typeDetection.general.class.test(codeText) || ParserPatterns.typeDetection.general.interface.test(codeText) || ParserPatterns.typeDetection.general.struct.test(codeText) || ParserPatterns.typeDetection.general.enum.test(codeText)) {
                  docComment.type = DocType.CLASS;
                } else if(ParserPatterns.typeDetection.general.property.test(codeText)) {
                  docComment.type = DocType.PROPERTY;
                } else if(ParserPatterns.typeDetection.general.method.test(codeText)) {
                  docComment.type = DocType.METHOD;
                } else if(functionName.match(ParserPatterns.typeDetection.general.className)) {
                  docComment.type = DocType.CLASS;
                }
              }
              
              comments.push(docComment);
            }
          }
          
          i = commentBlock.endLine;
        }
      }
    }
    
    return comments;
  }

  private static hasTypeDetection(parser: BaseParser): parser is ParserWithTypeDetection {
    return 'determineTypeFromCode' in parser;
  }
}
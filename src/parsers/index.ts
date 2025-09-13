import { CSharpParser } from './csharp.parser';
import { CppParser } from './cpp.parser';
import { JavaParser } from './java.parser';
import { JavaScriptParser } from './javascript.parser';
import { PHPParser } from './php.parser';
import { RustParser } from './rust.parser';
import { BaseParser } from '../types/parser.interface';

export class ParserFactory {
  private static parsers = new Map<string, BaseParser>([
    ['csharp', new CSharpParser()],
    ['cpp', new CppParser()],
    ['c', new CppParser()],
    ['cuda-cpp', new CppParser()],
    ['java', new JavaParser()],
    ['javascript', new JavaScriptParser()],
    ['typescript', new JavaScriptParser()],
    ['php', new PHPParser()],
    ['rust', new RustParser()]
  ]);

  static getParser(languageId: string): BaseParser | null {
    return this.parsers.get(languageId) || null;
  }

  static getSupportedLanguages(): Array<string> {
    return Array.from(this.parsers.keys());
  }

  static isLanguageSupported(languageId: string): boolean {
    return this.parsers.has(languageId);
  }
}
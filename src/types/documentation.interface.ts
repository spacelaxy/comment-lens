export enum DocType {
  FUNCTION = 'function',
  CLASS = 'class',
  INTERFACE = 'interface',
  METHOD = 'method',
  PROPERTY = 'property',
  VARIABLE = 'variable',
  NAMESPACE = 'namespace',
  CONSTRUCTOR = 'constructor'
}

export interface DocComment {
  type: DocType;
  name: string;
  description: string;
  summary?: string;
  params: Array<DocParam>;
  returns?: DocReturn;
  examples: Array<DocExample>;
  throws: Array<DocThrow>;
  since?: string;
  author?: string;
  deprecated?: boolean;
  deprecatedText?: string;
  tags: Array<DocTag>;
  lineNumber: number;
  filePath: string;
}

export interface DocParam {
  name: string;
  type: string;
  description: string;
  optional?: boolean;
  default?: string;
  nullable?: boolean;
  variadic?: boolean;
}

export interface DocReturn {
  type: string;
  description: string;
  nullable?: boolean;
}

export interface DocExample {
  description?: string;
  code: string;
  language?: string;
}

export interface DocThrow {
  type: string;
  description: string;
}

export interface DocTag {
  name: string;
  value?: string;
  description?: string;
}

export interface MarkdownTemplate {
  title: string;
  description: string;
}

export interface DocGeneratorConfig {
  template: MarkdownTemplate;
  includeTableOfContents: boolean;
  includeMetadata: boolean;
  includeTags: boolean;
  groupByType: boolean;
  sortAlphabetically: boolean;
}
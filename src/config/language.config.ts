export interface CommentType {
  prefix: string;
  suffix: string;
  isBlock: boolean;
  isHtml: boolean;
}

const LINE_COMMENT_SLASH = { prefix: '//', suffix: '', isBlock: false, isHtml: false };
const LINE_COMMENT_HASH = { prefix: '#', suffix: '', isBlock: false, isHtml: false };
const LINE_COMMENT_DASH = { prefix: '--', suffix: '', isBlock: false, isHtml: false };
const BLOCK_COMMENT_C = { prefix: '/*', suffix: '*/', isBlock: true, isHtml: false };
const BLOCK_COMMENT_HTML = { prefix: '<!--', suffix: '-->', isBlock: true, isHtml: true };

const C_STYLE_LANGUAGES = ['javascript', 'typescript', 'javascriptreact', 'typescriptreact', 'java', 'csharp', 'cpp', 'c', 'go', 'rust', 'swift', 'kotlin', 'scala', 'php'];
const HASH_LANGUAGES = ['python', 'ruby', 'yaml', 'dockerfile', 'shellscript', 'powershell', 'dotenv', 'env'];
const HTML_LANGUAGES = ['html', 'xml'];

export const DIVIDER_CONFIG: Record<string, CommentType> = {
  ...Object.fromEntries(C_STYLE_LANGUAGES.map(lang => [lang, LINE_COMMENT_SLASH])),
  ...Object.fromEntries(HASH_LANGUAGES.map(lang => [lang, LINE_COMMENT_HASH])),
  ...Object.fromEntries(HTML_LANGUAGES.map(lang => [lang, BLOCK_COMMENT_HTML])),
  'css': BLOCK_COMMENT_C,
  'scss': LINE_COMMENT_SLASH,
  'less': LINE_COMMENT_SLASH,
  'json': LINE_COMMENT_SLASH,
  'jsonc': LINE_COMMENT_SLASH,
  'prisma': LINE_COMMENT_SLASH,
  'lua': LINE_COMMENT_DASH,
  'plaintext': LINE_COMMENT_HASH
};

export const COMMENT_BOX_CONFIG: Record<string, CommentType> = {
  ...Object.fromEntries(C_STYLE_LANGUAGES.map(lang => [lang, BLOCK_COMMENT_C])),
  ...Object.fromEntries(HASH_LANGUAGES.map(lang => [lang, LINE_COMMENT_HASH])),
  ...Object.fromEntries(HTML_LANGUAGES.map(lang => [lang, BLOCK_COMMENT_HTML])),
  'css': BLOCK_COMMENT_C,
  'scss': BLOCK_COMMENT_C,
  'less': BLOCK_COMMENT_C,
  'json': BLOCK_COMMENT_C,
  'jsonc': BLOCK_COMMENT_C,
  'prisma': BLOCK_COMMENT_C,
  'lua': LINE_COMMENT_DASH,
  'plaintext': LINE_COMMENT_HASH
};

const C_STYLE_REGEX = /\/\*(.*?)\*\//;
const HTML_REGEX = /<!--(.*?)-->/;
const LUA_REGEX = /--\[\[(.*?)\]\]/;

export const LINE_COMMENT_PREFIXES: Record<string, Array<string>> = {
  ...Object.fromEntries(C_STYLE_LANGUAGES.map(lang => [lang, ['//']])),
  ...Object.fromEntries(HASH_LANGUAGES.map(lang => [lang, ['#']])),
  ...Object.fromEntries(HTML_LANGUAGES.map(lang => [lang, ['<!--']])),
  'php': ['//', '#'],
  'python': ['#', '/*'],
  'css': ['/*'],
  'scss': ['//', '/*'],
  'less': ['//', '/*'],
  'json': ['//'],
  'jsonc': ['//'],
  'prisma': ['//'],
  'lua': ['--'],
  'plaintext': ['#']
};

export const BLOCK_COMMENT_REGEX: Record<string, RegExp> = {
  ...Object.fromEntries([...C_STYLE_LANGUAGES, 'css', 'scss', 'less', 'json', 'jsonc', 'prisma', 'python'].map(lang => [lang, C_STYLE_REGEX])),
  ...Object.fromEntries(HTML_LANGUAGES.map(lang => [lang, HTML_REGEX])),
  'lua': LUA_REGEX
};

export const BLOCK_COMMENT_START_LENGTH: Record<string, number> = {
  ...Object.fromEntries(HTML_LANGUAGES.map(lang => [lang, 4])),
  ...Object.fromEntries([...C_STYLE_LANGUAGES, 'css', 'scss', 'less', 'json', 'jsonc', 'prisma', 'python'].map(lang => [lang, 2])),
  'lua': 2
};
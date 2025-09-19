export const ParserPatterns = {
  commentDetection: {
    csharp: /^\s*\/\/\/\s*<summary>/,
    java: /^\s*\/\*\*/,
    javascript: /^\s*\/\*\*/,
    php: /^\s*\/\*\*/,
    cpp: {
      xml: /^\s*\/\/\/\s*</,
      doxygen: /^\s*\/\*\*/,
      doxygenCommands: /^\s*\/\/\/\s*@/
    },
    rust: /^\s*\/\/\//,
    python: /^\s*("""|''')/
  },

  commentBlockExtraction: {
    csharp: {
      summary: /^\s*\/\/\/\s*<summary>/,
      endSummary: /^\s*\/\/\/\s*<\/summary>/,
      xmlTag: /^\s*\/\/\/\s*<[^>]+>/
    },
    java: {
      start: /^\s*\/\*\*/,
      end: /\*\//
    },
    javascript: {
      start: /^\s*\/\*\*/,
      end: /\*\//
    },
    php: {
      start: /^\s*\/\*\*/,
      end: /\*\//
    },
    cpp: {
      xmlStart: /^\s*\/\/\/\s*</,
      xmlEnd: /^\s*\/\/\/\s*<\//,
      doxygenStart: /^\s*\/\*\*/,
      doxygenEnd: /^\s*\*\/\s*$/
    },
    rust: {
      docComment: /^\s*\/\/\//
    },
    python: {
      start: /^\s*("""|''')/,
      end: /("""|''')\s*$/
    }
  },

  codeExtraction: {
    csharp: {
      class: /^(?:public|private|protected|internal|abstract|sealed|static|\s)*\s*class\s+(\w+)/,
      interface: /^(?:public|private|protected|internal|\s)*\s*interface\s+(\w+)/,
      struct: /^(?:public|private|protected|internal|\s)*\s*struct\s+(\w+)/,
      enum: /^(?:public|private|protected|internal|\s)*\s*enum\s+(\w+)/,
      method: /^(?:public|private|protected|internal|static|virtual|override|abstract|async|\s)*\s*(\w+(?:<[^>]+>)?)\s+(\w+)\s*\(/,
      constructor: /^(?:public|private|protected|internal|\s)*\s*(\w+)\s*\([^)]*\)\s*(?:{|=)/,
      property: /^(?:public|private|protected|internal|static|virtual|override|\s)*\s*(\w+(?:<[^>]+>)?)\s+(\w+)\s*{\s*(?:get|set)/,
      autoProperty: /^(?:public|private|protected|internal|static|virtual|override|\s)*\s*(\w+(?:<[^>]+>)?)\s+(\w+)\s*{\s*get;\s*set;\s*}/,
      field: /^(?:public|private|protected|internal|static|readonly|\s)*\s*(\w+(?:<[^>]+>)?)\s+(\w+)(?:\s*[=;])/,
      capitalized: /^[A-Z]/,
      keywords: ['if', 'for', 'while', 'switch', 'catch', 'try', 'else']
    },

    java: {
      class: /^(?:public|private|protected|abstract|final|static|\s)*\s*class\s+(\w+)/,
      interface: /^(?:public|private|protected|\s)*\s*interface\s+(\w+)/,
      method: /^(?:public|private|protected|static|final|abstract|synchronized|\s)*\s*(?:\w+\s+)*(\w+)\s*\([^)]*\)\s*(?:throws\s+\w+(?:,\s*\w+)*)?\s*(?:{|;)/,
      constructor: /^(?:public|private|protected|\s)*\s*(\w+)\s*\([^)]*\)\s*(?:throws\s+\w+(?:,\s*\w+)*)?\s*(?:{|;)/,
      capitalized: /^[A-Z]/,
      keywords: ['if', 'for', 'while', 'switch', 'catch', 'try', 'else']
    },

    javascript: {
      function: /^(?:export\s+)?(?:async\s+)?function\s+(\w+)/,
      arrow: /^(?:export\s+)?(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s+)?\(/,
      method: /^\s*(?:\w+\s*:\s*)?(?:async\s+)?(\w+)\s*\(/,
      class: /^(?:export\s+)?class\s+(\w+)/,
      const: /^(?:export\s+)?(?:const|let|var)\s+(\w+)/,
      keywords: ['if', 'for', 'while', 'switch', 'catch', 'try', 'else']
    },

    php: {
      function: /^(?:public|private|protected|static|\s)*\s*function\s+(\w+)/,
      class: /^(?:abstract\s+)?(?:final\s+)?class\s+(\w+)/,
      interface: /^interface\s+(\w+)/,
      trait: /^trait\s+(\w+)/,
      const: /^(?:const|define)\s+(\w+)/,
      keywords: ['if', 'for', 'while', 'switch', 'catch', 'try', 'else']
    },

    cpp: {
      class: /^(?:class|struct)\s+(\w+)/,
      namespace: /^namespace\s+(\w+)/,
      function: /^(?:static\s+)?(?:inline\s+)?(?:const\s+)?(?:\w+\s+)*(\w+)\s*\([^)]*\)\s*(?:const\s*)?(?:\{|;)/,
      method: /^\s+(?:static\s+)?(?:inline\s+)?(?:const\s+)?(?:\w+\s+)*(\w+)\s*\([^)]*\)\s*(?:const\s*)?(?:\{|;)/,
      constructor: /^\s*(\w+)\s*\([^)]*\)\s*(?:\{|;)/,
      destructor: /^\s*~(\w+)\s*\(\)\s*(?:\{|;)/,
      variable: /^(?:static\s+)?(?:const\s+)?(?:\w+\s+)*(\w+)\s*[=;]/,
      capitalized: /^[A-Z]/,
      keywords: ['if', 'for', 'while', 'switch', 'catch', 'try', 'else']
    },

    rust: {
      struct: /^(pub\s+)?struct\s+(\w+)/,
      enum: /^(pub\s+)?enum\s+(\w+)/,
      trait: /^(pub\s+)?trait\s+(\w+)/,
      impl: /^impl\s+(?:<[^>]+>\s+)?(?:\w+::)*(\w+)(?:\s+for\s+\w+)?/,
      function: /^(pub\s+)?fn\s+(\w+)(?:<[^>]+>)?/,
      method: /^\s+(pub\s+)?fn\s+(\w+)(?:<[^>]+>)?/,
      const: /^(pub\s+)?const\s+(\w+)/,
      type: /^(pub\s+)?type\s+(\w+)/,
      macro: /^(pub\s+)?macro_rules!\s+(\w+)/,
      enumVariant: /^\s+[A-Z]\w*/,
      structEnumTrait: /^\s+(pub\s+)?(struct|enum|trait|fn|const|type)/
    },

    python: {
      class: /^class\s+(\w+)/,
      function: /^def\s+(\w+)/,
      method: /^\s+def\s+(\w+)/,
      keywords: ['if', 'for', 'while', 'try', 'except', 'else', 'elif', 'with']
    }
  },

  parserInterface: {
    tag: /^@(\w+)(?:\s+(.*))?$/,
    param: {
      withBraces: /^(?:(\{[^}]+\})\s+)?(\w+)(?:\s+(.*))?$/,
      withTypes: /^(\w+(?:<[^>]+>)?)\s+(\w+)(?:\s+(.*))?$/
    },
    return: {
      withBraces: /^(?:(\{[^}]+\})\s+)?(.*)$/,
      withTypes: /^(\w+(?:<[^>]+>)?)\s+(.*)$/
    },
    throws: /^(?:(\{[^}]+\})\s+)?(.*)$/,
    cleaning: {
      removeDashPrefix: /^-\s*/,
      removeBraces: /[{}]/g
    }
  },

  typeDetection: {
    general: {
      class: /class\s+\w+/,
      interface: /interface\s+\w+/,
      struct: /struct\s+\w+/,
      enum: /enum\s+\w+/,
      property: /{\s*get[;\s]|{\s*set[;\s]|get\s*{|set\s*{/,
      method: /\w+\s+\w+\s*\([^)]*\)\s*[={]/,
      className: /^[A-Z]/
    },
    cpp: {
      class: /^(?:class|struct)\s+\w+/,
      namespace: /^namespace\s+\w+/,
      destructor: /^\s*~/,
      constructor: /^\s*\w+\s*\([^)]*\)\s*(?:\{|;)/,
      method: /^\s+(?:static\s+)?(?:inline\s+)?(?:const\s+)?(?:\w+\s+)*\w+\s*\([^)]*\)\s*(?:const\s*)?(?:\{|;)/,
      function: /^(?:static\s+)?(?:inline\s+)?(?:const\s+)?(?:\w+\s+)*\w+\s*\([^)]*\)\s*(?:\{|;)/,
      variable: /^(?:static\s+)?(?:const\s+)?(?:\w+\s+)*\w+\s*[=;]/
    }
  },

  documentationParsing: {
    csharp: {
      param: /<param name="([^"]+)"[^>]*>(.*?)<\/param>/,
      returns: /<returns>(.*?)<\/returns>/,
      exception: /<exception cref="([^"]+)"[^>]*>(.*?)<\/exception>/
    },

    java: {
      param: /@param\s+(\w+)\s+(.*)/,
      return: /@return\s+(.*)/,
      throws: /@(?:throws|exception)\s+(\w+)\s+(.*)/
    },

    javascript: {
      param: /@param\s+(?:\{([^}]+)\}\s+)?(\w+)\s+(.*)/,
      return: /@return(?:s)?\s+(?:\{([^}]+)\}\s+)?(.*)/,
      throws: /@throws\s+(?:\{([^}]+)\}\s+)?(.*)/
    },

    php: {
      param: /@param\s+(\w+)\s+\$(\w+)\s+(.*)/,
      return: /@return\s+(\w+)\s+(.*)/,
      throws: /@throws\s+(\w+)\s+(.*)/
    },

    cpp: {
      param: /@param\s+(\w+)\s+(.*)|\\param\s+(\w+)\s+(.*)/,
      return: /@return\s+(.*)|\\return\s+(.*)/,
      throws: /@throws\s+(\w+)\s+(.*)|\\throws\s+(\w+)\s+(.*)/
    },

    rust: {
      section: /^#+\s*(\w+)/,
      args: /^\*\s*`([^`]+)`\s*-\s*(.+)$/,
      simpleArgs: /^\*\s+(\w+)\s*-\s*(.+)$/,
      codeBlock: /^```/
    },
    python: {
      tag: /^:(\w+):(?:\s+(.*))?$/,
      param: /^:param\s+(\w+):\s*(.*)/,
      type: /^:type\s+(\w+):\s*(.*)/,
      returns: /^:returns?:\s*(.*)/,
      rtype: /^:rtype:\s*(.*)/,
      raises: /^:raises\s+(\w+):\s*(.*)/
    }
  },

  contentCleaning: {
    java: {
      cleanLine: /^\s*\*\s?/,
      removeMarkers: [
        /^\s*\/\*\*/,
        /\s*\*\/\s*$/,
        /^\s*\*\s?/
      ]
    },
    javascript: {
      cleanLine: /^\s*\*\s?/,
      removeMarkers: [
        /^\s*\/\*\*/,
        /\s*\*\/\s*$/,
        /^\s*\*\s?/
      ]
    },
    php: {
      cleanLine: /^\s*\*\s?/,
      removeMarkers: [
        /^\s*\/\*\*/,
        /\s*\*\/\s*$/,
        /^\s*\*\s?/
      ]
    },
    cpp: {
      cleanLine: /^\s*(?:\/\/\/\s*|\*\s?)/,
      removeMarkers: [
        /^\s*\/\/\/\s*/,
        /^\s*\/\*\*/,
        /\s*\*\/\s*$/,
        /^\s*\*\s?/
      ]
    },
    csharp: {
      cleanLine: /^\s*\/\/\/\s*/,
      removeMarkers: [
        /^\s*\/\/\/\s*/
      ]
    },
    rust: {
      cleanLine: /^\s*\/\/\/\s*/,
      removeMarkers: [
        /^\s*\/\/\/\s*/
      ],
      markdownLink: /\[([^\]]+)\]\(([^)]+)\)/,
      listItem: /^\* /
    },
    python: {
      cleanLine: /^\s*/,
      removeMarkers: [
        /^\s*("""|''')/,
        /("""|''')\s*$/
      ]
    }
  }
};

export function cleanCommentLine(line: string, language: keyof typeof ParserPatterns.contentCleaning): string {
  let cleanLine = line.trim();
  
  const patterns = ParserPatterns.contentCleaning[language].removeMarkers;
  for(const pattern of patterns) {
    cleanLine = cleanLine.replace(pattern, '');
  }
  
  return cleanLine.trim();
}
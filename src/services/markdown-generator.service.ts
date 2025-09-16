import { DocComment, DocGeneratorConfig, MarkdownTemplate } from "../types/documentation.interface";

export class MarkdownGeneratorService {
  
  static generateDocumentation(comments: Array<DocComment>, config: DocGeneratorConfig): string {
    const template = config.template;
    let markdown = '';
    
    if(template.title) {markdown += `# ${template.title}\n\n`;}
    if(template.description) {markdown += `${template.description}\n\n`;}
    if(config.includeTableOfContents) {markdown += this.generateTableOfContents(comments) + '\n\n';}
    
    const groupedComments = config.groupByType ? this.groupByType(comments) : { 'All': comments };
    
    for(const [groupName, groupComments] of Object.entries(groupedComments)) {
      if(config.groupByType && groupName !== 'All') {markdown += `## ${groupName}\n\n`;}
      
      const sortedComments = config.sortAlphabetically 
        ? groupComments.sort((a, b) => a.name.localeCompare(b.name))
        : groupComments.sort((a, b) => a.lineNumber - b.lineNumber);
      
      for(let i = 0; i < sortedComments.length; i++) {
        const comment = sortedComments[i];
        if(comment) {
          markdown += this.generateCommentSection(comment, template, config);
          if(i < sortedComments.length - 1) {markdown += '\n\n---\n\n';}
          else {markdown += '\n\n';}
        }
      }
    }
    
    return markdown.trim();
  }
  
  private static generateTableOfContents(comments: Array<DocComment>): string {
    const groupedComments = this.groupByType(comments);
    let toc = '## Table of Contents\n\n';
    
    for(const [groupName, groupComments] of Object.entries(groupedComments)) {
      if(groupComments.length === 0) {continue;}
      
      toc += `- [${groupName}](#${groupName.toLowerCase()})\n`;
      for(const comment of groupComments) {
        const anchor = comment.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        toc += `  - [${comment.name}](#${anchor})\n`;
      }
    }
    
    return toc;
  }
  
  private static groupByType(comments: Array<DocComment>): Record<string, Array<DocComment>> {
    const groups: Record<string, Array<DocComment>> = {
      'Class': [],
      'Function': [],
      'Interface': [],
      'Property': [],
      'Variable': [],
      'Namespace': []
    };
    
    for(const comment of comments) {
      const groupName = this.getGroupName(comment.type);
      if(!groups[groupName]) {groups[groupName] = [];}
      groups[groupName].push(comment);
    }
    
    return Object.fromEntries(Object.entries(groups).filter(([_, comments]) => comments.length > 0));
  }
  
  private static getGroupName(type: string): string {
    switch(type) {
      case 'class':
      case 'constructor':
        return 'Class';
      case 'function':
      case 'method':
        return 'Function';
      case 'interface':
        return 'Interface';
      case 'property':
        return 'Property';
      case 'variable':
        return 'Variable';
      case 'namespace':
        return 'Namespace';
      default:
        return 'Function';
    }
  }
  
  private static generateCommentSection(comment: DocComment, _template: MarkdownTemplate, config: DocGeneratorConfig): string {
    let section = `### ${comment.name}\n\n`;
    
    if(comment.description) {section += `${comment.description}\n\n`;}
    
    if(config.includeMetadata && (comment.author || comment.since)) {
      section += '#### Metadata\n\n';
      if(comment.author) {section += `**Author**: ${comment.author}\n\n`;}
      if(comment.since) {section += `**Since**: ${comment.since}\n\n`;}
    }
    
    if(comment.params && comment.params.length > 0) {
      section += '#### Parameters\n\n';
      section += '| Name | Type | Description |\n';
      section += '|------|------|-------------|\n';
      
      for(const param of comment.params) {
        const name = param.name || 'Unknown';
        const type = param.type || 'unknown';
        const description = param.description || '';
        const optional = param.optional ? ' (optional)' : '';
        const nullable = param.nullable ? ' (nullable)' : '';
        const variadic = param.variadic ? ' (variadic)' : '';
        
        section += `| \`${name}\` | \`${type}\` | ${description}${optional}${nullable}${variadic} |\n`;
      }
      section += '\n';
    }
    
    if(comment.returns && comment.returns.type && comment.returns.type !== 'void') {
      section += '#### Returns\n\n';
      const nullable = comment.returns.nullable ? ' (nullable)' : '';
      section += `**\`${comment.returns.type}\`** - ${comment.returns.description}${nullable}\n\n`;
    }
    
    if(comment.throws && comment.throws.length > 0) {
      section += '#### Throws\n\n';
      for(const throwItem of comment.throws) {
        section += `**\`${throwItem.type}\`** - ${throwItem.description}\n`;
      }
      section += '\n';
    }
    
    if(comment.examples && comment.examples.length > 0) {
      section += '#### Examples\n\n';
      for(const example of comment.examples) {
        if(example.description) {section += `${example.description}\n\n`;}
        if(example.code) {
          const language = example.language || 'javascript';
          section += `\`\`\`${language}\n${example.code.trim()}\n\`\`\`\n\n`;
        }
      }
    }
    
    if(config.includeMetadata && comment.deprecated) {
      section += '#### Deprecated\n\n';
      if(comment.deprecatedText) {section += `${comment.deprecatedText}\n\n`;}
      else {section += 'This item is deprecated.\n\n';}
    }
    
    if(config.includeTags && comment.tags && comment.tags.length > 0) {
      section += '#### Tags\n\n';
      for(const tag of comment.tags) {
        section += `- **${tag.name}**: ${tag.value}\n`;
      }
      section += '\n';
    }
    
    return section;
  }
  
  static getDefaultConfig(): DocGeneratorConfig {
    return {
      includeTableOfContents: true,
      includeMetadata: true,
      includeTags: false,
      groupByType: true,
      sortAlphabetically: false,
      template: {
        title: 'Documentation',
        description: 'Generated documentation'
      }
    };
  }
}
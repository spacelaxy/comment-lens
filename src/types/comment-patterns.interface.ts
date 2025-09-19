export interface CommentPattern {
  id: string;
  name: string;
  pattern: string;
  textColor: string;
  backgroundColor: string;
  enabled: boolean;
  showTextColor: boolean;
  showBackgroundColor: boolean;
  overrideDefault: boolean;
  highlightGroup?: number;
}

export interface CommentHighlightConfig {
  patterns: Array<CommentPattern>;
  defaultPatterns: Array<CommentPattern>;
}

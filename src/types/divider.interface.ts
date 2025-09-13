export interface DividerStyle {
  id: string;
  name: string;
  pattern: string;
  length: number;
  enabled: boolean;
  textPosition?: 'left' | 'center' | 'right';
  textPadding?: number;
}

export interface CommentBoxStyle {
  id: string;
  name: string;
  topLeft: string;
  topRight: string;
  bottomLeft: string;
  bottomRight: string;
  horizontal: string;
  vertical: string;
  enabled: boolean;
}

export interface DividerConfig {
  styles: Array<DividerStyle>;
  defaultLength: number;
}

export interface CommentBoxConfig {
  styles: Array<CommentBoxStyle>;
  defaultWidth: number;
}
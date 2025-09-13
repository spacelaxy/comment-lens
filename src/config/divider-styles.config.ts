import { DividerStyle, CommentBoxStyle } from '../types';

export const DEFAULT_DIVIDER_STYLES: Array<DividerStyle> = [
  {
    id: 'simple',
    name: 'Simple Line',
    pattern: '-',
    length: 50,
    enabled: true
  },
  {
    id: 'double',
    name: 'Double Line',
    pattern: '=',
    length: 50,
    enabled: true
  },
  {
    id: 'dots',
    name: 'Dots',
    pattern: '.',
    length: 50,
    enabled: true
  },
  {
    id: 'stars',
    name: 'Stars',
    pattern: '*',
    length: 50,
    enabled: true
  },
  {
    id: 'hash',
    name: 'Hash',
    pattern: '#',
    length: 50,
    enabled: true
  },
  {
    id: 'dash-dot',
    name: 'Dash Dot',
    pattern: '-.',
    length: 50,
    enabled: true
  },
  {
    id: 'waves',
    name: 'Waves',
    pattern: '~',
    length: 50,
    enabled: true
  },
  {
    id: 'arrows',
    name: 'Arrows',
    pattern: '>',
    length: 50,
    enabled: true
  },
  {
    id: 'plus',
    name: 'Plus Signs',
    pattern: '+',
    length: 50,
    enabled: true
  },
  {
    id: 'underscore',
    name: 'Underscores',
    pattern: '_',
    length: 50,
    enabled: true
  },
  {
    id: 'carets',
    name: 'Carets',
    pattern: '^',
    length: 50,
    enabled: true
  },
  {
    id: 'pipes',
    name: 'Pipes',
    pattern: '|',
    length: 50,
    enabled: true
  },
  {
    id: 'backslashes',
    name: 'Backslashes',
    pattern: '\\',
    length: 50,
    enabled: true
  },
  {
    id: 'forward-slashes',
    name: 'Forward Slashes',
    pattern: '/',
    length: 50,
    enabled: true
  },
  {
    id: 'exclamation',
    name: 'Exclamation',
    pattern: '!',
    length: 50,
    enabled: true
  },
  {
    id: 'question',
    name: 'Question Marks',
    pattern: '?',
    length: 50,
    enabled: true
  }
];

export const DEFAULT_COMMENT_BOX_STYLES: Array<CommentBoxStyle> = [
  {
    id: 'simple',
    name: 'Simple Box',
    topLeft: '┌',
    topRight: '┐',
    bottomLeft: '└',
    bottomRight: '┘',
    horizontal: '─',
    vertical: '│',
    enabled: true
  },
  {
    id: 'double',
    name: 'Double Box',
    topLeft: '╔',
    topRight: '╗',
    bottomLeft: '╚',
    bottomRight: '╝',
    horizontal: '═',
    vertical: '║',
    enabled: true
  },
  {
    id: 'rounded',
    name: 'Rounded Box',
    topLeft: '╭',
    topRight: '╮',
    bottomLeft: '╰',
    bottomRight: '╯',
    horizontal: '─',
    vertical: '│',
    enabled: true
  },
  {
    id: 'thick',
    name: 'Thick Box',
    topLeft: '┏',
    topRight: '┓',
    bottomLeft: '┗',
    bottomRight: '┛',
    horizontal: '━',
    vertical: '┃',
    enabled: true
  },
  {
    id: 'dashed',
    name: 'Dashed Box',
    topLeft: '┌',
    topRight: '┐',
    bottomLeft: '└',
    bottomRight: '┘',
    horizontal: '┄',
    vertical: '┊',
    enabled: true
  },
  {
    id: 'dotted',
    name: 'Dotted Box',
    topLeft: '┌',
    topRight: '┐',
    bottomLeft: '└',
    bottomRight: '┘',
    horizontal: '┈',
    vertical: '┆',
    enabled: true
  },
  {
    id: 'heavy',
    name: 'Heavy Box',
    topLeft: '┏',
    topRight: '┓',
    bottomLeft: '┗',
    bottomRight: '┛',
    horizontal: '━',
    vertical: '┃',
    enabled: true
  },
  {
    id: 'light',
    name: 'Light Box',
    topLeft: '┌',
    topRight: '┐',
    bottomLeft: '└',
    bottomRight: '┘',
    horizontal: '─',
    vertical: '│',
    enabled: true
  },
  {
    id: 'double-heavy',
    name: 'Double Heavy Box',
    topLeft: '╔',
    topRight: '╗',
    bottomLeft: '╚',
    bottomRight: '╝',
    horizontal: '═',
    vertical: '║',
    enabled: true
  },
  {
    id: 'light-arc',
    name: 'Light Arc Box',
    topLeft: '╭',
    topRight: '╮',
    bottomLeft: '╰',
    bottomRight: '╯',
    horizontal: '─',
    vertical: '│',
    enabled: true
  },
  {
    id: 'heavy-arc',
    name: 'Heavy Arc Box',
    topLeft: '╭',
    topRight: '╮',
    bottomLeft: '╰',
    bottomRight: '╯',
    horizontal: '━',
    vertical: '┃',
    enabled: true
  },
  {
    id: 'light-quad',
    name: 'Light Quad Box',
    topLeft: '┌',
    topRight: '┐',
    bottomLeft: '└',
    bottomRight: '┘',
    horizontal: '─',
    vertical: '│',
    enabled: true
  },
  {
    id: 'heavy-quad',
    name: 'Heavy Quad Box',
    topLeft: '┏',
    topRight: '┓',
    bottomLeft: '┗',
    bottomRight: '┛',
    horizontal: '━',
    vertical: '┃',
    enabled: true
  },
  {
    id: 'light-triple',
    name: 'Light Triple Box',
    topLeft: '┌',
    topRight: '┐',
    bottomLeft: '└',
    bottomRight: '┘',
    horizontal: '─',
    vertical: '│',
    enabled: true
  },
  {
    id: 'heavy-triple',
    name: 'Heavy Triple Box',
    topLeft: '┏',
    topRight: '┓',
    bottomLeft: '┗',
    bottomRight: '┛',
    horizontal: '━',
    vertical: '┃',
    enabled: true
  }
];

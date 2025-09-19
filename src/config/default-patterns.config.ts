import { CommentPattern } from '../types';

export const DEFAULT_PATTERNS: Array<CommentPattern> = [
  {
    id: 'warn',
    name: 'Warning',
    pattern: '@warn',
    textColor: 'rgba(220, 38, 38, 0.7)',
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    enabled: true,
    showTextColor: true,
    showBackgroundColor: true,
    overrideDefault: false
  },
  {
    id: 'question',
    name: 'Question',
    pattern: '@question',
    textColor: 'rgba(59, 130, 246, 0.7)',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    enabled: true,
    showTextColor: true,
    showBackgroundColor: true,
    overrideDefault: false
  },
  {
    id: 'todo',
    name: 'TODO',
    pattern: '@todo',
    textColor: 'rgba(234, 179, 8, 0.7)',
    backgroundColor: 'rgba(234, 179, 8, 0.1)',
    enabled: true,
    showTextColor: true,
    showBackgroundColor: true,
    overrideDefault: false
  },
  {
    id: 'fixme',
    name: 'FIXME',
    pattern: '@fixme',
    textColor: 'rgba(251, 146, 60, 0.7)',
    backgroundColor: 'rgba(251, 146, 60, 0.1)',
    enabled: true,
    showTextColor: true,
    showBackgroundColor: true,
    overrideDefault: false
  },
  {
    id: 'note',
    name: 'Note',
    pattern: '@note',
    textColor: 'rgba(34, 197, 94, 0.7)',
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    enabled: true,
    showTextColor: true,
    showBackgroundColor: true,
    overrideDefault: false
  },
  {
    id: 'highlight',
    name: 'Highlight',
    pattern: '@highlight:',
    textColor: 'rgba(234, 179, 8, 0.7)',
    backgroundColor: 'rgba(234, 179, 8, 0.1)',
    enabled: true,
    showTextColor: true,
    showBackgroundColor: true,
    overrideDefault: false
  },
  {
    id: 'test',
    name: 'Test',
    pattern: '@test',
    textColor: 'rgba(20, 184, 166, 0.7)',
    backgroundColor: 'rgba(20, 184, 166, 0.1)',
    enabled: true,
    showTextColor: true,
    showBackgroundColor: true,
    overrideDefault: false
  },
  {
    id: 'status',
    name: 'Status',
    pattern: '@status',
    textColor: 'rgba(0, 98, 255, 0.7)',
    backgroundColor: 'rgba(0, 98, 255, 0.1)',
    enabled: true,
    showTextColor: true,
    showBackgroundColor: true,
    overrideDefault: false
  },
  {
    id: 'sphinx.param',
    name: 'Sphinx Param',
    pattern: ':param',
    textColor: 'rgba(59, 130, 246, 0.7)',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    enabled: true,
    showTextColor: false,
    showBackgroundColor: true,
    overrideDefault: false
  },
  {
    id: 'sphinx.returns',
    name: 'Sphinx Returns',
    pattern: ':returns',
    textColor: 'rgba(59, 130, 246, 0.7)',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    enabled: true,
    showTextColor: false,
    showBackgroundColor: true,
    overrideDefault: false
  },
  {
    id: 'sphinx.raises',
    name: 'Sphinx Raises',
    pattern: ':raises',
    textColor: 'rgba(59, 130, 246, 0.7)',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    enabled: true,
    showTextColor: false,
    showBackgroundColor: true,
    overrideDefault: false
  }
];

// src/theme/theme.ts
import { createTheme } from '@mantine/core';

export const theme = createTheme({
  fontFamily:
    'var(--font-geist-sans), ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
  fontFamilyMonospace:
    'var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  defaultRadius: 'md',
  headings: {
    fontFamily: 'var(--font-geist-sans)',
    sizes: {
      h1: { fontSize: '2.25rem', lineHeight: '1.15', fontWeight: '600' }, // ~36px
      h2: { fontSize: '1.75rem', lineHeight: '1.2', fontWeight: '600' },  // ~28px
      h3: { fontSize: '1.25rem', lineHeight: '1.25', fontWeight: '600' }, // ~20px
    },
  },
  components: {
    Container: { defaultProps: { size: 1152, px: 'md' } }, // similar width to the starter
    Paper: { defaultProps: { radius: 'lg' } },
  },
});
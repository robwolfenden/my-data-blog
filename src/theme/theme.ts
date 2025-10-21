// src/theme/theme.ts
import { createTheme, rem } from '@mantine/core';
import type { MantineTheme } from '@mantine/core';

export const theme = createTheme({
  colors: {
    brand: [
      '#f4f7ff', // 0
      '#e6efff', // 1
      '#cfe0ff', // 2
      '#aecdff', // 3
      '#86b4ff', // 4
      '#5c97ff', // 5
      '#3d83ff', // 6 (primary light)
      '#2b6ff0', // 7
      '#205dd3', // 8
      '#1648a6', // 9
    ],
    gray: [
      '#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1', '#94a3b8',
      '#64748b', '#475569', '#334155', '#1f2937', '#0f172a',
    ],
  },
  
  breakpoints: {
    sm: '48em',   // 768px
    md: '64em',   // 1024px
    lg: '80em',   // 1280px
    xl: '96em',   // 1536px
  },

  primaryColor: 'brand',
  primaryShade: { light: 6, dark: 4 },

  fontFamily: 'var(--font-doto), system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
  defaultRadius: 'md',

  headings: {
    fontFamily: 'var(--font-doto), system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
    sizes: {
      h1: { fontSize: rem(36), fontWeight: '800' },
      h2: { fontSize: rem(28), fontWeight: '700' },
      h3: { fontSize: rem(22), fontWeight: '700' },
    },
  },

  components: {
    Button: {
      defaultProps: { color: 'brand', variant: 'filled', radius: 'md', size: 'md' },
      styles: (t: MantineTheme) => ({
        root: {
          fontWeight: 700,
          transition: 'transform .12s ease, box-shadow .12s ease, background-color .12s ease',
          '&:hover': {
            backgroundColor: t.colors.brand[7],
            boxShadow: '0 6px 20px rgba(0,0,0,.06)',
            transform: 'translateY(-1px)',
          },
          '&:active': { transform: 'translateY(0)' },
        },
      }),
    },

    Card: {
      defaultProps: { padding: 'lg', radius: 'md', withBorder: true, shadow: 'sm' },
      styles: (t: MantineTheme) => ({
        root: {
          borderColor: t.colors.gray[2],
          transition: 'transform .15s ease, box-shadow .15s ease',
          '&:hover': {
            boxShadow: '0 10px 30px rgba(0,0,0,.06)',
            transform: 'translateY(-2px)',
          },
        },
      }),
    },

    Badge: {
      defaultProps: { color: 'brand', variant: 'light' },
    },
  },
});
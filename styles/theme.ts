export const theme = {
  colors: {
    light: {
      background: '#FAFAFA',
      card: '#FFFFFF',
      text: '#4B5563', // Softer dark gray
      textSecondary: '#9CA3AF',
      accent: '#D1FAE5', // Calmer light green
      border: '#E2E8F0',
    },
    dark: {
      background: '#1A202C',
      card: '#2D3748',
      text: '#F7FAFC',
      textSecondary: '#A0AEC0',
      accent: '#2C7A7B',
      border: '#4A5568',
    }
  },
  typography: {
    fontFamily: 'Inter, System',
    sizes: {
      largeTitle: 34,
      title: 24,
      body: 18,
      small: 14,
    },
    lineHeights: {
      body: 28, // 1.55x for breathable text
    }
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    md: 12,
    lg: 20,
    round: 9999,
  }
};

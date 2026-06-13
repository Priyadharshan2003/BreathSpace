export const theme = {
  colors: {
    light: {
      background: '#F8FAFC',
      card: '#FFFFFF',
      text: '#334155', // Softer, premium dark gray
      textSecondary: '#94A3B8',
      accent: '#B8E0F9', // Soft blue as requested (or #A7D7C5 for green)
      primary: '#0F766E', // Refined teal primary
      border: '#E2E8F0',
      error: '#FDA4AF', // Soft red
    },
    dark: {
      background: '#0B132B',
      card: '#1C2541',
      text: '#F8FAFC',
      textSecondary: '#94A3B8',
      accent: '#2C7A7B', // Muted teal
      primary: '#5EEAD4',
      border: '#334155',
      error: '#F87171',
    }
  },
  typography: {
    fontFamily: 'Inter, System',
    sizes: {
      largeTitle: 34,
      title: 24,
      body: 16, // Adjusted slightly for readability in cards
      small: 14,
    },
    lineHeights: {
      body: 26, 
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
    lg: 16, // Soft rounded corners for cards (12-16px requested)
    round: 9999,
  }
};

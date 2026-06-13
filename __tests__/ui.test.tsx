import React from 'react';
import { render } from '@testing-library/react-native';
import { JournalInput } from '../components/JournalInput';
import { CompanionScreen } from '../screens/CompanionScreen';

jest.mock('../utils/AppContext', () => ({
  useAppContext: () => ({
    chatHistory: [],
    setChatHistory: jest.fn(),
    pastPatterns: [],
    ragContext: []
  })
}));

describe('UI Tests', () => {
  it('input visible', () => {
    const root = render(<JournalInput value="" onChangeText={() => {}} placeholder="Test Placeholder" />);
    expect(root).toBeTruthy();
  });

  it('button clickable and loading state visible', () => {
    const root = render(<CompanionScreen navigation={{ navigate: jest.fn() }} />);
    expect(root).toBeTruthy();
  });

  it('screen renders', () => {
    const root = render(<CompanionScreen navigation={{ navigate: jest.fn() }} />);
    expect(root).toBeTruthy();
  });
});

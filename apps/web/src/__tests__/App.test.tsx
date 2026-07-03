import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';

vi.mock('react-konva', () => ({
  Stage: ({ children }: { children?: React.ReactNode }) => <div data-testid="konva-stage">{children}</div>,
  Layer: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  Rect: () => null,
  Text: () => null,
  Group: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  Line: () => null,
}));

vi.mock('konva/lib/Node', () => ({}));
vi.mock('@mantine/notifications', () => ({
  Notifications: () => null,
  notifications: {
    show: vi.fn(),
    hide: vi.fn(),
  },
}));

import { App } from '../App.js';

describe('App', () => {
  it('renders without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeTruthy();
  });

  it('renders the ForgeMind title', () => {
    const { getByText } = render(<App />);
    expect(getByText(/ForgeMind/)).toBeTruthy();
  });

  it('renders toolbar buttons', () => {
    const { getByText } = render(<App />);
    expect(getByText('Import')).toBeTruthy();
    expect(getByText('Analyze')).toBeTruthy();
    expect(getByText('Optimize')).toBeTruthy();
  });
});

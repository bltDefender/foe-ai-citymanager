import React from 'react';
import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { AppLayout } from './components/layout/AppLayout.js';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

const theme = createTheme({
  primaryColor: 'blue',
  defaultRadius: 'sm',
  fontFamily: 'system-ui, -apple-system, sans-serif',
});

export function App(): React.ReactElement {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <Notifications position="top-right" />
      <AppLayout />
    </MantineProvider>
  );
}

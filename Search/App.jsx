import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/router.js';
import { SquadProvider } from './context/SquadContext.js';
import { SettingsProvider } from './context/SettingsContext.js';

export default function App() {
  return (
    <SettingsProvider>
      <SquadProvider>
        <RouterProvider router={router} />
      </SquadProvider>
    </SettingsProvider>
  );
}
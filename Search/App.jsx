import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from "./routes/router.jsx";
import { SquadProvider } from './context/SquadContext.jsx';
import { SettingsProvider } from './context/SettingsContext.jsx';

export default function App() {
  return (
    <SettingsProvider>
      <SquadProvider>
        <RouterProvider router={router} />
      </SquadProvider>
    </SettingsProvider>
  );
}
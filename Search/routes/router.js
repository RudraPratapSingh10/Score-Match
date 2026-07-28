import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout.jsx';
import { Dashboard } from '../pages/Dashboard/Dashboard.jsx';
import { SquadBuilder } from '../pages/SquadBuilder/SquadBuilder.jsx';
import { RecommendationsPage } from '../pages/Recommendations/RecommendationsPage.jsx';
import { ChemistryPage } from '../pages/Chemistry/ChemistryPage.jsx';
import { SimulationPage } from '../pages/Simulation/SimulationPage.jsx';
import { GrowthPredictionPage } from '../pages/GrowthPrediction/GrowthPredictionPage.jsx';
import { AssistantPage } from '../pages/Assistant/AssistantPage.jsx';
import { AnalyticsPage } from '../pages/Analytics/AnalyticsPage.jsx';
import { SettingsPage } from '../pages/Settings/SettingsPage.jsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />
  },
  {
    path: '/dashboard',
    element: <MainLayout><Dashboard /></MainLayout>
  },
  {
    path: '/squad-builder',
    element: <MainLayout><SquadBuilder /></MainLayout>
  },
  {
    path: '/recommendations',
    element: <MainLayout><RecommendationsPage /></MainLayout>
  },
  {
    path: '/chemistry',
    element: <MainLayout><ChemistryPage /></MainLayout>
  },
  {
    path: '/simulation',
    element: <MainLayout><SimulationPage /></MainLayout>
  },
  {
    path: '/growth',
    element: <MainLayout><GrowthPredictionPage /></MainLayout>
  },
  {
    path: '/assistant',
    element: <MainLayout><AssistantPage /></MainLayout>
  },
  {
    path: '/analytics',
    element: <MainLayout><AnalyticsPage /></MainLayout>
  },
  {
    path: '/settings',
    element: <MainLayout><SettingsPage /></MainLayout>
  }
]);
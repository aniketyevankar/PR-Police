import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import PullRequests from './pages/PullRequests';
import History from './pages/History';
import ExecutionDetail from './pages/ExecutionDetail';
import Configuration from './pages/Configuration';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="pull-requests" element={<PullRequests />} />
        <Route path="history" element={<History />} />
        <Route path="execution/:id" element={<ExecutionDetail />} />
        <Route path="configuration" element={<Configuration />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
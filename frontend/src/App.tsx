import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { TaskListPage } from './pages/TaskListPage';
import { TaskFormPage } from './pages/TaskFormPage';
import { TaskDetailPage } from './pages/TaskDetailPage';
import { useTheme } from './hooks/useTheme';
import { ToastProvider } from './hooks/useToast';

export const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <ToastProvider>
      <Router basename={import.meta.env.BASE_URL}>
        <div className="min-h-screen text-slate-900 dark:text-slate-100 bg-transparent transition-colors duration-200">
          <Navbar theme={theme} onToggleTheme={toggleTheme} />
          <Routes>
            <Route path="/" element={<TaskListPage />} />
            <Route path="/tasks/new" element={<TaskFormPage />} />
            <Route path="/tasks/:id/edit" element={<TaskFormPage />} />
            <Route path="/tasks/:id" element={<TaskDetailPage />} />
          </Routes>
        </div>
      </Router>
    </ToastProvider>
  );
};

export default App;

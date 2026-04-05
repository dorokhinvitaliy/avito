import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { QueryProvider } from './providers/QueryProvider';
import { ToastProvider } from '@/shared/ui/Toast';
import { ThemeToggle } from '@/shared/ui/ThemeToggle/ThemeToggle';
import './styles/global.css';

export function App() {
  return (
    <QueryProvider>
      <ToastProvider>
        <RouterProvider router={router} />
        <ThemeToggle />
      </ToastProvider>
    </QueryProvider>
  );
}

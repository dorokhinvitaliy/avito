import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AdsListPage } from '@/pages/AdsListPage';
import { AdViewPage } from '@/pages/AdViewPage';
import { AdEditPage } from '@/pages/AdEditPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/ads" replace />,
  },
  {
    path: '/ads',
    element: <AdsListPage />,
  },
  {
    path: '/ads/:id',
    element: <AdViewPage />,
  },
  {
    path: '/ads/:id/edit',
    element: <AdEditPage />,
  },
]);

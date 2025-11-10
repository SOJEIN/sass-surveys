import { createBrowserRouter } from 'react-router';
import Layout from '../components/Layout';
import HomeFine from '../pages/home/find/pages/HomeFine';
import SummaryCreate from '../pages/summary/create/pages/SummaryCreate';
import SummaryFind from '../pages/summary/find/pages/SummaryFind';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomeFine />
      },
      {
        path: 'summary',
        element: <SummaryFind />
      },
      {
        path: 'sass-surveys',
        element: <SummaryFind />
      }
    ]
  },
  {
    path: '/sass-surveys/create',
    element: <SummaryCreate />
  }
]);

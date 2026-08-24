import './index.css';

import { CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App.tsx';
import CreatePost from './components/CreatePost.tsx';
import EditPost from './components/EditPost.tsx';
import Header from './components/Layout.tsx';
import NotFound from './components/NotFound.tsx';
import Profile from './components/Profile.tsx';
import SinglePost from './components/SinglePost.tsx';
import { LoginContextProvider } from './context/LoginContext.tsx';
import { ModalContextProvider } from './context/ModalContext.tsx';
import theme from './theme.ts';

export const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: '/',
    element: <Header />,
    errorElement: <NotFound />,
    children: [
      {
        path: '/',
        element: <App />
      },
      {
        path: '/post/create',
        element: <CreatePost />
      },
      {
        path: '/post/edit/:postId',
        element: <EditPost />
      },
      {
        path: '/post/view/:postId',
        element: <SinglePost />
      },
      {
        path: '/profile/me',
        element: <Profile />
      },
      {
        path: '/profile/:userIdParams',
        element: <Profile />
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LoginContextProvider>
        <ModalContextProvider>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router}></RouterProvider>
          </QueryClientProvider>
        </ModalContextProvider>
      </LoginContextProvider>
    </ThemeProvider>
  </React.StrictMode>
);

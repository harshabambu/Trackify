import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Rootlayout from './Rootlayout';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

const browserRouter = createBrowserRouter([
  {
    path: '/',
    element: <Rootlayout />,
    children: [
      { path: '', element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'dashboard', element: <Dashboard /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={browserRouter} />;
}

export default App;

import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Rootlayout from './Rootlayout';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Tasking from './components/Tasking';
import CalendarView from './components/Calendar';

const browserRouter = createBrowserRouter([
  {
    path: '/',
    element: <Rootlayout />,
    children: [
      { path: '', element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      {
        path: 'dashboard',
        element: <Dashboard />,
        children: [
          { index: true, element: <div>Welcome to your dashboard!</div> },  // Default view for /dashboard
          { path: 'tasking', element: <Tasking /> },
          { path: 'calendar', element: <CalendarView /> },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={browserRouter} />;
}

export default App;

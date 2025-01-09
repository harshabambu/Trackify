import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Rootlayout from './Rootlayout'
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
function App({children}) {
  const browserRouter = createBrowserRouter([
    {path:"",
      element:<Rootlayout/>,
      children:[
        {
          path:"",
          element:<Home/>
        },
        {
          path:'login',
          element:<Login/>
        },
        {
          path:'register',
          element:<Register/>
        }
      ]
    }
  ])
  return <RouterProvider router={browserRouter} >
    {children}
  </RouterProvider>
}

export default App
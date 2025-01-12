import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from './components/Footer'
import Header from './components/Header'

function Rootlayout() {
  return (
    <div className="bg-black  font-poppins">
        <Header />
        <div className='min-h-screen bg-gray-300'><Outlet/></div>
        <Footer/>
    </div>
  )
}

export default Rootlayout
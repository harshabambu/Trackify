import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
const Rootlayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
      <Footer/>
    </div>
  );
};

export default Rootlayout;

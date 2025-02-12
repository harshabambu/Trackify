import React from 'react'
import { Link } from 'react-router-dom'
function Header() {
  return (
    <div className='container py-10 flex justify-between items-center text-white'>
       {/* logo and title */}
       <div>
         <h1 className='font-bold text-4xl'>Tracify</h1>
       </div>
       <div className=''>
       <ul className='flex item-center gap-3 '>
        <li className='inline-block py-2 px-3 hover:text-secondary hover:font-bold'>
           <Link to="/">Home</Link>
        </li>
        <li className='inline-block py-2 px-3 hover:text-secondary hover:font-bold'>
           <Link to="/login">Login</Link>
        </li>
        <li className='inline-block py-2 px-3 hover:text-secondary hover:font-bold'>
           <Link to="/register">Register</Link>
        </li>  
       </ul>
       </div>
    </div>
  )
}

export default Header
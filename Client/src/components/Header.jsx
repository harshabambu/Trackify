import React from 'react'
import { Link } from 'react-router-dom'
function Header() {
  return (
    <div className='bg-slate-500'>
       <ul className='flex justify-between p-4'>
        <li>
           <Link to="/">Home</Link>
        </li>
        <li>
           <Link to="/login">Login</Link>
        </li>
        <li>
           <Link to="/register">Register</Link>
        </li>
       </ul>
    </div>
  )
}

export default Header
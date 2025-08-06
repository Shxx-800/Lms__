import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import { AppContext } from '../../context/AppContext'

const Navbar = () => {

  const {navigate, isEducator, setIsEducator} = useContext(AppContext)

const isCourseListPage = location.pathname.includes('/course-list');

const {openSignIn} = useClerk()
const {user} = useUser()

  const handleBecomeEducator = async () => {
    try {
      if (!user) {
        return openSignIn()
      }

      if (isEducator) {
        navigate('/educator')
        return
      }

      // Call API to update role to educator
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/educator/update-role`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${await window.Clerk.session.getToken()}`
        }
      })

      const data = await response.json()
      
      if (data.success) {
        setIsEducator(true)
        navigate('/educator')
      } else {
        console.error('Failed to become educator:', data.message)
      }
    } catch (error) {
      console.error('Error becoming educator:', error)
    }
  }

  return (
    <div className={`flex items-center justify-between h-14 px-4 sm:px-10 md:px-14 lg:px-32 border-b border-gray-500 py-2 ${isCourseListPage ? 'bg-white' : 'bg-cyan-100/70'}`}>
      <img onClick={()=> navigate('/')} src={assets.logo} alt="Logo" className='w-28 lg:w-36 cursor-pointer' />
      <div className='hidden md:flex items-center gap-5 text-gray-500'>
        <div className='flex items-center gap-5'>
         { user && 
         <>
           <button onClick={handleBecomeEducator}>{isEducator ? 'Educator Dashboard' : 'Become Educator'}</button>
          | <Link to='/my-enrollments'>My Enrollments</Link>
          </>
          }
        </div>
        { user ? <UserButton/> : 
          
          <button onClick={()=> openSignIn()}className='bg-blue-600 text-white px-5 py-2 rounded-full'>Create Account</button>}
      </div>

      {/* For phone Screens */}

      <div className='md:hidden flex items-center gap-2 sm:gap-5 text-gray-500'>
        <div className='flex items-center gap-1 sm:gap-2 max-sm:text-xs'>
         { user && 
         <>
          <button onClick={handleBecomeEducator}>{isEducator ? 'Educator Dashboard' : 'Become Educator'}</button>
          | <Link to='/my-enrollments'>My Enrollments</Link>
          </>
          }
        </div>
        {
          user ? <UserButton/>
          : <button onClick={() => openSignIn()}><img src={assets.user_icon} /></button>
        }
        
      </div>
    </div>
  )
}

export default Navbar;

import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import { AppContext } from '../../context/AppContext'

const Navbar = () => {

  const {navigate, isEducator, setIsEducator, backendUrl} = useContext(AppContext)

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

      // Check if user is admin
      if (user.publicMetadata?.role === 'admin') {
        navigate('/admin')
        return
      }

      // Check current request status
      const statusResponse = await fetch(`${backendUrl}/api/educator/request-status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${await window.Clerk.session.getToken()}`
        }
      })

      const statusData = await statusResponse.json()
      
      if (statusData.success) {
        if (statusData.status === 'approved') {
          setIsEducator(true)
          navigate('/educator')
          return
        } else if (statusData.status === 'pending') {
          alert('Your educator request is pending admin approval')
          return
        } else if (statusData.status === 'rejected') {
          alert('Your educator request was rejected. You can submit a new request.')
        }
      }

      // Show request form
      const requestMessage = prompt('Please provide a brief message about why you want to become an educator:')
      if (!requestMessage) return

      // Submit educator request
      const response = await fetch(`${backendUrl}/api/educator/request-role`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await window.Clerk.session.getToken()}`
        },
        body: JSON.stringify({ requestMessage })
      })

      const data = await response.json()
      
      if (data.success) {
        alert(data.message)
      } else {
        alert(data.message)
      }
    } catch (error) {
      console.error('Error becoming educator:', error)
      alert('An error occurred. Please try again.')
    }
  }

  return (
    <div className={`flex items-center justify-between h-14 px-4 sm:px-10 md:px-14 lg:px-32 border-b border-gray-500 py-2 ${isCourseListPage ? 'bg-white' : 'bg-cyan-100/70'}`}>
      <img onClick={()=> navigate('/')} src={assets.logo} alt="Logo" className='w-28 lg:w-36 cursor-pointer' />
      <div className='hidden md:flex items-center gap-5 text-gray-500'>
        <div className='flex items-center gap-5'>
         { user && 
         <>
           {user.publicMetadata?.role === 'admin' && (
             <button onClick={() => navigate('/admin')} className="text-red-600 font-medium">Admin Panel</button>
           )}
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
          {user.publicMetadata?.role === 'admin' && (
            <button onClick={() => navigate('/admin')} className="text-red-600 font-medium text-xs">Admin</button>
          )}
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

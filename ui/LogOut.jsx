import React from 'react'
import { signOut } from 'next-auth/react'
const LogOut = () => {
  return (
  <>
   <button className="bg-red-600 mt-5 text-white rounded-sm px-6 py-1" onClick={() => signOut()}>
            Logout
          </button>
  </>
  )
}

export default LogOut

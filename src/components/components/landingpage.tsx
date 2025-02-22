import React from 'react'
import {
    ClerkProvider,
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,  
    UserButton,
  } from '@clerk/nextjs'

const Landingpage = () => {
  return (
    <div>
      <SignInButton></SignInButton>
      <SignUpButton></SignUpButton>
    </div>
  )
}

export default Landingpage

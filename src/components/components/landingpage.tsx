import React from 'react'
import { Header1 } from '../ui/header'
import { Hero2 } from '../ui/hero'
import { Feature2 } from '../ui/homefeature'
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
      
      <Header1></Header1>
      <Hero2></Hero2>
      <Feature2></Feature2>
    </div>
  )
}

export default Landingpage

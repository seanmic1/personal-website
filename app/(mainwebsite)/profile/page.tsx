import Education from '@/app/(mainwebsite)/components/Education'
import Experience from '@/app/(mainwebsite)/components/Experience'
import Profile from '@/app/(mainwebsite)/components/Profile'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Profile Page',
}

export default function ProfilePage() {
  
  return (
    <>
      <Profile></Profile>
      <Education></Education>
      <Experience></Experience>
    </>
  )
}
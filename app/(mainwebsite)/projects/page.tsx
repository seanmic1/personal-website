import Projects from '@/app/(mainwebsite)/components/Projects'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects Page',
}

export default function ProjectsList() {
  
  return (
    <>
      <Projects></Projects>
    </>
  )
}
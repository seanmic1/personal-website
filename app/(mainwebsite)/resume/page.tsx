import ResumePage from "../components/Resume";
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Resume Page',
}

export default function Resume() {
  return (
    <ResumePage/>
  )
}

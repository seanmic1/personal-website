import ContactFormWithSocialButtons from '@/app/(mainwebsite)/components/Contact'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Page',
}

export default function BlogList() {
  
  return (
    <>
      <ContactFormWithSocialButtons></ContactFormWithSocialButtons>
    </>
  )
}
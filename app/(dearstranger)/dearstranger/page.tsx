import { redirect } from 'next/navigation'
import React from 'react'

export default function page() {

  redirect("https://dear-stranger.vercel.app/")

  return (
    <div>page</div>
  )
}

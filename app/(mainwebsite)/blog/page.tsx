'use server'

import BlogList from "@/components/BlogList";

import getPosts from "@/lib/getPosts";


export default async function BlogHome() {

  const posts = await getPosts()

  const props = {
    posts: posts
  }

  return(
   <>
    <BlogList {...props}></BlogList>
   </> 
  )
}
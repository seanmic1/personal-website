import { getSortedPostsData } from "../lib/posts"
import ListItem from "./ListItem"

export default function Posts() {
  const posts = getSortedPostsData()
  return (
    <section className="my-12 mx-auto max-w-2xl">
    <ul className="w-full">
        {posts.map(post => (
            <ListItem key={post.id} post={post}/>
        ))}
    </ul>
</section>
  )
}

import Link from "next/link";
import Posts from "../components/Posts";

export default function BlogHome() {

  return (
    <main className="pt-16 px-6 mx-auto">
      <p className="pt-16 text-3xl text-center font-semibold dark:text-white">
        Welcome to Sean&#39;s Blog Page!
      </p>
      <Posts></Posts>
      <section className="my-12 mx-auto max-w-2xl">
        <Link href={'/'} className="pt-16 text-xl text-center dark:text-white">
          ← Back to home page
        </Link>
      </section>  
    </main>
  )
}
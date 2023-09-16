import Posts from "../components/Posts";

export default function BlogHome() {

  return (
    <main className="pt-16 px-6 mx-auto">
      <p className="pt-16 text-3xl text-center font-semibold dark:text-white">
        Welcome to Sean&#39;s Blog Page!
      </p>
      <Posts></Posts>
    </main>
  )
}
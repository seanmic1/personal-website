import ArticleList from '@/components/BlogList'

import getPosts, {getPost} from '@/lib/getPosts'


import { Container, Heading, Image} from '@chakra-ui/react'


export default async function BlogPage({
  params,
}: {
  params: {
    slug: string
  }
}) {

  const post = await getPost(params.slug)
  
  return (
    <>
      <Container maxW={'container.lg'} pt={'120px'}>

        <Image alt='placeholder' src={post?.image}></Image>
        <Heading>
          {post?.title}
        </Heading>
      </Container>
    </>
  )
}
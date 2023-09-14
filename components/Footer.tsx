'use client'

import { ReactNode } from 'react'

import {
  Box,
  Container,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
  Image
} from '@chakra-ui/react'

const ListHeader = ({ children }: { children: ReactNode }) => {
  return (
    <Text fontWeight={'500'} fontSize={'md'} mb={2} color={useColorModeValue('black', 'white')}>
      {children}
    </Text>
  )
}

export default function Footer() {
  return (
    <Box
      bg={useColorModeValue('white', 'black')}
      color={useColorModeValue('gray.700', 'gray.500')}
      borderTopColor={'gray.200'}
      borderWidth={'1px'}>
      <Container as={Stack} maxW={'6xl'} py={10}>
        <SimpleGrid
          templateColumns={{ sm: '1fr', md: '2fr 1fr 1fr' }}
          spacing={8}
          fontSize={'sm'}>
          <Stack spacing={6}>
            <Box>
              <Image alt='Sean ML' src='/seanml_tp.png'></Image>
            </Box>
            <Text fontSize={'sm'}>© 2023</Text>
          </Stack>
          <Stack align={'flex-start'}>
            <ListHeader>About</ListHeader>
            <Box as="a" href={'/profile'}>
              Profile
            </Box>
            <Box as="a" href={'/resume'}>
              Resume
            </Box>
          </Stack>
          <Stack align={'flex-start'}>
            <ListHeader>Pages</ListHeader>
            <Box as="a" href={'/blog'}>
              Blog
            </Box>
            <Box as="a" href={'projects'}>
              Projects
            </Box>
            <Box as="a" href={'contact'}>
              Contact
            </Box>
          </Stack>
        </SimpleGrid>
      </Container>
    </Box>
  )
}
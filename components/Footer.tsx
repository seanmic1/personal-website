'use client'

import { ReactNode } from 'react'

import {
  Box,
  Container,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { SiVercel } from 'react-icons/si'

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
      borderTopColor={'gray.800'}
      borderWidth={'1px'}>
      <Container as={Stack} maxW={'6xl'} py={10}>
        <SimpleGrid
          templateColumns={{ sm: '1fr', md: '2fr 1fr 1fr' }}
          spacing={8}
          fontSize={'sm'}>
          <Stack spacing={6}>
            <Box>
              <SiVercel color={useColorModeValue('black', 'white')} />
            </Box>
            <Text fontSize={'sm'}>© 2023</Text>
          </Stack>
          <Stack align={'flex-start'}>
            <ListHeader>About</ListHeader>
            <Box as="a" href={'#'}>
              Profile
            </Box>
            <Box as="a" href={'#'}>
              Background
            </Box>
            <Box as="a" href={'#'}>
              Education
            </Box>
            <Box as="a" href={'#'}>
              Experience
            </Box>
            <Box as="a" href={'#'}>
              Resume
            </Box>
          </Stack>
          <Stack align={'flex-start'}>
            <ListHeader>Pages</ListHeader>
            <Box as="a" href={'#'}>
              Blog
            </Box>
            <Box as="a" href={'#'}>
              Projects
            </Box>
            <Box as="a" href={'#'}>
              Contact
            </Box>
          </Stack>
        </SimpleGrid>
      </Container>
    </Box>
  )
}
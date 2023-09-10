'use client'

import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Icon,
  Text,
  Stack,
  HStack,
  VStack,
} from '@chakra-ui/react'
import { CheckIcon } from '@chakra-ui/icons'

// Replace test data with your own
const features = [
  {
    id: 1,
    title: 'Profile',
    text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam.'
  },
  {
    id: 2,
    title: 'Yues',
    text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam.'
  },
]

export default function Features() {
  return (
    <Box as='a' id='About' p={4} pt='60px'>
      <Stack spacing={4} as={Container} maxW={'3xl'} textAlign={'center'}>
        <Heading fontSize={'3xl'}>About me</Heading>
        <Text color={'gray.600'} fontSize={'xl'}>
        I am a Software Developer interested in all things tech and software development. From web dev to AI, there's nothing that I don't want to know about in the world of software.
        I am currently working on some projects to build my portfolio while also finding a job that to kickstart my career.
        </Text>
      </Stack>

      <Container maxW={'6xl'} mt={10}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
          {features.map((feature) => (
            <HStack key={feature.id} align={'top'}>
              <Box color={'green.400'} px={2}>
                <Icon as={CheckIcon} />
              </Box>
              <VStack align={'start'}>
                <Text fontWeight={600}>{feature.title}</Text>
                <Text color={'gray.600'}>{feature.text}</Text>
              </VStack>
            </HStack>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  )
}
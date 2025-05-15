'use client'

import {
  Box,
  Heading,
  Container,
  Text,
  Button,
  Stack,
  chakra,
  shouldForwardProp,
  Center,
  Link
} from '@chakra-ui/react'

import { motion, isValidMotionProp } from 'framer-motion'

// Setup Chakra + Framer
const ChakraBox = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop),
})

// Animation Variants
const containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const fadeInUp = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function CallToActionWithAnnotation() {
  return (
    <Container py={{ base: '50px', md: '30px' }}>
      <Stack
        as={ChakraBox}
        variants={containerVariants}
        initial="initial"
        animate="animate"
        textAlign="center"
        spacing={{ base: 8, md: 14 }}
        py={{ base: 20, md: 36 }}
      >
        <ChakraBox variants={fadeInUp}>
          <Heading fontWeight={600} fontSize={{ base: '4xl', sm: '4xl', md: '6xl' }}>
            Hi, I&apos;m <br />
            <Text as="span" color="blue.400">
              Sean Michael
            </Text>
          </Heading>
        </ChakraBox>

        <ChakraBox variants={fadeInUp}>
          <Center>
            <Text color="gray.500" w="30rem">
              Building Impactful Software, One Line of Code at a Time.
            </Text>
          </Center>
        </ChakraBox>

        <ChakraBox variants={fadeInUp}>
          <Stack
            direction="column"
            spacing={3}
            align="center"
            alignSelf="center"
            position="relative"
          >
            <Button
              as="a"
              href="/profile"
              colorScheme="blue"
              bg="blue.400"
              rounded="full"
              px={6}
              _hover={{ bg: 'blue.500' }}
            >
              Learn more about me
            </Button>
            <Link href="/resume">
              <Button variant="link" colorScheme="blue" size="sm">
                or download my resume
              </Button>
            </Link>
          </Stack>
        </ChakraBox>
      </Stack>
    </Container>
  )
}

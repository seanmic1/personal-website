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
  Flex,
  useColorModeValue,
  Center,
  Image,
  Spacer,
  WrapItem,
  Wrap,
  Tag,
} from '@chakra-ui/react'
import { CheckIcon } from '@chakra-ui/icons'

const skills = [
  "PHP",
  "Oracle DB",
  "JQuery",
  "React",
  "NextJS",
  "Java",
  "Postman",
  "Git",
  "Linux",
  "MongoDB",
  "Python",
  "C#",
  "Unity"
]

export default function Profile() {
  return (
    <Container maxW={'container.lg'} pt={{base:'100px', md:'20px'}} centerContent>
      <Stack direction={{base:'column', md:'row'}}>
        <Image src='/SeanPic_cutout.png' alt='Picture of Sean' height={'30rem'} width={'20rem'} objectFit={'cover'} objectPosition={'15px 0px'} p={4} borderRadius={'full'} ></Image>
        <Center p={4}>
          <Stack textAlign={'center'}>
            <Heading fontSize={'3rem'} color={'blue.400'}>About me</Heading>
            <Text color={useColorModeValue('gray.600','gray.400')} fontSize={'l'}>
            The page where I talk about myself
            </Text>
          </Stack>
        </Center>
      </Stack>
      <Stack direction={{base:'column', md:'row'}} justify={'center'} pt={'5rem'} alignContent={'center'}>
        <Box p={5} width={{base:'100%',md:'50%'}}>
          <Heading fontSize={'2rem'} color={'blue.400'}>
            Hey! Thanks for visiting.
          </Heading>
          <Text letterSpacing={'wide'} lineHeight={'6'} pt={4}>
          I've been using computers as long as I can remember so might as well make a job out of it by becoming a Software Engineer.
          <br></br>
          I love learning all sorts of frameworks or technologies available on the web.
          </Text>
        </Box>  
        <Box p={5} width={{base:'100%',md:'50%'}}>
          <Heading fontSize={'2rem'} color={'blue.400'}>
            My skills
          </Heading>
          <Wrap py={4}>
              {skills.map((skill) => 
              (<WrapItem key={skill}>
                  <Tag size={'lg'}>{skill}</Tag>
                </WrapItem>
              ))}
          </Wrap>
        </Box>
      </Stack>
    </Container>
  )
}

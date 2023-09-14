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
  "Python",
  "TypeScript",
  "NextJS",
  "Google Analytics",
  "API",
  "Java",
  "R",
  "PHP",
  "Git",
  "Linux",
  "Oracle DB",
  "MongoDB",
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
          I am Sean Michael, a Computer Science Graduate currenty based in Doha, Qatar.
          <br></br>
          I am working on some pet projects as a pass time as of now, including this website!
          <br></br>
          Aside from that, my hobbies are Dota 2 and playing music, particularly saxophone.
          {/* <br></br>
          I'm naturally a curious person, currently learning all sorts of frameworks or technologies available on the web. I learn fast and adapt even faster, something that is needed in today's software development landscape. If you think I'd be a good fit to your team, you can contact me here. */}
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
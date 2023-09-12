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
    <Container py={{base:'100px', md:'20px'}}>
        <Stack direction={{base:'column', md:'row'}} w={'100%'} justify={'center'}>
          <Image src='/SeanPic_cutout.png' alt='Picture of Sean' height={'30rem'} width={'20rem'} objectFit={'cover'} objectPosition={'15px 0px'} p={4} borderRadius={'full'} ></Image>
          <Center p={4}>
            <Stack textAlign={'center'}>
              <Heading fontSize={'3xl'}>About me</Heading>
              <Text color={useColorModeValue('gray.600','gray.400')} fontSize={'l'}>
              The page where I talk about myself
              </Text>
            </Stack>
          </Center>
        </Stack>
        <Stack direction={{base:'column', md:'row'}} w={'100%'} justify={'center'} p={10}>
          <Box p={4} w={{base:'full', md:'40%'}}>
            <Heading fontSize={'2xl'}>
              Hey! Thanks for visiting this page.
            </Heading>
            <Text letterSpacing={'wide'} lineHeight={'6'} pt={4}>
            I am Sean Michael, a Computer Science Graduate currenty based in Doha, Qatar, but willing to relocate anywhere for a job. 
            <br></br>
            I consider myself a casual coder, but I&apos;m now actively working on digging into Web Dev and ML technologies as a hobby.
            <br></br>
            Aside from that, my hobbies are gaming and playing music. I&apos;m currently learning the saxophone as well
            {/* <br></br>
            I'm naturally a curious person, currently learning all sorts of frameworks or technologies available on the web. I learn fast and adapt even faster, something that is needed in today's software development landscape. If you think I'd be a good fit to your team, you can contact me here. */}
            </Text>
          </Box>  
          <Box ml={'6rem'} p={4} w={'40%'} >
            <Heading fontSize={'2xl'}>
              My skills
            </Heading>
            <Wrap py={4}>
                {skills.map((skill) => 
                (<WrapItem key={skill}>
                    <Tag size={'lg'} mx={2}>{skill}</Tag>
                  </WrapItem>
                ))}
            </Wrap>
          </Box>
        </Stack>
    </Container>
  )
}
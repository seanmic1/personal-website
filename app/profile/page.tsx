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
    <Box bg={useColorModeValue('white','black')} pt={'60px'}>
      
      <Box px={10}>
      
        <Flex direction={'row'} justify={'center'} pt={'30px'} px={'15%'}>

          <Image src='/SeanPic.jpg' height={'30rem'} width={'20rem'} objectFit={'cover'} p={5} rounded={'lg'}></Image>

          <Spacer></Spacer>

          <Center>
            <Stack textAlign={'center'}>
              <Heading fontSize={'3xl'}>About me</Heading>
              <Text color={useColorModeValue('gray.600','gray.400')} fontSize={'l'}>
              A Software Developer interested in all things tech and software development.
              </Text>
            </Stack>
          </Center>
          

        </Flex>
        
        <Stack direction={{base:'column', md:'row'}} w={'100%'} justify={'center'} p={10}>
          <Box p={4} w={{base:'full', md:'40%'}}>
            <Heading fontSize={'2xl'}>
              Hey! Thanks for visiting this page.
            </Heading>
            <Text letterSpacing={'wide'} lineHeight={'6'} pt={4}>
            I'm Sean Michael, a Computer Science Graduate currenty based in Doha, Qatar, but willing to relocate anywhere for a job. 
            <br></br>
            I consider myself a casual coder, but I'm now actively working on digging into Web Dev and ML technologies as a hobby.
            <br></br>
            Aside from that, my hobbies are gaming and music. I'm currently learning the saxophone as well 🎷
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
                (
                  <WrapItem>
                    <Tag key={skill} size={'lg'} mx={2}>{skill}</Tag>
                  </WrapItem>
                ))}
            </Wrap>
          </Box>
        </Stack>
     
      </Box>
    </Box>
  )
}
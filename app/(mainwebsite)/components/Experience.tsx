"use client"

import {
  Image,
  Box,
  Center,
  Container,
  Divider,
  Heading,
  Stack,
  Text,
  Flex,
  chakra,
  shouldForwardProp
} from "@chakra-ui/react";

import { motion, isValidMotionProp } from 'framer-motion'

const ChakraBox = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop),
});

import { GoDotFill } from "react-icons/go";

export default function Experience() {
  return (
    <>
      <Container
        maxW={"container.lg"}
        py={"20px"}
        centerContent
      >
        <Heading p={"3rem"} color={'blue.400'}>Experience</Heading>

        <Stack direction={"column"}>
        <ChakraBox 
            initial={{ opacity: 0, y: 100}}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            //@ts-ignore
            transition={{duration: 0.5}}>
          <Stack direction={"row"}>
            <Box
              height={"fit-content"}
              width={"50%"}
              textAlign={"end"}
              pb={"2rem"}
            >
              <Text>Nov 2022 - Feb 2023</Text>
              <Text fontSize={"1.5rem"} fontWeight={'semibold'}>Juris Technologies</Text>
              <Text fontSize={"1rem"}>💼 Software Engineer Intern</Text>
              <Text fontSize={"1rem"}>📌 Kuala Lumpur, Malaysia</Text>
              <Flex justify={"end"} pt={4}>
                <Image alt="JurisTech Logo" maxW={'300px'} src="/images/juris.png" objectFit={"cover"}></Image>  
              </Flex>
              <Flex justify={"end"} pt={4}>
                <Image alt="The Vertical Towers" width={"350px"} height={"200px"} src="/images/vertical.jpg" objectFit={"cover"}></Image>
              </Flex>
            </Box>
            <Box mx={"1rem"}>
              <Divider orientation="vertical"></Divider>
            </Box>
            <Text height={"fit-content"} width={"50%"} pb={"2rem"}>
              After my second year of university, I took an internship with JurisTech as a <strong>Software Engineer Intern</strong>.
              <br />
              <br />
              JurisTech is a <strong>leading Malaysian-based fintech company</strong>, specialising in enterprise-class software solutions for banks, financial institutions, and telecommunications companies in Malaysia, Southeast Asia, and beyond.
              <br />
              <br />
              During my 3-month internship, I gained a lot of valuable <strong>industry experience</strong>. Without going into too much detail, I was assigned to a team that was responsible for developing a loan origination and collection system for an Indonesian Finance company.
              <br />
              <br />
              I worked with <strong>PHP</strong> as that was the main programming language the system was built upon, but I also worked with PL/SQL for the <strong>Oracle DB</strong> backend. 
              I also configured the system be able to recieve and send <strong>API requests</strong> to and from the client&#39;s systems.
            </Text>
          </Stack>
          </ChakraBox>
          <Center h={"full"}>
            <GoDotFill size={10}></GoDotFill>
          </Center>
          <ChakraBox 
            initial={{ opacity: 0, y: 100}}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            //@ts-ignore
            transition={{duration: 0.5}}>
          <Stack direction={"row"}>
            <Box
              height={"fit-content"}
              width={"50%"}
              textAlign={"end"}
              pb={"2rem"}
            >
              <Text>Feb 2024 - Present</Text>
              <Text fontSize={"1.5rem"} fontWeight={'semibold'}>Juris Technologies</Text>
              <Text fontSize={"1rem"}>💼 Software Engineer</Text>
              <Text fontSize={"1rem"}>📌 Kuala Lumpur, Malaysia</Text>
              <Flex justify={"end"} pt={4}>
                <Image alt="JurisTech Logo" maxW={'300px'} src="/images/juris.png" objectFit={"cover"}></Image>  
              </Flex>
            </Box>
            <Box mx={"1rem"}>
              <Divider orientation="vertical"></Divider>
            </Box>
            <Text height={"fit-content"} width={"50%"} pb={"2rem"}>
              After finishing my course at Monash, I reached out to my internship company to work as a full time Software Engineer where I currently am today.
              <br />
              Writing code, smashing bugs, and doing my honest best to efficiently develop high quality web applications!
              <br />
            </Text>
          </Stack>
          </ChakraBox>
          <Center h={"full"}>
            <GoDotFill size={10}></GoDotFill>
          </Center>
          <ChakraBox 
            initial={{ opacity: 0, y: 100}}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            //@ts-ignore
            transition={{duration: 0.5}}>
          <Stack direction={"row"}>
            <Box
              height={"fit-content"}
              width={"50%"}
              textAlign={"end"}
              pb={"2rem"}
            >
              <Text>Future</Text>
              <Text fontSize={"1.5rem"} fontWeight={'semibold'}>Advancing my Career</Text>
              <Text fontSize={"1rem"}>📌 Anywhere</Text>
            </Box>
            <Box mx={"1rem"}>
              <Divider orientation="vertical"></Divider>
            </Box>
            <Text height={"fit-content"} width={"50%"} pb={"2rem"}>
              I am always seeking opportunities with organizations that not only drive meaningful impact and innovation but also foster growth and development in my career.
              <br />
            </Text>
          </Stack>
          </ChakraBox>
        </Stack>
      </Container>
    </>
  );
}

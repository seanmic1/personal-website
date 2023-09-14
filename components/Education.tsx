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

export default function Education() {
  return (
    <>
      <Container
        maxW={"container.lg"}
        py={"20px"}
        centerContent>
          <Heading p={"3rem"} color={'blue.400'}>
            Education
          </Heading>

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
                <Text>2011 - 2020</Text>
                <Text fontSize={"1.5rem"} fontWeight={'semibold'}>Middle East International School</Text>
                <Text fontSize={"1rem"}>📌 Doha, Qatar</Text>
                <Flex justify={"end"} pt={4}>
                  <Image width={"400px"} height={"200px"} src="/images/mis.jpeg" objectFit={"cover"}></Image>
                </Flex>
              </Box>
              <Box mx={"1rem"}>
                <Divider orientation="vertical"></Divider>
              </Box>
              <Text height={"fit-content"} width={"50%"} pb={"2rem"}>
                I spent my most of my primary and secondary years at Middle East
                International School, an <strong>NEASC-ACE accredited</strong>{" "}
                K-12 school using the American curriculum based on the Common Core
                standards.
                <br />
                <br />
                In my high school years, I undertook AP Biology, AP English
                Literature, AP Macroeconomics, and AP Microeconomics, which are 
                <strong> college-level classes</strong> taken during high school.
                <br />
                <br />
                I served as the <strong>Student Council Grade 11 representative</strong> in 2019 and was selected to be the <strong>Student Council President</strong> in 2020.
                <br />
                <br />I graduated and got my high school diploma here with high
                honors because I was the <strong>5th top student</strong> in overall grades among a
                batch of ~60 students.
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
              pt={"2rem"}
              pb={"2rem"}
            >
              <Text>2020 - 2023</Text>
              <Text fontSize={"1.5rem"} fontWeight={'semibold'}>Monash University Malaysia</Text>
              <Text fontSize={"1rem"}>📌 Subang Jaya, Malaysia</Text>
              <Flex justify={"end"} pt={4}>
                <Image width={"400px"} height={"200px"} src="/images/monash.jpeg" objectFit={"cover"} transform={"0 10"}></Image>
              </Flex>
            </Box>
            <Box mx={"1rem"}>
              <Divider orientation="vertical"></Divider>
            </Box>
            <Text height={"fit-content"} width={"50%"} pt={"2rem"} pb={"2rem"}>
              After high school, I was honored and excited to be accepted into{" "}
              <strong>Monash University Malaysia</strong>, which, as of 2023,
              stands as the <strong>top 42nd university in the world</strong>{" "}
              according to QS World University Rankings.
              <br></br>
              <br></br>
              I completed my <strong>Bachelor of Computer Science in Data
              Science </strong>on June 2023 and will have my graduation ceremony on
              November 2023.
              <br></br>
              <br></br>
              My resulting GPA is <strong>3.4/4.0</strong>
            </Text>
          </Stack>
          </ChakraBox>
        </Stack>
      </Container>
    </>
  );
}

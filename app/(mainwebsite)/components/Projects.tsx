"use client";

import {
  Box,
  Center,
  Container,
  SimpleGrid,
  Text,
  Wrap,
  Avatar,
  Heading,
  Stack,
  Badge,
  Button,
  Image,
  useColorModeValue,
  Link,
} from "@chakra-ui/react";

import { BiLinkExternal } from "react-icons/bi";

export default function Projects() {
  return (
    <Container>
      <Box height={"60px"}></Box>
      <SimpleGrid columns={1}>
        <Center py={32}>
          <Link href="https://dear-stranger.vercel.app/" _hover={{ textDecoration: "none" }}>
            <Box
              maxW={"320px"}
              w={"full"}
              bg={useColorModeValue("white", "gray.900")}
              rounded={"lg"}
              p={6}
              textAlign={"center"}
              shadow={"xl"}
              transition="all ease-in-out 0.3s"
              _hover={{ transform: "scale(1.1)", boxShadow: "2xl"}}
            >
              <Image
                height={"150px"}
                pl={"3.5rem"}
                src={"./dslogo.png"}
                mb={4}
                pos={"relative"}
              />
              <Heading fontSize={"2xl"} fontFamily={"body"}>
                Dear Stranger
              </Heading>
              <Stack
                fontWeight={600}
                color={"blue.500"}
                mb={4}
                direction={"row"}
                alignItems={"center"}
                justify={"center"}
              >
                <div>dear-stranger.vercel.app</div>{" "}
                <BiLinkExternal></BiLinkExternal>
              </Stack>
              <Text
                textAlign={"center"}
                color={useColorModeValue("gray.700", "gray.400")}
                px={3}
              >
                Dear Stranger is about letting people send anonymous letters to
                be answered by absolutely anyone in the world!
              </Text>
            </Box>
          </Link>
        </Center>
      </SimpleGrid>
    </Container>
  );
}

"use client"

import { Button, Flex } from "@chakra-ui/react";
import {saveAs} from "file-saver";
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Resume Page',
}


export default function ResumePage() {

  const saveFile = () => {
    saveAs(
      "/SeanResumeNew.pdf",
      "SeanResume.pdf"
    );
  };

  return(
     <Flex h="100vh" justifyContent="center" alignItems="center">

      <Button
        onClick={saveFile}
        px={4}
        fontSize={'sm'}
        rounded={'full'}
        bg={'blue.400'}
        color={'white'}
        boxShadow={
          '0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)'
        }
        _hover={{
          bg: 'blue.500',
        }}
        _focus={{
          bg: 'blue.500',
        }}>
        Download resume
      </Button>
    </Flex>
  )
}
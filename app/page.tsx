'use client'

import Hero from "@/components/Hero"
import {Box, useColorModeValue}  from "@chakra-ui/react"

export default function Home() {
  
  return (
    <>
      <Box bg={useColorModeValue('white','black')}>
        <Hero/>
      </Box>
    </>
  )
}

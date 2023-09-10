'use client'

import Hero from "@/components/Hero"
import Features from "@/components/Features"
import {Box, useColorModeValue}  from "@chakra-ui/react"

export default function Home() {
  
  return (
    <>
      <Box bg={useColorModeValue('white','black')}>
        <Hero/>
        <Features/>
      </Box>
    </>
  )
}

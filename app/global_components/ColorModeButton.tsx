"use client";

import { Button, Flex, useColorMode } from "@chakra-ui/react";
import { BsSun, BsMoonStarsFill } from "react-icons/bs";
import { motion, useSpring, useTransform, useScroll } from "framer-motion";

const MotionDiv = motion.div;

export default function ColorModeToggle() {
  const { colorMode, toggleColorMode } = useColorMode();

  // Track vertical scroll position
  const { scrollY } = useScroll();

  // Map scrollY to a scale range (smoothly)
  const scale = useTransform(scrollY, [0, 50], [1, 0.8]);
  const smoothScale = useSpring(scale, {
    stiffness: 200,
    damping: 20,
    mass: 0.5,
  });

  return (
    <Flex justifyContent="center" alignItems="center">
      <MotionDiv style={{ scale: smoothScale }}>
        <Button
          aria-label="Toggle Color Mode"
          onClick={toggleColorMode}
          _focus={{ boxShadow: "none" }}
          w="fit-content"
        >
          {colorMode === "light" ? <BsMoonStarsFill /> : <BsSun />}
        </Button>
      </MotionDiv>
    </Flex>
  );
}

import { extendTheme, StyleFunctionProps, type ThemeConfig, defineStyleConfig, useColorModeValue} from '@chakra-ui/react'
import { mode } from "@chakra-ui/theme-tools";


const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

const theme = extendTheme({
  config,
})

export default theme
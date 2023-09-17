import { extendTheme } from '@chakra-ui/react'
import { withProse } from '@nikolovlazar/chakra-ui-prose'

const theme = extendTheme(
  withProse(),
  {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  }
)

export default theme
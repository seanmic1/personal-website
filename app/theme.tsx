import { extendTheme, type ThemeConfig } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

const styles = {
  global: (props: any) => ({
    body: {
      background: mode('light', 'dark')(props),
    },
  }),
};

const theme = extendTheme({
  config,  
  styles,
})

export default theme
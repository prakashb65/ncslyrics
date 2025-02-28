import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  styles: {
    global: {
      body: {
        bg: 'gray.900',
        color: 'white'
      }
    }
  },
  colors: {
    gray: {
      700: '#2d3748',
      800: '#1a202c',
      900: '#171923',
    },
  },
  components: {
    Card: {
      baseStyle: {
        container: {
          bg: 'gray.800',
          borderColor: 'gray.700'
        }
      }
    },
    Button: {
      defaultProps: {
        colorScheme: 'blue'
      }
    }
  }
});

export default theme; 
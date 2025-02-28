import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  styles: {
    global: {
      body: {
        color: 'white',
      },
    },
  },
  components: {
    Input: {
      defaultProps: {
        focusBorderColor: 'blue.400',
      },
      variants: {
        outline: {
          field: {
            bg: 'white',
            borderColor: 'gray.300',
            color: 'gray.800',
            _hover: {
              borderColor: 'gray.400',
            },
            _focus: {
              borderColor: 'blue.400',
              bg: 'white',
            },
            _placeholder: {
              color: 'gray.500',
            },
          },
        },
      },
    },
    Select: {
      variants: {
        outline: {
          field: {
            bg: 'white',
            borderColor: 'gray.300',
            color: 'gray.800',
            _hover: {
              borderColor: 'gray.400',
            },
            _focus: {
              borderColor: 'blue.400',
              bg: 'white',
            },
          },
        },
      },
    },
    Textarea: {
      variants: {
        outline: {
          bg: 'white',
          borderColor: 'gray.300',
          color: 'gray.800',
          _hover: {
            borderColor: 'gray.400',
          },
          _focus: {
            borderColor: 'blue.400',
            bg: 'white',
          },
          _placeholder: {
            color: 'gray.500',
          },
        },
      },
    },
    Table: {
      variants: {
        simple: {
          th: {
            color: 'white',
            borderColor: 'gray.600',
          },
          td: {
            color: 'white',
            borderColor: 'gray.600',
          },
        },
      },
    },
    Heading: {
      baseStyle: {
        color: 'white',
      },
    },
    Text: {
      baseStyle: {
        color: 'white',
      },
    },
  },
});

export default theme; 
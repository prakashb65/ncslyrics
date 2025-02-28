import '@/styles/globals.css'
import { UserProvider } from '@auth0/nextjs-auth0/client'
import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import Layout from '@/components/Layout'
import { useRouter } from 'next/router'
import theme from '@/theme'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith('/admin');

  return (
    <>
      <UserProvider loginUrl="/api/auth/login">
        {isAdminRoute ? (
          <ChakraProvider theme={theme}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ChakraProvider>
        ) : (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        )}
      </UserProvider>
    </>
  );
} 
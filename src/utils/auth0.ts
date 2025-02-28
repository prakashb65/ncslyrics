import { initAuth0 } from '@auth0/nextjs-auth0';

export const auth0 = initAuth0({
  secret: process.env.AUTH0_SECRET,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  baseURL: process.env.AUTH0_BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  routes: {
    callback: '/api/auth/callback',
    login: '/api/auth/login',
    logout: '/api/auth/logout'
  },
  session: {
    absoluteDuration: 24 * 60 * 60, // 24 hours in seconds
    cookie: {
      domain: process.env.AUTH0_COOKIE_DOMAIN,
      secure: process.env.AUTH0_COOKIE_SECURE === 'true',
    }
  }
}); 
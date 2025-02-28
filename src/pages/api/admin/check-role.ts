import { getSession } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';

// Add your admin email(s) here
const ADMIN_EMAILS = [
  // Add your email that you used to sign up with Auth0
  'ncslyrics55@gmail.com'  // Replace this with your actual email
];

export default async function checkRole(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession(req, res);
    
    if (!session || !session.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const isAdmin = ADMIN_EMAILS.includes(session.user.email);

    return res.status(200).json({ 
      isAdmin,
      user: {
        email: session.user.email,
        name: session.user.name,
        picture: session.user.picture
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 
import { handlers } from "@/auth" // Referring to the auth.ts we just created
export const { GET, POST } = handlers

export const authOptions = {
  // ... your existing config
  
  secret: process.env.NEXTAUTH_SECRET,
  
  // Add these:
  trustHost: true,  // Important for production
  
  // For App Router (if using)
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true  // Production mein true hona chahiye
      }
    }
  }
}
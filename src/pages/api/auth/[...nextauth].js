// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google"; // Import GoogleProvider


export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Implement logic to verify user credentials here
        // Example user verification logic (to be replaced with your own logic)
        const user = credentials.username === "jsmith" ? { id: 1, name: "JSmith", email: "jsmith@example.com" } : null;
        
        if (user) {
          return user;
        } else {
          return null;
        }
      }
    }),
    // Add the Google provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // You can add more providers here
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      // Persist the OAuth access_token to the token right after signin
      if (user) {
        token.accessToken = user.accessToken;
      }
      return token;
    },
    session: async ({ session, token }) => {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken;
      return session;
    },
    async signIn({ user, account, profile, email, credentials, req }) {
      const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      
      // Call your logging endpoint
      fetch('http://localhost:3000/api/loginActivity', { // Adjust the URL as necessary
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id, // Or another unique identifier from the user object
          loginMethod: account.provider,
          ipAddress,
        }),
      })
      .then(response => console.log('Login activity logged.'))
      .catch(error => console.error('Failed to log login activity:', error));

      return true;
    },

  },
  // Additional NextAuth configuration...
});

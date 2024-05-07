// pages/api/auth/[...nextauth].js
import User from "@/server/Database/models/User";
import NextAuth from "next-auth";
//import { MongoClient } from 'mongodb';
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google"; // Import GoogleProvider
import bcrypt from "bcrypt";

/* const MONGODB_URI = process.env.MONGODB_URI;
 */
/* let mongoClient = null;

async function getMongoClient() {
  if (!mongoClient) {
    mongoClient = new MongoClient(MONGODB_URI);
    await mongoClient.connect();
  }
  return mongoClient;
} */

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "email", type: "text", placeholder: "your-email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const foundUser = await User.findOne({email: credentials.email}).lean().exec();
          if(foundUser) {
            console.log("User Exists")
            const match = await bcrypt.compare(credentials.password, foundUser.password);

            if(match) {
              console.log("Good Pass");
              delete foundUser.password
              return foundUser;
            }
          }
        } catch(error) {
          console.log(error);
          return null;
        }
      },
    }),
    // Add the Google provider
    GoogleProvider({
      profile(profile) {
        console.log("Profile Google: ", profile);

        return {
          ...profile,
          id: profile.sub,
        };
      },
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // You can add more providers here
  ],
  session: {
    strategy: "jwt"
  },
  database: process.env.MONGODB_URI,
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

  },
  pages: {
    signIn: '/auth/signin',
  },
  
  // Additional NextAuth configuration...
});

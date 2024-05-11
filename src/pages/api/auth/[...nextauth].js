// pages/api/auth/[...nextauth].js
import User from "@/server/Database/models/User";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google"; 
import bcrypt from "bcrypt";
import Plan from "@/server/Database/models/Plan";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "email", type: "text", placeholder: "your-email" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        if (!credentials.email || !credentials.password) {
          console.log("Authorize Error: Email or password not provided");
          return null;
        }
      
        try {
          const foundUser = await User.findOne({ email: credentials.email });
          if (!foundUser) {
            console.log("Authorize Error: No user found with this email");
            return null;
          }
          const match = await bcrypt.compare(credentials.password, foundUser.password);
          if (!match) {
            console.log("Authorize Error: Password does not match");
            return null;
          }
          console.log("Password Match: Successful");
          // Return user data with MongoDB _id
          return { id: foundUser._id, name: foundUser.name, email: foundUser.email };
        } catch (error) {
          console.error("Authorize Error:", error);
          return null;
        }
      }      
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
  secret: process.env.NEXTAUTH_SECRET,
  database: process.env.MONGODB_URI,
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.uid = user.id || user._id;
      }
      const expiryTime = 24 * 60 * 60; // Set JWT expiry time (e.g., 24 hours in seconds)
      token.exp = Math.floor(Date.now() / 1000) + expiryTime;
      return token;
    },
    session: async ({ session, token }) => {
      if (token.uid) {
        session.user.id = token.uid;
        const plans = await Plan.findAll({
          where: { userId: token.uid.toString() }
        });
        session.user.plans = plans.map(plan => plan.toJSON());
      }
      
      return session;
    },
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        // Check if the user exists in the database
        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          // Create a new user if it doesn't exist
          const newUser = await User.create({
            email: user.email,
            name: user.name,
            image: user.image
          });
          return newUser ? true : false;  // Return true to continue the sign-in process
        } else {
          // Optionally update user details if needed
          existingUser.image = user.image || existingUser.image;
          await existingUser.save();
        }
      }
      return true;  // Return true to continue the sign-in process for other providers
    },

  },
  pages: {
    signIn: '/auth/signin',
  },
  
};

export default NextAuth(authOptions);


import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
// Helper function to abstract away getting the session
export function auth(req, res) {
  return getServerSession(req, res, authOptions);
}

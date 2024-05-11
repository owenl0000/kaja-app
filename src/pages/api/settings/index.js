/* // pages/api/settings/index.js
import { getSession } from "next-auth/react";
import UserSettings from "@/server/Database/models/UserSettings";

export default async function handler(req, res) {
  const session = await getSession({ req });
  console.log("Settings/index.js :", session);
  if (!session) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  if (req.method === 'GET') {
    try {
      const settings = await UserSettings.findOne({ where: { userId: session.user.id } });
      res.status(200).json(settings || {});
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const { settings } = req.body;
      const updatedSettings = await UserSettings.upsert({ userId: session.user.id, settings }, { returning: true });
      res.status(200).json(updatedSettings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
 */
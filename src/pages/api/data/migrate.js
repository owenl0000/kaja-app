// pages/api/data/migrate.js
/* import dbConnect from "@/server/routes/dbConnect";
import UserSettings from "@/server/Database/models/UserSettings";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).end('Method Not Allowed');
    }

    try {
        const { userId, data } = req.body;
        await dbConnect();

        // Assume you store it in a UserSettings model
        const settings = await UserSettings.updateOne({ userId }, { $set: { settings: JSON.parse(data) } }, { upsert: true });
        
        res.status(201).json({ message: 'Data migrated successfully!', settings });
    } catch (error) {
        console.error('Failed to save data:', error);
        res.status(500).json({ message: 'Failed to process data', error: error.message });
    }
}
 */
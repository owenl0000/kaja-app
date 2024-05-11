// In your plans API (e.g., pages/api/plans/updateIndexes.js)
import { auth } from "@/utils/auth";
import Plan from "@/server/Database/models/Plan";
import sequelize from "@/server/Database/sequelize";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const session = await auth(req, res);

    if (!session) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const { userId, date, places } = req.body;
    if (userId !== session.user.id) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    try {
        // Implement transaction to ensure all updates are successful
        await sequelize.transaction(async (t) => {
            const promises = places.map(place =>
                Plan.update(
                    { index: place.index },
                    { where: { uniqueId: place.uniqueId, userId: userId, date: date }, transaction: t }
                )
            );
            await Promise.all(promises);
        });

        return res.status(200).json({ message: 'Indexes updated successfully' });
    } catch (error) {
        console.error('Failed to update indexes:', error);
        return res.status(500).json({ message: 'Error updating indexes' });
    }
}

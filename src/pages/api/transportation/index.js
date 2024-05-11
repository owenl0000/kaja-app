import { auth } from "@/utils/auth";
import TransportationData from "@/server/Database/models/TransportationData";

export default async function handler(req, res) {
  const session = await auth(req, res);
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { method } = req;
  const userId = session.user.id; // Assuming you retrieve user ID from session

  try {
    switch (method) {
      case 'GET':
        // Fetch by uniqueId
        const { uniqueId } = req.query;
        if (uniqueId) {
          const data = await TransportationData.findOne({
            where: { userId, uniqueId }
          });
          return data ? res.status(200).json(data) : res.status(404).json({ message: "Data not found" });
        }
        return res.status(400).json({ message: "Unique ID is required for fetching data" });

      case 'POST':
        // Create or update data based on uniqueId presence
        const { data, date: postData, uniqueId: postUniqueId } = req.body;
        if (!postData) return res.status(400).json({ message: "Date is required" });

        if (postUniqueId) {
          // Update existing data
          const existingData = await TransportationData.findOne({ where: { uniqueId: postUniqueId, userId } });
          if (existingData) {
            await existingData.update({ data });
            return res.status(200).json({ message: 'Data updated successfully' });
          }
          // Fallback to creation if not found
          const newData = await TransportationData.create({ userId, date: postData, data, uniqueId: postUniqueId });
          return res.status(201).json(newData);
        } else {
          // Create new data entry with uniqueId
          const newUniqueData = await TransportationData.create({
            userId,
            date: postData,
            data,
            uniqueId: postUniqueId  // Assume uniqueId is provided for creation
          });
          return res.status(201).json(newUniqueData);
        }

      case 'DELETE':
        // Delete by uniqueId
        const { uniqueIdDelete } = req.body;
        if (!uniqueIdDelete) return res.status(400).json({ message: "Unique ID is required for deletion" });

        const deleted = await TransportationData.destroy({
          where: { uniqueId: uniqueIdDelete, userId }
        });
        if (deleted) {
          return res.status(200).json({ message: 'Data deleted successfully' });
        } else {
          return res.status(404).json({ message: 'Data not found' });
        }

      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error handling transportation data:', error);
    return res.status(500).json({ message: "Server error" });
  }
}

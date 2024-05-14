import { auth } from "@/utils/auth";
import HousingData from "@/server/Database/models/HousingData";

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
        const { date } = req.query;
        if (!date) {
          return res.status(400).json({ message: "Date is required for fetching data" });
        }
        const data = await HousingData.findOne({
          where: { userId, date }
        });
        
        // Transform data here to match expected structure if needed
        return res.status(200).json(data ? data.data : []); 

      case 'POST':
        const { data: postData, date: postDataDate } = req.body;
        if (!postDataDate) {
          return res.status(400).json({ message: "Date is required" });
        }

        const existingData = await HousingData.findOne({ where: { userId, date: postDataDate } });
        if (existingData) {
          
          existingData.set('data', postData);
          existingData.changed('data', true);
          try {
            const updatedData = await existingData.save();
            //console.log("Updated data:", updatedData.data); // Log the result of the update
            return res.status(200).json({ message: 'Data updated successfully', data: updatedData });
          } catch (error) {
            //console.error("Error updating data:", error); // Log any errors during update
            return res.status(500).json({ message: "Error updating data" });
          }
        } else {
          //console.log("No existing data found, creating new entry..."); // Log no existing data
          try {
            const newData = await HousingData.create({
              userId,
              date: postDataDate,
              data: postData
            });
            //console.log("New data created:", newData); // Log new data creation
            return res.status(201).json(newData);
          } catch (error) {
            //console.error("Error creating new data:", error); // Log any errors during creation
            return res.status(500).json({ message: "Error creating new data" });
          }
        }

      case 'DELETE':
        // Delete Housing data by date
        const { date: deleteDate } = req.query;
        if (!deleteDate) return res.status(400).json({ message: "Date is required for deletion" });

        const deleted = await HousingData.destroy({
          where: { userId, date: deleteDate }
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
    console.error('Error handling housing data:', error);
    return res.status(500).json({ message: "Server error" });
  }
}

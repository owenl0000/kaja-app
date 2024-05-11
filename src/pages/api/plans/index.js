// pages/api/plans/index.js
import { auth } from "@/utils/auth";
import Plan from "@/server/Database/models/Plan";

export default async function handler(req, res) {
  const session = await auth(req, res);
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  const { method, body, query } = req;
  
  const generateUniqueId = () => {
    return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  try {
    switch (method) {
      case 'GET':
        // Fetch plans either by date or by uniqueId
        const { date, uniqueId } = query;
        let queryOptions = { where: { userId: session.user.id }, order: [['index', 'ASC']] };
        if (date) queryOptions.where.date = date;
        if (uniqueId) queryOptions.where.uniqueId = uniqueId;
        const plans = await Plan.findAll(queryOptions);
        return res.status(200).json(plans);

      case 'POST':
        const { details, date: planDate, index } = body;
        const postUniqueId = body.uniqueId;  // Use a different variable name to avoid conflict
        if (postUniqueId) {
          // Update an existing plan
          await Plan.update({ details, date: planDate }, { where: { uniqueId: postUniqueId, userId: session.user.id } });
          return res.status(200).json({ message: 'Plan updated successfully' });
        } else {
          // Create a new plan
          if (!planDate) {
            return res.status(400).json({ message: "Date is required" });
          }
          const newUniqueId = generateUniqueId();  // Ensure you generate it here if not provided
          const newPlan = await Plan.create({
            userId: session.user.id,
            details,
            date: planDate,
            index,
            uniqueId: newUniqueId
          });
          return res.status(201).json(newPlan);
        }

      case 'DELETE':
        const uniqueIdToDelete = query.uniqueIdDelete; // Corrected variable name
        if (!uniqueIdToDelete) {
          return res.status(400).json({ message: "Unique ID is required for deletion" });
        }
        const deletedPlan = await Plan.destroy({ where: { uniqueId: uniqueIdToDelete, userId: session.user.id } });
        if (deletedPlan) {
          return res.status(200).json({ message: 'Plan deleted successfully' });
        } else {
          return res.status(404).json({ message: 'Plan not found' });
        }

      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error handling plans:', error);
    return res.status(500).json({ message: "Server error" });
  }
  
}

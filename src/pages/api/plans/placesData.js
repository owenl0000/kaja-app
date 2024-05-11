// pages/api/plans/placesData.js
import { auth } from "@/utils/auth";
import Plan from "@/server/Database/models/Plan";

export default async function handler(req, res) {
  const session = await auth(req, res);
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { method } = req;
  const userId = session.user.id;  // Assuming user ID is accessible through the session

  try {
    switch (method) {

      case 'GET':
        const { planId: getPlanId } = req.query; // Fetch planId from query for GET request
        if (!getPlanId) return res.status(400).json({ message: "Plan ID is required for fetching placesData" });

        const planForGet = await Plan.findOne({ where: { uniqueId: getPlanId, userId } });
        if (!planForGet) {
          return res.status(404).json({ message: "Plan not found" });
        }
        return res.status(200).json({ placesData: planForGet.placesData });

      case 'POST':
        const { planId, updates } = req.body;
        if (!planId) return res.status(400).json({ message: "Plan ID is required" });

        const plan = await Plan.findOne({ where: { uniqueId: planId, userId } });
        if (!plan) {
          return res.status(404).json({ message: "Plan not found" });
        }

        plan.placesData = plan.placesData || {};
        Object.keys(updates).forEach(key => {
          plan.placesData[key] = {
            ...plan.placesData[key],
            ...updates[key]
          };
        });

        plan.changed('placesData', true);

        try {
            await plan.update({ placesData: plan.placesData });
            return res.status(200).json({ message: 'placesData updated successfully', placesData: plan.placesData });
        } catch (error) {
            console.error("Failed to update plan:", error);
            return res.status(500).json({ message: "Failed to update plan" });
        }
        


      default:
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error handling placesData:', error);
    return res.status(500).json({ message: "Server error" });
  }
}

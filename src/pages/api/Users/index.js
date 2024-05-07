import dbConnect from '@/server/routes/dbConnect';
import User from '@/server/Database/models/User';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
    const { method } = req;

    await dbConnect();

    if (method === 'POST') {
        try {
            const userData = req.body;
            if (!userData.email || !userData.password) {
                return res.status(400).json({ message: "All fields are required." });
            }

            const duplicate = await User.findOne({ email: userData.email }).lean();

            if (duplicate) {
                return res.status(409).json({ message: "Duplicate Email" });
            }

            const hashPassword = await bcrypt.hash(userData.password, 10);
            const user = await User.create({ ...userData, password: hashPassword });

            return res.status(201).json({ message: "User Created.", user: user._id });
        } catch (error) {
            console.error("Error creating user:", error);
            return res.status(500).json({ message: "Error processing request", error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}

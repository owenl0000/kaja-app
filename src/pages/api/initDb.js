import dbConnect from '@/server/routes/dbConnect'; 

export default async function handler(req, res) {
    try {
        await dbConnect();
        res.status(200).json({ message: 'Database connected successfully!' });
    } catch (error) {
        console.error('Failed to connect to the database', error);
        res.status(500).json({ message: 'Failed to connect to the database' });
    }
}

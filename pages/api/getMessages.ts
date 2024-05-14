import { NextApiRequest, NextApiResponse } from 'next';
import { kv } from '@vercel/kv';

export default async function getMessages(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const keys = await kv.keys('*');
        const messages = await Promise.all(keys.map(async (key) => {
            const message = await kv.get(key);
            return { key, message };
        }));

        res.status(200).json({ messages });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

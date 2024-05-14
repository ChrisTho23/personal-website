import { NextApiRequest, NextApiResponse } from 'next';
import { kv } from '@vercel/kv';

export default async function deleteMessages(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const keys = await kv.keys('*');
        await Promise.all(keys.map(key => kv.del(key)));

        res.status(200).json({ success: true });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

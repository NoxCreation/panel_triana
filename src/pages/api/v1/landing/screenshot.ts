// pages/api/screenshot.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { path, force_refresh } = req.query;
    const baseUrl = process.env.SCREENSHOT_API_URL || 'http://31.187.72.108:8001';

    if (!path || typeof path !== 'string') {
        return res.status(400).json({ error: 'Missing path parameter' });
    }

    try {
        let url = `${baseUrl}/screenshot?path=${encodeURIComponent(path)}`;
        if (force_refresh === 'true') {
            url += '&force_refresh=true';
        }

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Screenshot API responded with status ${response.status}`);
        }

        const buffer = await response.arrayBuffer();
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Cache-Control', 'no-store');
        res.send(Buffer.from(buffer));
    } catch (error) {
        console.error('Error fetching screenshot:', error);
        res.status(500).json({ error: 'Failed to fetch screenshot' });
    }
}
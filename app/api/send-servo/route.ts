import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';

export async function POST(req: Request) {
    try {
        const apiKey = req.headers.get('x-api-key');
        const expectedApiKey = process.env.IOT_API_KEY || process.env.NEXT_PUBLIC_API_KEY;

        if (!apiKey || apiKey !== expectedApiKey) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const docRef = db.collection('sensores').doc('servo');
        await docRef.set({
            status: true,
            timestamp: new Date().toISOString()
        }, { merge: true });

        return NextResponse.json({ success: true, message: 'Servo activated' });
    } catch (error) {
        console.error("Error activating servo:", error);
        return NextResponse.json({ error: 'Failed to activate servo' }, { status: 500 });
    }
}

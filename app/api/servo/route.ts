import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const docRef = db.collection('sensores').doc('servo');
        const doc = await docRef.get();

        if (!doc.exists) {
            return NextResponse.json({ error: 'Servo document not found' }, { status: 404 });
        }

        return NextResponse.json(doc.data());
    } catch (error) {
        console.error("Error fetching servo status:", error);
        return NextResponse.json({ error: 'Failed to fetch servo status' }, { status: 500 });
    }
}

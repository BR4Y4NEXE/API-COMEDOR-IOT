import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const docRef = db.collection('sensores').doc('infrarrojo');
        const doc = await docRef.get();

        if (!doc.exists) {
            return NextResponse.json({ error: 'No data found' }, { status: 404 });
        }

        const data = doc.data();
        return NextResponse.json({
            estado: data?.estado || false,
            fechaHora: data?.fechaHora || null
        });
    } catch (error) {
        console.error("Error fetching infrared data:", error);
        return NextResponse.json({ error: 'Failed to fetch infrared data' }, { status: 500 });
    }
}

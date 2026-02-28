import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const dhtRef = db.collection('sensores').doc('dht11');
        const doc = await dhtRef.get();

        if (!doc.exists) {
            return NextResponse.json({ error: 'No data found' }, { status: 404 });
        }

        const data = doc.data();
        return NextResponse.json({
            temperatura: data?.temperatura || null,
            humedad: data?.humedad || null,
            fechaHora: data?.fechaHora || null
        });
    } catch (error) {
        console.error("Error fetching DHT data:", error);
        return NextResponse.json({ error: 'Failed to fetch DHT data' }, { status: 500 });
    }
}

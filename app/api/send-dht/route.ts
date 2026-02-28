import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';

export async function POST(req: Request) {
    try {
        const apiKey = req.headers.get('x-api-key');
        const expectedApiKey = process.env.IOT_API_KEY || process.env.NEXT_PUBLIC_API_KEY;

        if (!apiKey || apiKey !== expectedApiKey) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { temperatura, humedad } = body;

        if (temperatura === undefined || humedad === undefined) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const timestamp = new Date().toISOString();
        let fechaHoraFormateada = timestamp;

        try {
            const date = new Date(timestamp);
            fechaHoraFormateada = date.toLocaleString('es-ES', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit', second: '2-digit'
            });
        } catch (e) { }

        // Update real-time status
        await db.collection('sensores').doc('dht11').set({
            temperatura,
            humedad,
            fechaHora: fechaHoraFormateada,
            timestamp
        });

        // Add to history
        await db.collection('dht_history').add({
            temperatura,
            humedad,
            fechaHora: fechaHoraFormateada,
            timestamp
        });

        return NextResponse.json({ success: true, message: 'DHT data recorded' });
    } catch (error) {
        console.error("Error saving DHT data:", error);
        return NextResponse.json({ error: 'Failed to record DHT data' }, { status: 500 });
    }
}

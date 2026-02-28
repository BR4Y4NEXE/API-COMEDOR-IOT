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
        const { estado } = body;

        if (estado === undefined) {
            return NextResponse.json({ error: 'Missing estado field' }, { status: 400 });
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

        await db.collection('sensores').doc('infrarrojo').set({
            estado: Boolean(estado),
            fechaHora: fechaHoraFormateada,
            timestamp
        });

        return NextResponse.json({ success: true, message: 'Infrared data recorded' });
    } catch (error) {
        console.error("Error saving infrared data:", error);
        return NextResponse.json({ error: 'Failed to record infrared data' }, { status: 500 });
    }
}

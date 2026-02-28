import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const snapshot = await db.collection('historico')
            .orderBy('timestamp', 'desc')
            .limit(20)
            .get();

        if (snapshot.empty) {
            return NextResponse.json([]);
        }

        const logs = snapshot.docs.map(doc => {
            const data = doc.data();
            let fechaHoraFormateada = data.timestamp;

            // Transformar ISO a formato legible si es necesario
            if (data.timestamp && data.timestamp.includes('T')) {
                try {
                    const date = new Date(data.timestamp);
                    fechaHoraFormateada = date.toLocaleString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                    });
                } catch (e) {
                    // Si falla parseo, dejar original
                }
            }

            return {
                id: doc.id,
                status: data.status,
                timestamp: fechaHoraFormateada,
                rawTimestamp: data.timestamp
            };
        });

        return NextResponse.json(logs);
    } catch (error) {
        console.error("Error fetching servo log:", error);
        return NextResponse.json({ error: 'Failed to fetch servo log' }, { status: 500 });
    }
}

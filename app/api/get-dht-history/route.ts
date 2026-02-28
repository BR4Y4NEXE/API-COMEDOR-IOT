import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const snapshot = await db.collection('dht_history')
            .orderBy('timestamp', 'desc')
            .limit(20)
            .get();

        if (snapshot.empty) {
            return NextResponse.json({ data: [] });
        }

        const data = snapshot.docs.map(doc => {
            const docData = doc.data();
            // Formatear la hora para la gráfica
            let horaFormateada = "";
            if (docData.fechaHora) {
                try {
                    // Extraer solo la hora (HH:MM) del formato "12/10/2023, 14:30:45"
                    const partes = docData.fechaHora.split(', ');
                    if (partes.length === 2) {
                        const horaCompleta = partes[1].split(':');
                        horaFormateada = `${horaCompleta[0]}:${horaCompleta[1]}`;
                    }
                } catch (e) {
                    horaFormateada = docData.fechaHora;
                }
            }

            return {
                id: doc.id,
                temperatura: docData.temperatura,
                humedad: docData.humedad,
                fechaHora: docData.fechaHora,
                hora: horaFormateada,
                timestamp: docData.timestamp
            };
        });

        // Invertir para que los más antiguos salgan primero en la gráfica
        return NextResponse.json({ data: data.reverse() });
    } catch (error) {
        console.error("Error fetching DHT history:", error);
        return NextResponse.json({ error: 'Failed to fetch DHT history', data: [] }, { status: 500 });
    }
}

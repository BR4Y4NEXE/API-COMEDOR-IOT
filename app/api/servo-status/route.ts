import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const docRef = db.collection('sensores').doc('servo');
        const doc = await docRef.get();

        if (!doc.exists) {
            // Valor por defecto para ESP32 si no existe
            return new NextResponse('0', { status: 200 });
        }

        const data = doc.data();
        // Return simple string for ESP32 easy parsing
        return new NextResponse(data?.status ? '1' : '0', { status: 200 });
    } catch (error) {
        console.error("Error fetching servo status:", error);
        return new NextResponse('0', { status: 500 }); // Siempre retornar 0 para ESP32 en caso de error
    }
}

"use client";

import { useEffect, useState } from "react";
import { Activity, RefreshCw } from "lucide-react";
import { EnvironmentStatus } from "@/components/EnvironmentStatus";
import { FoodStatus } from "@/components/FoodStatus";
import { ServoControl } from "@/components/ServoControl";
import { HistoryChart } from "@/components/HistoryChart";
import { LogTable } from "@/components/LogTable";

// Tipos
type DhtData = {
    temperatura: number | null;
    humedad: number | null;
    fechaHora?: string;
};

type InfraredData = {
    estado: boolean;
    fechaHora: string | null;
};

type DhtHistoryData = {
    temperatura: number;
    humedad: number;
    fechaHora: string;
    hora: string;
};

type ServoLogData = {
    status: boolean;
    timestamp: string;
};

export default function Dashboard() {
    const [infrared, setInfrared] = useState<InfraredData>({ estado: false, fechaHora: null });
    const [servoStatus, setServoStatus] = useState<boolean>(false);
    const [dht, setDht] = useState<DhtData>({ temperatura: null, humedad: null });
    const [dhtHistory, setDhtHistory] = useState<DhtHistoryData[]>([]);
    const [servoLog, setServoLog] = useState<ServoLogData[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isActivatingServo, setIsActivatingServo] = useState(false);
    const [lastUpdate, setLastUpdate] = useState<string>("");

    const fetchAllData = async (showRefresh = false) => {
        if (showRefresh) setIsRefreshing(true);

        try {
            // Usar Promise.allSettled para evitar que un fallo bloquee a los demás
            const [dhtRes, infraRes, servoRes, historyRes, logRes] = await Promise.allSettled([
                fetch("/api/get-dht", { cache: 'no-store' }).then(r => r.ok ? r.json() : null),
                fetch("/api/get-infrared", { cache: 'no-store' }).then(r => r.ok ? r.json() : null),
                fetch("/api/servo", { cache: 'no-store' }).then(r => r.ok ? r.json() : null),
                fetch("/api/get-dht-history", { cache: 'no-store' }).then(r => r.ok ? r.json() : null),
                fetch("/api/get-servo-log", { cache: 'no-store' }).then(r => r.ok ? r.json() : null)
            ]);

            if (dhtRes.status === 'fulfilled' && dhtRes.value) {
                setDht({ temperatura: dhtRes.value.temperatura, humedad: dhtRes.value.humedad, fechaHora: dhtRes.value.fechaHora });
            }
            if (infraRes.status === 'fulfilled' && infraRes.value) {
                setInfrared({ estado: Boolean(infraRes.value.estado), fechaHora: infraRes.value.fechaHora });
            }
            if (servoRes.status === 'fulfilled' && servoRes.value) {
                setServoStatus(Boolean(servoRes.value.status));
            }
            if (historyRes.status === 'fulfilled' && historyRes.value?.data) {
                setDhtHistory(Array.isArray(historyRes.value.data) ? historyRes.value.data : []);
            }
            if (logRes.status === 'fulfilled' && logRes.value) {
                setServoLog(Array.isArray(logRes.value) ? logRes.value : []);
            }

            setLastUpdate(new Date().toLocaleTimeString('es-ES'));
        } catch (error) {
            console.error("Error fetching data layout:", error);
        } finally {
            setIsLoading(false);
            if (showRefresh) setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchAllData();
        const interval = setInterval(() => fetchAllData(), 15000); // 15s refresh
        return () => clearInterval(interval);
    }, []);

    const activateServo = async () => {
        if (isActivatingServo) return;
        setIsActivatingServo(true);

        try {
            const response = await fetch("/api/trigger-servo", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': process.env.NEXT_PUBLIC_API_KEY || ''
                }
            });

            if (response.ok) {
                setServoStatus(true);
                setTimeout(() => fetchAllData(), 3000);
                setTimeout(() => setServoStatus(false), 8000);
            } else {
                const errorData = await response.json();
                alert("Error al enviar comando: " + (errorData.error || "Desconocido"));
            }
        } catch (error) {
            alert("Error de conexión al activar el servo");
        } finally {
            setIsActivatingServo(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
                {/* Decorative background blurs */}
                <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl mix-blend-screen opacity-50 animate-pulse" />
                <div className="absolute bottom-1/3 right-1/4 w-[30rem] h-[30rem] bg-emerald-500/10 rounded-full blur-3xl mix-blend-screen opacity-50" />

                <div className="text-center z-10">
                    <div className="relative w-16 h-16 mx-auto mb-6">
                        <div className="absolute inset-0 rounded-full border-t-2 border-cyan-400 animate-spin" />
                        <div className="absolute inset-2 rounded-full border-r-2 border-emerald-400 animate-spin-slow" />
                        <div className="absolute inset-4 rounded-full border-b-2 border-purple-400 animate-spin-reverse" />
                    </div>
                    <p className="text-xl font-medium tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 animate-pulse">
                        Iniciando PetCare...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen p-4 md:p-8 relative overflow-hidden">
            {/* Background decorations */}
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto space-y-8 relative z-10">

                {/* Header Section */}
                <header className="flex flex-col md:flex-row items-center justify-between gap-4 py-4">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-white/10 rounded-2xl shadow-lg shadow-cyan-500/10">
                            <Activity className="w-8 h-8 text-cyan-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-1">
                                PetCare <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Monitor</span>
                            </h1>
                            <div className="flex items-center space-x-2 text-sm text-slate-400">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                <span>Sistema en línea · Actualizado: {lastUpdate}</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => fetchAllData(true)}
                        disabled={isRefreshing}
                        className="group flex items-center space-x-2 px-5 py-2.5 bg-slate-800/50 backdrop-blur-md border border-white/10 rounded-xl hover:bg-slate-800/80 transition-all active:scale-95"
                    >
                        <RefreshCw className={`w-4 h-4 text-cyan-400 ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                        <span className="text-sm font-medium text-slate-200">Refrescar</span>
                    </button>
                </header>

                {/* Dashboard Grid Line 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <EnvironmentStatus
                        temperature={dht.temperatura}
                        humidity={dht.humedad}
                        delay={0.1}
                    />
                    <FoodStatus
                        isEmpty={infrared.estado}
                        lastUpdate={infrared.fechaHora || null}
                        delay={0.2}
                    />
                    <ServoControl
                        status={servoStatus}
                        isActivating={isActivatingServo}
                        onActivate={activateServo}
                        delay={0.3}
                    />
                </div>

                {/* Dashboard Grid Line 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Gráfico ocupa 2 columnas en pantallas grandes */}
                    <div className="lg:col-span-2">
                        <HistoryChart data={dhtHistory} />
                    </div>
                    {/* Tabla ocupa 1 columna */}
                    <div className="lg:col-span-1">
                        <LogTable logs={servoLog} />
                    </div>
                </div>

            </div>
        </main>
    );
}

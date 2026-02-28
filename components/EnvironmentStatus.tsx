"use client";

import { Thermometer, Droplets } from "lucide-react";
import { SensorCard } from "./SensorCard";

interface EnvironmentStatusProps {
    temperature: number | null;
    humidity: number | null;
    delay?: number;
}

export function EnvironmentStatus({ temperature, humidity, delay = 0 }: EnvironmentStatusProps) {
    return (
        <SensorCard
            title="Ambiente"
            icon={<Thermometer className="w-5 h-5 text-cyan-400" />}
            delay={delay}
            className="hover:border-cyan-500/30"
        >
            <div className="grid grid-cols-2 gap-4">
                {/* Temperatura */}
                <div className="bg-slate-800/40 rounded-2xl p-4 border border-white/5 flex flex-col justify-between">
                    <div className="flex items-center space-x-2 mb-2">
                        <div className="p-1.5 rounded-full bg-red-500/10">
                            <Thermometer className="w-4 h-4 text-red-400" />
                        </div>
                        <span className="text-sm font-medium text-slate-400">Temp</span>
                    </div>
                    <div className="flex items-baseline space-x-1">
                        <span className="text-3xl font-bold tracking-tighter text-red-400">
                            {temperature !== null ? temperature : "--"}
                        </span>
                        <span className="text-lg font-medium text-red-400/50">°C</span>
                    </div>
                </div>

                {/* Humedad */}
                <div className="bg-slate-800/40 rounded-2xl p-4 border border-white/5 flex flex-col justify-between">
                    <div className="flex items-center space-x-2 mb-2">
                        <div className="p-1.5 rounded-full bg-blue-500/10">
                            <Droplets className="w-4 h-4 text-blue-400" />
                        </div>
                        <span className="text-sm font-medium text-slate-400">Humedad</span>
                    </div>
                    <div className="flex items-baseline space-x-1">
                        <span className="text-3xl font-bold tracking-tighter text-blue-400">
                            {humidity !== null ? humidity : "--"}
                        </span>
                        <span className="text-lg font-medium text-blue-400/50">%</span>
                    </div>
                </div>
            </div>
        </SensorCard>
    );
}

"use client";

import { Eye } from "lucide-react";
import { SensorCard } from "./SensorCard";
import { cn } from "@/lib/utils";

interface FoodStatusProps {
    isEmpty: boolean; // true = empty, false = full (mapped from infrared status)
    lastUpdate: string | null;
    delay?: number;
}

export function FoodStatus({ isEmpty, lastUpdate, delay = 0 }: FoodStatusProps) {
    return (
        <SensorCard
            title="Comedero"
            icon={<Eye className="w-5 h-5 text-purple-400" />}
            delay={delay}
            className="hover:border-purple-500/30"
        >
            <div className="space-y-5">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-400">Nivel de Alimento</span>
                    <div className={cn(
                        "flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase",
                        isEmpty
                            ? "bg-red-500/10 text-red-400 border border-red-500/20"
                            : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    )}>
                        <div className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            isEmpty ? "bg-red-400 animate-pulse" : "bg-emerald-400"
                        )} />
                        <span>{isEmpty ? "Vacío" : "Lleno"}</span>
                    </div>
                </div>

                <div className="bg-slate-800/40 rounded-2xl p-4 border border-white/5 flex items-center space-x-4">
                    <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border",
                        isEmpty ? "bg-red-500/10 border-red-500/20" : "bg-emerald-500/10 border-emerald-500/20"
                    )}>
                        <div className={cn(
                            "text-2xl",
                            isEmpty ? "opacity-90" : "opacity-100"
                        )}>
                            {isEmpty ? "🔴" : "🟢"}
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-white">
                            {isEmpty ? "El tazón está vacío." : "Hay comida disponible."}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                            {lastUpdate ? `Lectura: ${lastUpdate}` : "Esperando datos..."}
                        </p>
                    </div>
                </div>
            </div>
        </SensorCard>
    );
}

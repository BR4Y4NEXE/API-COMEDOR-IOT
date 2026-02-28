"use client";

import { motion } from "framer-motion";
import { Zap, RefreshCw } from "lucide-react";
import { SensorCard } from "./SensorCard";

interface ServoControlProps {
    status: boolean;
    isActivating: boolean;
    onActivate: () => void;
    delay?: number;
}

export function ServoControl({ status, isActivating, onActivate, delay = 0 }: ServoControlProps) {
    return (
        <SensorCard
            title="Dispensador"
            icon={<Zap className="w-5 h-5 text-emerald-400" />}
            delay={delay}
            className="hover:border-emerald-500/30"
        >
            <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-medium text-slate-400">Estado de la Máquina</span>
                <div className={cn(
                    "flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase",
                    status
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-slate-800/80 text-slate-400 border border-white/5"
                )}>
                    <div className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        status ? "bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" : "bg-slate-500"
                    )} />
                    <span>{status ? "Dispensando" : "En Espera"}</span>
                </div>
            </div>

            <motion.button
                whileHover={{ scale: isActivating ? 1 : 1.02 }}
                whileTap={{ scale: isActivating ? 1 : 0.98 }}
                onClick={onActivate}
                disabled={isActivating}
                className={cn(
                    "w-full relative overflow-hidden group rounded-2xl p-[1px] font-semibold transition-all shadow-lg",
                    isActivating ? "cursor-not-allowed opacity-80" : "hover:shadow-emerald-500/25"
                )}
            >
                <div className={cn(
                    "absolute inset-0 transition-opacity duration-300",
                    isActivating
                        ? "bg-slate-700"
                        : "bg-gradient-to-r from-emerald-500 to-cyan-500 group-hover:opacity-100 opacity-90"
                )} />
                <div className={cn(
                    "relative flex items-center justify-center space-x-2 px-6 py-4 rounded-[15px] transition-colors",
                    isActivating ? "bg-slate-800 text-slate-300" : "bg-transparent text-white"
                )}>
                    {isActivating ? (
                        <>
                            <RefreshCw className="w-5 h-5 animate-spin" />
                            <span>Procesando...</span>
                        </>
                    ) : (
                        <>
                            <Zap className="w-5 h-5 drop-shadow-md" />
                            <span>Dispensar Alimento</span>
                        </>
                    )}
                </div>
            </motion.button>
        </SensorCard>
    );
}

function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(" ");
}

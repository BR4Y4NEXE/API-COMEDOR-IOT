"use client";

import { Clock, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServoLogData {
    status: boolean;
    timestamp: string;
}

interface LogTableProps {
    logs: ServoLogData[];
}

export function LogTable({ logs }: LogTableProps) {
    return (
        <div className="glass-card p-6 border border-white/5 transition-all duration-300 hover:border-white/10">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-medium tracking-tight text-white mb-1">
                        Registro de Activaciones
                    </h3>
                    <p className="text-sm text-slate-400">
                        {logs.length} eventos recientes
                    </p>
                </div>
                <div className="p-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <Clock className="w-5 h-5 text-emerald-400" />
                </div>
            </div>

            {logs.length > 0 ? (
                <div className="overflow-hidden rounded-2xl border border-white/5 bg-slate-900/40">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left whitespace-nowrap">
                            <thead className="text-xs text-slate-400 uppercase bg-slate-800/40 border-b border-white/5">
                                <tr>
                                    <th scope="col" className="px-6 py-4 font-semibold">#</th>
                                    <th scope="col" className="px-6 py-4 font-semibold">Acción</th>
                                    <th scope="col" className="px-6 py-4 font-semibold">Momento Exacto</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {logs.map((log, index) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-slate-800/30 transition-colors duration-200"
                                    >
                                        <td className="px-6 py-4 font-medium text-slate-500">
                                            {String(index + 1).padStart(2, '0')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={cn(
                                                "inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider",
                                                log.status
                                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                                            )}>
                                                {log.status ? (
                                                    <>
                                                        <Zap className="w-3 h-3" />
                                                        <span>Activado</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                                                        <span>Inactivo</span>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs text-slate-400">
                                            {log.timestamp || 'N/A'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="py-12 flex items-center justify-center bg-slate-800/20 rounded-2xl border border-white/5 border-dashed mt-4">
                    <div className="text-center">
                        <Clock className="w-10 h-10 mx-auto mb-3 text-slate-500 opacity-50" />
                        <p className="text-sm font-medium text-slate-300">El registro está vacío</p>
                        <p className="text-xs text-slate-500 mt-1 max-w-[250px] mx-auto">
                            Las activaciones del dispensador aparecerán aquí automáticamente en tiempo real
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

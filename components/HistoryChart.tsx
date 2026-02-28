"use client";

import { Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DhtHistoryData {
    temperatura: number;
    humedad: number;
    fechaHora: string;
    hora: string;
}

interface HistoryChartProps {
    data: DhtHistoryData[];
}

export function HistoryChart({ data }: HistoryChartProps) {
    // Tooltip personalizado
    const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900/95 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-2xl">
                    <p className="text-slate-300 text-sm mb-3 font-medium">{`Hora: ${label}`}</p>
                    <div className="space-y-2">
                        {payload.map((entry: { color: string; dataKey: string; value: number }, index: number) => (
                            <div key={index} className="flex items-center space-x-2">
                                <div
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: entry.color }}
                                />
                                <p className="text-sm font-medium text-slate-200">
                                    {`${entry.dataKey === 'temperatura' ? 'Temperatura' : 'Humedad'}: `}
                                    <span style={{ color: entry.color }}>
                                        {`${entry.value}${entry.dataKey === 'temperatura' ? '°C' : '%'}`}
                                    </span>
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return null;
    };


    return (
        <div className="glass-card p-6 border border-white/5 transition-all duration-300 hover:border-white/10">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-medium tracking-tight text-white mb-1">
                        Historial de Condiciones
                    </h3>
                    <p className="text-sm text-slate-400">
                        {data.length} registros en línea de tiempo
                    </p>
                </div>
                <div className="p-2.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                    <Activity className="w-5 h-5 text-cyan-400" />
                </div>
            </div>

            {data.length > 0 ? (
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis
                                dataKey="hora"
                                stroke="#64748b"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                dy={10}
                            />
                            <YAxis
                                stroke="#64748b"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                dx={-10}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#475569', strokeWidth: 1, strokeDasharray: '4 4' }} />
                            <Legend
                                wrapperStyle={{ paddingTop: '20px' }}
                                iconType="circle"
                            />
                            <Line
                                type="monotone"
                                dataKey="temperatura"
                                name="Temperatura (°C)"
                                stroke="#f43f5e"
                                strokeWidth={3}
                                dot={false}
                                activeDot={{ r: 6, fill: '#f43f5e', strokeWidth: 0 }}
                                connectNulls={false}
                            />
                            <Line
                                type="monotone"
                                dataKey="humedad"
                                name="Humedad (%)"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                dot={false}
                                activeDot={{ r: 6, fill: '#3b82f6', strokeWidth: 0 }}
                                connectNulls={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="h-[350px] flex items-center justify-center bg-slate-800/20 rounded-2xl border border-white/5 border-dashed mt-4">
                    <div className="text-center">
                        <Activity className="w-10 h-10 mx-auto mb-3 text-slate-500 opacity-50" />
                        <p className="text-sm font-medium text-slate-300">Sin datos históricos</p>
                        <p className="text-xs text-slate-500 mt-1 max-w-[200px] mx-auto">
                            Esperando registros de los sensores para generar la gráfica
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

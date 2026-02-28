"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SensorCardProps {
    title: string;
    icon: ReactNode;
    children: ReactNode;
    className?: string;
    delay?: number;
}

export function SensorCard({ title, icon, children, className, delay = 0 }: SensorCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className={cn(
                "glass-card p-6 border border-white/5 transition-all duration-300 hover:border-white/10",
                className
            )}
        >
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-medium tracking-tight text-white">{title}</h2>
                <div className="p-2.5 rounded-full bg-slate-800/50 backdrop-blur-sm border border-white/5">
                    {icon}
                </div>
            </div>
            <div className="space-y-4">
                {children}
            </div>
        </motion.div>
    );
}

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import type { PowerNodeData } from '../data/powerNetwork';
import { Activity, Zap, Server, ChevronDown, ChevronUp } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface PowerNodeProps {
    data: PowerNodeData;
    onExpand?: (id: string, expanded: boolean) => void;
    isExpanded?: boolean;
}

export function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="glass-panel" style={{ padding: '8px', zIndex: 100 }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{label}</p>
                <p style={{ color: 'var(--accent-cyan)', fontWeight: 600, fontSize: '1rem' }}>
                    {payload[0].value} kW
                </p>
            </div>
        );
    }
    return null;
};

export const PowerNode: React.FC<PowerNodeProps> = ({ data, onExpand, isExpanded = false }) => {
    const [expanded, setExpanded] = useState(isExpanded);

    const toggleExpand = () => {
        const nextState = !expanded;
        setExpanded(nextState);
        if (onExpand) {
            onExpand(data.id, nextState);
        }
    };

    const getIcon = () => {
        switch (data.type) {
            case 'substation': return <Server size={20} />;
            case 'building': return <Activity size={20} />;
            case 'transformer': return <Zap size={20} />;
            default: return <Zap size={20} />;
        }
    };

    const loadPercent = Math.round((data.currentLoad / data.capacity) * 100);

    return (
        <div className="node-wrapper">
            <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="power-node"
                onClick={toggleExpand}
            >
                <motion.div layout className="node-header">
                    <div className="node-title-group">
                        <div className={cn("node-icon-box", `status-${data.status}`)}>
                            {getIcon()}
                        </div>
                        <div>
                            <motion.h3 layout="position">{data.name}</motion.h3>
                            <motion.p layout="position">{data.voltage} • {data.type}</motion.p>
                        </div>
                    </div>
                    <div className={cn("node-indicator", data.status)} />
                </motion.div>

                <motion.div layout className="node-stats">
                    <div className="stat-item">
                        <span className="label">Current Load</span>
                        <span className={cn("value", data.status === 'critical' || data.status === 'warning' ? `text-status-${data.status}` : '')}>
                            {data.currentLoad.toLocaleString()} kW
                        </span>
                    </div>
                    <div className="stat-item">
                        <span className="label">Capacity</span>
                        <span className="value">{data.capacity.toLocaleString()} kW</span>
                    </div>
                </motion.div>

                {/* Progress bar for load */}
                <motion.div layout style={{ marginTop: '1rem', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${loadPercent}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        style={{
                            height: '100%',
                            background: data.status === 'online' ? 'var(--status-online)' : data.status === 'warning' ? 'var(--status-warning)' : 'var(--status-critical)'
                        }}
                    />
                </motion.div>

                <AnimatePresence>
                    {expanded && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="node-expanded-content"
                            onClick={(e) => e.stopPropagation()} // Prevent collapse when interacting with contents
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <div className="stat-item">
                                    <span className="label">Efficiency</span>
                                    <span className="value" style={{ color: 'var(--accent-purple)' }}>{data.efficiency}%</span>
                                </div>
                                <div className="stat-item" style={{ textAlign: 'right' }}>
                                    <span className="label">Peak Load</span>
                                    <span className="value">{Math.max(...data.history.map(d => d.usage)).toLocaleString()} kW</span>
                                </div>
                            </div>

                            <div className="graph-container">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={data.history} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id={`colorUsage-${data.id}`} x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="var(--accent-blue)" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="var(--accent-blue)" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="time" hide />
                                        <YAxis domain={['auto', 'auto']} hide />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area
                                            type="monotone"
                                            dataKey="usage"
                                            stroke="var(--accent-cyan)"
                                            fillOpacity={1}
                                            fill={`url(#colorUsage-${data.id})`}
                                            animationDuration={1500}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div layout style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', opacity: 0.5 }}>
                    {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </motion.div>
            </motion.div>

            {/* Children rendering logic moved to FlowCanvas */}
        </div>
    );
};

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { campusPowerNetwork } from '../data/powerNetwork';

export const CampusPieChart: React.FC = () => {
    // Aggregate data from the top-level substations
    const data = campusPowerNetwork.children?.map(sub => ({
        name: sub.name.replace(' Substation', ''),
        value: sub.currentLoad,
        color: sub.id === 'acad-zone' ? '#3b82f6' :
            sub.id === 'hostel-zone' ? '#8b5cf6' :
                '#06b6d4'
    })) || [];

    return (
        <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '2rem', width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Real-Time Load Distribution</h3>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                            animationDuration={1500}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(255,255,255,0.1)" strokeWidth={2} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ background: 'var(--glass-bg)', backdropFilter: 'blur(12px)', border: '1px solid var(--glass-border)', borderRadius: '12px' }}
                            itemStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
                            formatter={(value: any) => [`${(value as number).toLocaleString()} kW`, 'Load']}
                        />
                        <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: 'var(--text-secondary)' }} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

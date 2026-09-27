import React, { useState } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import Panel from "../ui/Panel";

export default function ProgressCharts({ data, totals, onStatusSelect }) {
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const statusData = [
        { name: "Submitted", value: totals.submitted, color: "#10b981" },
        { name: "Pending", value: totals.pending, color: "#f59e0b" },
    ];
    const total = totals.submitted + totals.pending;

    return (
        <section className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-2" aria-label="Interactive progress charts">
            <Panel title="Assignment Completion" subtitle="Select a bar to inspect that assignment">
                <div className="h-[270px] min-w-0">
                    {data.length ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 48 }} onClick={(chartState) => {
                                const selected = chartState?.activePayload?.[0]?.payload;
                                if (selected) setSelectedAssignment(selected);
                            }}>
                                <CartesianGrid stroke="var(--border-color)" strokeDasharray="4 5" vertical={false} />
                                <XAxis dataKey="name" interval={0} angle={-20} textAnchor="end" height={70} tick={{ fill: "var(--muted-text-color)", fontSize: 11 }} tickLine={false} axisLine={{ stroke: "var(--border-color)" }} />
                                <YAxis allowDecimals={false} domain={[0, (maximum) => Math.max(maximum, 1)]} tick={{ fill: "var(--muted-text-color)", fontSize: 11 }} tickLine={false} axisLine={false} />
                                <Tooltip content={<ChartTooltip />} cursor={{ fill: "#2563eb", opacity: 0.08 }} />
                                <Legend wrapperStyle={{ color: "var(--muted-text-color)", fontSize: 12 }} />
                                <Bar dataKey="submitted" name="Submitted" fill="#10b981" radius={[5, 5, 0, 0]} maxBarSize={42} />
                                <Bar dataKey="pending" name="Pending" fill="#f59e0b" radius={[5, 5, 0, 0]} maxBarSize={42} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : <p className="empty-state grid h-full place-items-center">No assignments match the current filters.</p>}
                </div>
                {selectedAssignment && <p className="mt-1 rounded-lg bg-[var(--secondary-panel-background-color)] px-3 py-2 text-sm text-[var(--muted-text-color)]" aria-live="polite"><strong className="text-[var(--assignment-title-color)]">{selectedAssignment.name}</strong>: {selectedAssignment.submitted} submitted, {selectedAssignment.pending} pending.</p>}
            </Panel>

            <Panel title="Submission Distribution" subtitle="Click a segment to filter the table by status">
                <div className="grid min-h-[270px] grid-cols-1 items-center gap-3 sm:grid-cols-[minmax(180px,1fr)_minmax(140px,0.8fr)]">
                    <div className="relative h-[230px] min-w-0">
                        {total ? (
                            <>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={66} outerRadius={94} paddingAngle={4} stroke="var(--panel-background-color)" strokeWidth={4} onClick={(segment) => onStatusSelect(segment.name)}>
                                            {statusData.map((entry) => <Cell key={entry.name} fill={entry.color} className="cursor-pointer transition-opacity hover:opacity-80" />)}
                                        </Pie>
                                        <Tooltip content={<ChartTooltip />} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="pointer-events-none absolute inset-0 grid place-content-center text-center">
                                    <strong className="text-3xl text-[var(--assignment-title-color)]">{total}</strong>
                                    <span className="stat-label">Records</span>
                                </div>
                            </>
                        ) : <p className="empty-state grid h-full place-items-center">No progress data for these filters.</p>}
                    </div>
                    <div className="space-y-3">
                        {statusData.map((item) => {
                            const percent = total ? Math.round((item.value / total) * 100) : 0;
                            return (
                                <button key={item.name} type="button" onClick={() => onStatusSelect(item.name)} className="group flex w-full items-center gap-3 rounded-lg border border-transparent p-2 text-left transition-colors hover:border-[var(--border-color)] hover:bg-[var(--secondary-panel-background-color)]">
                                    <span className="h-3 w-3 flex-none rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="min-w-0 flex-1 text-sm text-[var(--muted-text-color)]">{item.name}</span>
                                    <strong className="text-sm text-[var(--assignment-title-color)]">{item.value}</strong>
                                    <span className="w-12 text-right text-xs text-[var(--muted-text-color)]">{percent}%</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </Panel>
        </section>
    );
}

function ChartTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-lg border border-[var(--border-color)] bg-[var(--panel-background-color)] px-3 py-2 shadow-lg">
            {label && <p className="mb-1 max-w-56 text-xs font-semibold text-[var(--assignment-title-color)]">{label}</p>}
            {payload.map((item) => <p key={item.dataKey || item.name} className="my-0.5 text-xs" style={{ color: item.color || item.payload?.color }}>{item.name}: <strong>{item.value}</strong></p>)}
        </div>
    );
}

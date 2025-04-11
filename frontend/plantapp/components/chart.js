"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine, Tooltip, ResponsiveContainer, Label } from 'recharts';
import { parseISO, format } from 'date-fns';

export default function chart({title, label, data, limits}) {

    const formattedData = data.map((d) => ({
        timestamp: format(parseISO(d.timestamp), 'HH:mm'),
        value: d.value
    }));

    return (
        <div className="bg-white shadow-md p-4 rounded-lg h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
                <h2>{title}</h2>
                <LineChart data={formattedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" tickFormatter={(val) => val} minTickGap={40}>
                    <Label value="Time" offset={10} position="bottom" />
                </XAxis>
                <YAxis>
                <Label
                value={label}
                angle={-90} 
                position="insideLeft" 
                style={{ textAnchor: 'middle' }}
                />
                </YAxis>
                <Tooltip labelFormatter={(val) => `Hour: ${val}`} />
                <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} dot/>
                {limits.map((limit, index) => (
                <ReferenceLine
                    key={index}
                    y={limit}
                    stroke="red"
                    strokeDasharray="4 4"
                    label={{ value: `Limit ${limit}`, position: 'right', fill: 'red' }}
                />
                ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}
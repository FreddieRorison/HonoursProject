"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine, Tooltip, ResponsiveContainer, Label } from 'recharts';
import { parseISO, format } from 'date-fns';

export default function chart({title, label, data, limits}) {
    console.log('data', data)
    const formattedData = data.length > 0 ? data.map((d) => ({
        timestamp: format(parseISO(d.Date), 'HH:mm'),
        value: d.Value
    })) : null

    return (
        <div className="bg-white shadow-md p-4 rounded-lg h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
                <h2>{title}</h2>

                {!data.length > 0 ? (
                <div className="">
                <span className="text-gray-500 text-sm">No data available</span>
                </div>
                ) : (<LineChart data={formattedData}>
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
                    <Tooltip labelFormatter={(val) => `Time: ${val}`} />
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
                    </LineChart>)} 
                
            </ResponsiveContainer>
        </div>
    )
}
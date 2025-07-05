'use client';

import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function MonthlyChart({ transactions }: { transactions: { amount: number; date: string }[] }) {
  const map: Record<string, number> = {};
  transactions.forEach((t) => {
    const m = new Date(t.date).toLocaleString('default', { month: 'short' });
    map[m] = (map[m] || 0) + t.amount;
  });
  const data = Object.entries(map).map(([month, amount]) => ({ month, amount }));

  return (
    <Card className="p-6">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount" fill="#4f46e5" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

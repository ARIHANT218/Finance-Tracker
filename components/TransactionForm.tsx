'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';


export interface TxData { amount: number; description: string; date: string; }
interface Props { onSubmit: (d: TxData) => void; defaultData?: TxData | null; }

export default function TransactionForm({ onSubmit, defaultData }: Props) {
  const [form, setForm] = useState<TxData>({ amount: 0, description: '', date: '' });
  const [error, setError] = useState('');
  useEffect(() => { if (defaultData) setForm(defaultData); }, [defaultData]);

  const handle = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.amount || !form.description || !form.date) {
      setError('All fields are required');
      return;
    }
    setError('');
    onSubmit(form);
    toast.success('Transaction added!');
    setForm({ amount: 0, description: '', date: '' });
  };

  return (
    <Card>
      <CardHeader className="font-semibold">
        {defaultData ? 'Edit Transaction' : 'Add Transaction'}
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="grid gap-4">
          {[
            { label: 'Amount', name: 'amount', type: 'number', placeholder: 'e.g. 1200' },
            { label: 'Description', name: 'description', type: 'text', placeholder: 'Rent, Salary…' },
            { label: 'Date', name: 'date', type: 'date' },
          ].map((f) => (
            <div key={f.name} className="grid gap-1">
              <Label htmlFor={f.name}>{f.label}</Label>
              <Input
                id={f.name}
                name={f.name}
                type={f.type}
                placeholder={f.placeholder}
                value={form[f.name as keyof TxData]}
                onChange={handle}
              />
            </div>
          ))}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full">
            {defaultData ? 'Update' : 'Add'} Transaction
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';
import TransactionForm, { TransactionData } from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';
import MonthlyChart from '@/components/MonthlyChart';

interface Transaction extends TransactionData {
  _id: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Transaction | null>(null);

  const params = useSearchParams();
  const editIdFromQuery = params.get('edit'); 

  useEffect(() => {
    fetch('/api/transactions')
      .then((r) => r.json())
      .then((data: Transaction[]) => {
        setTransactions(data);
        
        if (editIdFromQuery) {
          const found = data.find((t) => t._id === editIdFromQuery);
          if (found) setEditing(found);
        }
      })
      .catch(() => alert('Error loading transactions'))
      .finally(() => setLoading(false));
  }, [editIdFromQuery]);

 
  const saveTx = async (data: TransactionData) => {
    const method = editing ? 'PUT' : 'POST';
    const url = editing
      ? `/api/transactions/${editing._id}`
      : '/api/transactions';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const saved: Transaction = await res.json();

    setTransactions((prev) =>
      editing
        ? prev.map((t) => (t._id === saved._id ? saved : t))
        : [saved, ...prev],
    );
    setEditing(null);
  };

  const deleteTx = async (id: string) => {
    await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
    setTransactions((prev) => prev.filter((t) => t._id !== id));
  };


  return (
    <main className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold mb-2">💸 Transaction Tracker</h1>

      <Tabs defaultValue={editIdFromQuery ? 'form' : 'list'} className="space-y-4">
        <TabsList>
          <TabsTrigger value="form">{editing ? 'Edit' : 'Add'} Transaction</TabsTrigger>
          <TabsTrigger value="list">Transactions</TabsTrigger>
          <TabsTrigger value="chart">Monthly Chart</TabsTrigger>
        </TabsList>

       
        <TabsContent value="form">
          <TransactionForm onSubmit={saveTx} defaultData={editing ?? undefined} />
        </TabsContent>

       
        <TabsContent value="list">
          {loading ? (
            <p className="text-center text-muted-foreground">Loading…</p>
          ) : (
            <TransactionList
              transactions={transactions}
              onDelete={deleteTx}
              onEdit={(tx) => setEditing(tx)}
            />
          )}
        </TabsContent>

       
        <TabsContent value="chart">
          <MonthlyChart transactions={transactions} />
        </TabsContent>
      </Tabs>
    </main>
  );
}

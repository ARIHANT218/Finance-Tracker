'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TransactionList from '@/components/TransactionList';
import type { TxData} from '@/components/TransactionForm';

interface Transaction extends TxData {
  _id: string;
}

export default function HomePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  /* ─────────── Fetch once on mount ─────────── */
  useEffect(() => {
    fetch('/api/transactions')
      .then((r) => r.json())
      .then(setTransactions)
      .catch(() => alert('Error loading transactions'))
      .finally(() => setLoading(false));
  }, []);

  /* ─────────── CRUD helpers ─────────── */
  const deleteTx = async (id: string) => {
    await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
    setTransactions((prev) => prev.filter((t) => t._id !== id));
  };

  /** Redirect to the tabbed page with ?edit=<id> so the user can edit */
  const editTx = (tx: Transaction) => {
    router.push(`/transactions?edit=${tx._id}`);
  };

  /* ─────────── Render ─────────── */
  return (
    <main className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold mb-2">💸 Recent Transactions</h1>

      {loading ? (
        <p className="text-center text-muted-foreground">Loading…</p>
      ) : (
        <TransactionList
          transactions={transactions}
          onDelete={deleteTx}
          onEdit={editTx}
        />
      )}
    </main>
  );
}

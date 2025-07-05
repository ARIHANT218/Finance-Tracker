// app/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import TransactionForm, { TxData } from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';
import { toast } from 'sonner';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

// Define the ClientTransaction interface for client-side use (matches API response)
interface ClientTransaction extends TxData {
  _id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export default function Home() {
  const [transactions, setTransactions] = useState<ClientTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<ClientTransaction | null>(null);

  // Function to fetch transactions from the API
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/transactions');
      if (!res.ok) {
        throw new Error(`Failed to fetch transactions: ${res.statusText}`);
      }
      const data: ClientTransaction[] = await res.json();
      setTransactions(data);
    } catch (err: any) {
      console.error('Error fetching transactions:', err);
      setError(err.message || 'Failed to load transactions.');
      toast.error('Failed to load transactions.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch transactions on component mount
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Handle form submission (add or update)
  const handleSubmitTransaction = async (data: TxData) => {
    try {
      let res: Response;
      if (editingTransaction) {
        // Update existing transaction
        res = await fetch(`/api/transactions/${editingTransaction._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      } else {
        // Add new transaction
        res = await fetch('/api/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Failed to ${editingTransaction ? 'update' : 'add'} transaction`);
      }

      // Re-fetch transactions to update the list
      await fetchTransactions();
      setEditingTransaction(null); // Clear editing state after successful submission
    } catch (err: any) {
      console.error('Error submitting transaction:', err);
      toast.error(err.message || `Failed to ${editingTransaction ? 'update' : 'add'} transaction.`);
    }
  };

  // Handle transaction deletion
  const handleDeleteTransaction = async (id: string) => {
    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete transaction');
      }

      toast.success('Transaction deleted successfully!');
      // Update state directly for immediate feedback, then re-fetch for consistency
      setTransactions(prev => prev.filter(t => t._id !== id));
      // Optionally re-fetch after a short delay or on next interaction
      // fetchTransactions();
    } catch (err: any) {
      console.error('Error deleting transaction:', err);
      toast.error(err.message || 'Failed to delete transaction.');
    }
  };

  // Handle edit button click
  const handleEditTransaction = (transaction: ClientTransaction) => {
    setEditingTransaction(transaction);
  };

  // Calculate total income and expenses
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpenses;

  // Helper for currency formatting
  const currencyFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <main className="container mx-auto p-4 md:p-8 max-w-4xl">
      <h1 className="text-4xl font-bold text-center mb-8">Finance Tracker</h1>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Transaction Form */}
        <TransactionForm
          onSubmit={handleSubmitTransaction}
          defaultData={editingTransaction}
        />

        {/* Summary Card */}
        <Card className="h-fit">
          <CardHeader className="font-semibold text-lg">Summary</CardHeader>
          <CardContent className="grid gap-2">
            <div className="flex justify-between items-center text-lg">
              <span>Total Income:</span>
              <span className="font-bold text-emerald-600">{currencyFormatter.format(totalIncome)}</span>
            </div>
            <div className="flex justify-between items-center text-lg">
              <span>Total Expenses:</span>
              <span className="font-bold text-red-600">{currencyFormatter.format(totalExpenses)}</span>
            </div>
            <div className="flex justify-between items-center text-xl font-bold border-t pt-2 mt-2">
              <span>Net Balance:</span>
              <span className={netBalance >= 0 ? 'text-emerald-700' : 'text-red-700'}>
                {currencyFormatter.format(netBalance)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction List */}
      <Card>
        <CardHeader className="font-semibold text-lg">All Transactions</CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground">Loading transactions...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <TransactionList
              transactions={transactions}
              onDelete={handleDeleteTransaction}
              onEdit={handleEditTransaction}
            />
          )}
        </CardContent>
      </Card>
    </main>
  );
}

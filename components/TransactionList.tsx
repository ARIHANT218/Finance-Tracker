// components/TransactionList.tsx
'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

// Define the interface for a single transaction, extending the base ITransaction from the model
// Note: _id is a string here as it's serialized from ObjectId
interface Transaction {
  _id: string;
  amount: number;
  description: string;
  date: string; // Will be a string (ISO date) from API
  type: 'income' | 'expense';
  category?: string;
}

// Props interface for TransactionList component
interface Props {
  transactions: Transaction[];
  onDelete: (id: string) => Promise<void>; // onDelete is now async
  onEdit: (t: Transaction) => void;
}

// Helper for currency formatting
const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR', // Indian Rupees
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export default function TransactionList({ transactions, onDelete, onEdit }: Props) {
  // State to manage which transaction is currently being deleted (for loading indicator)
  const [deletingId, setDeletingId] = useState<string | null>(null);
  // State to manage the confirmation dialog
  const [showConfirm, setShowConfirm] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);

  // Function to handle delete click, showing confirmation first
  const handleDeleteClick = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
    setShowConfirm(true);
  };

  // Function to confirm deletion
  const confirmDelete = async () => {
    if (transactionToDelete) {
      setDeletingId(transactionToDelete._id); // Set loading state for this specific ID
      setShowConfirm(false); // Close the confirmation dialog
      try {
        await onDelete(transactionToDelete._id);
      } finally {
        setDeletingId(null); // Clear loading state
        setTransactionToDelete(null); // Clear transaction to delete
      }
    }
  };

  // Function to cancel deletion
  const cancelDelete = () => {
    setShowConfirm(false);
    setTransactionToDelete(null);
  };

  return (
    <div className="grid gap-4">
      {transactions.length === 0 ? (
        <p className="text-center text-muted-foreground mt-8">No transactions found. Add one to get started!</p>
      ) : (
        transactions.map((t) => (
          <Card key={t._id} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
              <div>
                <p className="font-semibold">{t.description}</p>
                <p className="text-sm text-muted-foreground">
                  {t.date ? new Date(t.date).toLocaleDateString() : 'Invalid Date'}
                  {t.category && <span className="ml-2 text-xs px-2 py-0.5 bg-gray-100 rounded-full">{t.category}</span>}
                </p>
              </div>
              {/* Conditionally apply color based on transaction type */}
              <p className={`font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                {currencyFormatter.format(t.amount)}
              </p>
            </CardHeader>
            <CardContent className="flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => onEdit(t)}>
                Edit
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDeleteClick(t)} // Use the new handler
                disabled={deletingId === t._id} // Disable button if this item is being deleted
              >
                {deletingId === t._id ? 'Deleting...' : 'Delete'}
              </Button>
            </CardContent>
          </Card>
        ))
      )}

      {/* Confirmation Dialog */}
      {showConfirm && transactionToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 max-w-sm w-full text-center">
            <CardHeader className="text-lg font-semibold">Confirm Deletion</CardHeader>
            <CardContent>
              <p className="mb-4">Are you sure you want to delete the transaction:</p>
              <p className="font-bold mb-4">"{transactionToDelete.description}" of {currencyFormatter.format(transactionToDelete.amount)}?</p>
              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={cancelDelete}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={confirmDelete}>
                  Confirm Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

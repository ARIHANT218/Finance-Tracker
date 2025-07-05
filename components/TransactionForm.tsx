// components/TransactionForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Interface for transaction data to be submitted
export interface TxData {
  amount: number;
  description: string;
  date: string; // ISO date string (YYYY-MM-DD)
  type: 'income' | 'expense';
  category?: string;
}

// Props interface for TransactionForm component
interface Props {
  onSubmit: (d: TxData) => Promise<void>; // onSubmit is now async
  defaultData?: TxData | null; // Optional default data for editing
}

export default function TransactionForm({ onSubmit, defaultData }: Props) {
  // Initialize form state
  const [form, setForm] = useState<TxData>({
    amount: 0,
    description: '',
    date: '',
    type: 'expense', // Default to expense
    category: '',
  });
  const [error, setError] = useState(''); // State for client-side form validation errors
  const [isLoading, setIsLoading] = useState(false); // State for form submission loading

  // Effect to pre-fill form when defaultData is provided (for editing)
  useEffect(() => {
    if (defaultData) {
      // Format date to 'YYYY-MM-DD' for native date input
      const formattedDate = defaultData.date ? new Date(defaultData.date).toISOString().split('T')[0] : '';
      setForm({
        ...defaultData,
        date: formattedDate,
      });
    } else {
      // Reset form for new transaction
      setForm({
        amount: 0,
        description: '',
        date: new Date().toISOString().split('T')[0], // Default to current date for new transactions
        type: 'expense',
        category: '',
      });
    }
  }, [defaultData]);

  // Handle input changes (generic for all fields)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === 'number' ? parseFloat(value) || 0 : value, // Parse amount as number
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default browser form submission

    // Client-side validation
    if (!form.amount || !form.description || !form.date || !form.type) {
      setError('Amount, Description, Date, and Type are required.');
      return;
    }
    if (form.amount <= 0) {
      setError('Amount must be greater than zero.');
      return;
    }

    setError(''); // Clear any previous errors
    setIsLoading(true); // Set loading state

    try {
      await onSubmit(form); // Call the parent's onSubmit function
      toast.success(defaultData ? 'Transaction updated successfully!' : 'Transaction added successfully!');
      // Reset form only if it was an "add" operation (not edit)
      if (!defaultData) {
        setForm({
          amount: 0,
          description: '',
          date: new Date().toISOString().split('T')[0],
          type: 'expense',
          category: '',
        });
      }
    } catch (submitError) {
      console.error('Form submission error:', submitError);
      toast.error('Failed to save transaction. Please try again.');
      // You might want to set a specific error message based on the submitError
      setError('An error occurred during submission.');
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <Card>
      <CardHeader className="font-semibold text-lg">
        {defaultData ? 'Edit Transaction' : 'Add New Transaction'}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          {/* Amount Input */}
          <div className="grid gap-1">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              placeholder="e.g. 1200.50"
              value={form.amount === 0 ? '' : form.amount} // Show empty for 0 initially
              onChange={handleInputChange}
              min="0.01" // Minimum positive value
              step="0.01" // Allow decimals
            />
          </div>

          {/* Description Input */}
          <div className="grid gap-1">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              type="text"
              placeholder="e.g. Groceries, Monthly Salary"
              value={form.description}
              onChange={handleInputChange}
            />
          </div>

          {/* Date Input */}
          <div className="grid gap-1">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={form.date}
              onChange={handleInputChange}
            />
          </div>

          {/* Type Selection (Income/Expense) */}
          <div className="grid gap-1">
            <Label htmlFor="type">Type</Label>
            <select
              id="type"
              name="type"
              value={form.type}
              onChange={handleInputChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          {/* Category Input (Optional) */}
          <div className="grid gap-1">
            <Label htmlFor="category">Category (Optional)</Label>
            <Input
              id="category"
              name="category"
              type="text"
              placeholder="e.g. Food, Transport, Salary"
              value={form.category}
              onChange={handleInputChange}
            />
          </div>

          {/* Error Message Display */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Processing...' : (defaultData ? 'Update' : 'Add') + ' Transaction'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

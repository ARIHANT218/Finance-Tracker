'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Transaction {
  _id: string;
  amount: number;
  description: string;
  date: string;
}
interface Props {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onEdit: (t: Transaction) => void;
}
export default function TransactionList({ transactions, onDelete, onEdit }: Props) {
  return (
    <div className="grid gap-4">
      {transactions.map((t) => (
        <Card key={t._id} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
            <div>
              <p className="font-semibold">{t.description}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(t.date).toLocaleDateString()}
              </p>
            </div>
            <p className="font-bold text-emerald-600">₹{t.amount}</p>
          </CardHeader>
          <CardContent className="flex justify-end gap-2">
            <Button size="sm" variant="outline" onClick={() => onEdit(t)}>
              Edit
            </Button>
            <Button size="sm" variant="destructive" onClick={() => onDelete(t._id)}>
              Delete
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

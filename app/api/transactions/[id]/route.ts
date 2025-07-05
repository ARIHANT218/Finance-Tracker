// app/api/transactions/[id]/route.ts
import { connectDB } from '@/lib/db';
import Transaction from '@/models/transaction';
import { NextResponse } from 'next/server';

type Params = {
  params: { id: string };
};

export async function PUT(req: Request, { params }: Params) {
  try {
    await connectDB();
    const body = await req.json();
    const { amount, description, date } = body;

    const updated = await Transaction.findByIdAndUpdate(
      params.id,
      { amount, description, date },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (err) {
    console.error('Error updating transaction:', err);
    return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    await connectDB();
    const deleted = await Transaction.findByIdAndDelete(params.id);

    if (!deleted) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error('Error deleting transaction:', err);
    
    return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 });
  }
}



import { connectDB } from '@/lib/db';
import Transaction from '@/models/transaction';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectDB();
    const transactions = await Transaction.find().sort({ date: -1 });
    return NextResponse.json(transactions);
  } catch (err) {
     console.error('GET /transactions error:', err);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { amount, description, date } = body;

    if (!amount || !description || !date) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const newTransaction = await Transaction.create({ amount, description, date });
    return NextResponse.json(newTransaction);
  } catch (err) {
     console.error('POST /transactions error:', err);
    return NextResponse.json({ error: 'Failed to add transaction' }, { status: 500 });
  }
}

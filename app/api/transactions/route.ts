// app/api/transactions/route.ts
import { connectDB } from '@/lib/db';
import Transaction, { ITransaction } from '@/models/transaction';
import { NextResponse, NextRequest } from 'next/server';

// In a real application, you would get the userId from an authentication system (e.g., NextAuth.js)
// For this example, we'll use a placeholder.
// This function would typically parse a JWT token or session to get the user ID.
function getAuthenticatedUserId(_req : NextRequest): string {
  // Placeholder: In a real app, this would come from auth context/session.
  // For demonstration, let's use a fixed ID or generate a random one if no auth.
  // If you integrate Firebase, you'd get it from auth.currentUser.uid
  return '60d5ec49f8c7d00015f8e1a1'; // Example fixed ID for testing
  // Or, if you want a unique ID per session for testing:
  // return req.headers.get('x-user-id') || 'anonymous-user-id';
}


/**
 * Handles GET requests to fetch all transactions for the authenticated user.
 * Transactions are sorted by date in descending order (most recent first).
 * @returns {NextResponse} A JSON response containing the transactions or an error message.
 */
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const userId = getAuthenticatedUserId(req); // Get the authenticated user's ID

    // Fetch transactions belonging to the specific user, sorted by date
    const transactions: ITransaction[] = await Transaction.find({ userId: userId }).sort({ date: -1 });
    return NextResponse.json(transactions, { status: 200 });
  } catch (err) {
    console.error('GET /api/transactions error:', err);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

/**
 * Handles POST requests to add a new transaction for the authenticated user.
 * Validates required fields before creating the transaction.
 * @param {NextRequest} req The incoming NextRequest object containing transaction data.
 * @returns {NextResponse} A JSON response with the newly created transaction or an error message.
 */
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const userId = getAuthenticatedUserId(req); // Get the authenticated user's ID

    const body = await req.json();
    const { amount, description, date, type, category } = body;

    // Basic server-side validation for required fields
    if (amount === undefined || !description || !date || !type) {
      return NextResponse.json({ error: 'Missing required fields: amount, description, date, and type are mandatory.' }, { status: 400 });
    }

    // Validate amount is a positive number
    if (typeof amount !== 'number' || amount < 0) {
      return NextResponse.json({ error: 'Amount must be a non-negative number.' }, { status: 400 });
    }

    // Validate type is 'income' or 'expense'
    if (type !== 'income' && type !== 'expense') {
      return NextResponse.json({ error: 'Type must be either "income" or "expense".' }, { status: 400 });
    }

    // Create a new transaction document, associating it with the user
    const newTransaction: ITransaction = await Transaction.create({
      userId, // Assign the authenticated user's ID
      amount,
      description,
      date: new Date(date), // Ensure date is a Date object
      type,
      category: category || 'Uncategorized', // Use provided category or default
    });

    return NextResponse.json(newTransaction, { status: 201 }); // 201 Created for successful resource creation
  } catch (err) {
    console.error('POST /api/transactions error:', err);
    // Handle Mongoose validation errors specifically
    if (err.name === 'ValidationError') {
      const errors = Object.keys(err.errors).map(key => err.errors[key].message);
      return NextResponse.json({ error: 'Validation failed', details: errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to add transaction' }, { status: 500 });
  }
}

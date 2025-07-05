// app/api/transactions/[id]/route.ts
<<<<<<< HEAD
import { NextRequest, NextResponse } from 'next/server';
import { Types } from 'mongoose';
import { connectDB } from '@/lib/db';
import Transaction, { ITransaction } from '@/models/transaction';

// Placeholder for getting authenticated user ID
// In a real application, this would come from your authentication system.
function getAuthenticatedUserId(req: NextRequest): string {
  // For demonstration, let's use a fixed ID or generate a random one if no auth.
  return '60d5ec49f8c7d00015f8e1a1'; // Example fixed ID for testing
}


/**
 * Handles PUT requests to update a transaction by ID for the authenticated user.
 * @param request The incoming NextRequest object.
 * @param params An object containing the dynamic route parameters, e.g., { id: string }.
=======

import { NextRequest, NextResponse } from 'next/server';
import { Types } from 'mongoose';
import { connectDB } from '@/lib/db';
import Transaction from '@/models/transaction';

// IMPORTANT: Ensure there is NO 'interface RouteContext { ... }' defined anywhere in this file.

/**
 * Handles PUT requests to update a transaction by ID.
 * @param request The incoming NextRequest object.
 * @param context An object containing the dynamic route parameters within a 'params' property.
 * The type is defined inline to avoid issues with named types.
>>>>>>> e23cf8226538fbf59c7bc4874870e8114520bee7
 * @returns A NextResponse with the updated transaction or an error message.
 */
export async function PUT(
  request: NextRequest,
<<<<<<< HEAD
  params: { id: string }
) {
  const { id } = params;
  const userId = getAuthenticatedUserId(request); // Get authenticated user ID

  // Validate if the ID is a valid MongoDB ObjectId
  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid transaction ID format' }, { status: 400 });
  }

  try {
    await connectDB();
    const body = await request.json();
    const { amount, description, date, type, category } = body;

    // Server-side validation for update payload
    if (amount !== undefined && (typeof amount !== 'number' || amount < 0)) {
      return NextResponse.json({ error: 'Amount must be a non-negative number.' }, { status: 400 });
    }
    if (description !== undefined && typeof description !== 'string') {
      return NextResponse.json({ error: 'Description must be a string.' }, { status: 400 });
    }
    if (date !== undefined && !Date.parse(date)) { // Check if date string is parsable
      return NextResponse.json({ error: 'Invalid date format.' }, { status: 400 });
    }
    if (type !== undefined && type !== 'income' && type !== 'expense') {
      return NextResponse.json({ error: 'Type must be either "income" or "expense".' }, { status: 400 });
    }
    if (category !== undefined && typeof category !== 'string') {
      return NextResponse.json({ error: 'Category must be a string.' }, { status: 400 });
    }

    // Prepare update object, ensuring date is a Date object if provided
    const updatePayload: Partial<ITransaction> = {
      ...(amount !== undefined && { amount }),
      ...(description !== undefined && { description }),
      ...(date !== undefined && { date: new Date(date) }),
      ...(type !== undefined && { type }),
      ...(category !== undefined && { category }),
    };


    // Find and update the transaction by ID and userId.
    // 'new: true' returns the updated document.
    const updatedTransaction: ITransaction | null = await Transaction.findOneAndUpdate(
      { _id: id, userId: userId }, // Find by ID AND userId for authorization
      updatePayload,
      { new: true, runValidators: true } // runValidators ensures schema validators run on update
    );

    // If no transaction was found with the given ID for this user, return a 404 error
    if (!updatedTransaction) {
      return NextResponse.json({ error: 'Transaction not found or unauthorized' }, { status: 404 });
    }

    // Return the updated transaction with a 200 OK status
    return NextResponse.json(updatedTransaction, { status: 200 });

  } catch (err: any) {
    console.error('PUT /api/transactions/[id] error:', err);
    // Handle Mongoose validation errors specifically
    if (err.name === 'ValidationError') {
      const errors = Object.keys(err.errors).map(key => err.errors[key].message);
      return NextResponse.json({ error: 'Validation failed', details: errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 });
  }
}

/**
 * Handles DELETE requests to delete a transaction by ID for the authenticated user.
 * @param _request The incoming NextRequest object (prefixed with _ as it's not used).
 * @param params An object containing the dynamic route parameters, e.g., { id: string }.
 * @returns A NextResponse indicating success (204 No Content) or an error message.
 */
export async function DELETE(
  _request: NextRequest, // _request indicates it's not used in the function body
  params: { id: string }
) {
  const { id } = params;
  const userId = getAuthenticatedUserId(_request); // Get authenticated user ID

  // Validate if the ID is a valid MongoDB ObjectId
  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid transaction ID format' }, { status: 400 });
  }

  try {
    await connectDB();

    // Find and delete the transaction by ID and userId for authorization
    const deletedTransaction: ITransaction | null = await Transaction.findOneAndDelete(
      { _id: id, userId: userId }
    );

    // If no transaction was found with the given ID for this user, return a 404 error
    if (!deletedTransaction) {
      return NextResponse.json({ error: 'Transaction not found or unauthorized' }, { status: 404 });
    }

    // Return a 204 No Content status for successful deletion
    return new NextResponse(null, { status: 204 });

  } catch (err) {
    console.error('DELETE /api/transactions/[id] error:', err);
    return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 });
  }
=======
  // Define the type for the second argument inline here:
  context: { params: { id: string } }
) {
  const { id } = context.params; // Access the id from context.params

  // Validate if the ID is a valid MongoDB ObjectId
  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  // Connect to the database
  await connectDB();

  // Parse the request body as JSON
  const body = await request.json();

  // Find and update the transaction by ID. 'new: true' returns the updated document.
  const updated = await Transaction.findByIdAndUpdate(id, body, { new: true });

  // If no transaction was found with the given ID, return a 404 error
  if (!updated) {
    return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
  }

  // Return the updated transaction with a 200 OK status
  return NextResponse.json(updated, { status: 200 });
}

/**
 * Handles DELETE requests to delete a transaction by ID.
 * @param _request The incoming NextRequest object (prefixed with _ as it's not used).
 * @param context An object containing the dynamic route parameters within a 'params' property.
 * The type is defined inline to avoid issues with named types.
 * @returns A NextResponse indicating success (204 No Content) or an error message.
 */
export async function DELETE(
  _request: NextRequest,
  // Define the type for the second argument inline here:
  context: { params: { id: string } }
) {
  const { id } = context.params; // Access the id from context.params

  // Validate if the ID is a valid MongoDB ObjectId
  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  // Connect to the database
  await connectDB();

  // Find and delete the transaction by ID
  const deleted = await Transaction.findByIdAndDelete(id);

  // If no transaction was found with the given ID, return a 404 error
  if (!deleted) {
    return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
  }

  // Return a 204 No Content status for successful deletion
  return new NextResponse(null, { status: 204 });
>>>>>>> e23cf8226538fbf59c7bc4874870e8114520bee7
}


import { NextRequest, NextResponse } from 'next/server';
import { Types } from 'mongoose';
import { connectDB } from '@/lib/db';
import Transaction from '@/models/transaction';

/**
 * Handles PUT requests to update a transaction by ID.
 * @param request The incoming NextRequest object.
 * @param params An object containing the dynamic route parameters, e.g., { id: string }.
 * @returns A NextResponse with the updated transaction or an error message.
 */
export async function PUT(
  request: NextRequest, // Use NextRequest for better type safety and Next.js specific features
  params: { id: string } // Directly accept the params object
) {
  const { id } = params; // Access the id directly from params

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
 * @param params An object containing the dynamic route parameters, e.g., { id: string }.
 * @returns A NextResponse indicating success (204 No Content) or an error message.
 */
export async function DELETE(
  _request: NextRequest, // Use NextRequest, _request indicates it's not used in the function body
  params: { id: string } // Directly accept the params object
) {
  const { id } = params; // Access the id directly from params

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
}

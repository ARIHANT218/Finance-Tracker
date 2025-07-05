// app/api/transactions/[id]/route.ts

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
 * @returns A NextResponse with the updated transaction or an error message.
 */
export async function PUT(
  request: NextRequest,
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
}

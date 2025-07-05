// models/transaction.ts
import mongoose, { Schema, Document } from 'mongoose';

// Define an interface for the Transaction document to ensure type safety
export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId; // Link to the user who owns this transaction
  amount: number;
  description: string;
  date: Date;
  type: 'income' | 'expense'; // 'income' or 'expense'
  category?: string; // Optional category for the transaction
}

// Define the Mongoose Schema for a Transaction
const TransactionSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      // In a real app, you'd likely reference a 'User' model here:
      // ref: 'User',
      // For this example, we'll treat it as a simple ObjectId for now.
    },
    amount: {
      type: Number,
      required: true,
      min: [0, 'Amount cannot be negative'], // Ensures amount is non-negative
      // Optional: Setter to ensure consistent decimal places for currency
      set: (v: number) => parseFloat(v.toFixed(2)),
    },
    description: {
      type: String,
      required: true,
      trim: true, // Removes leading/trailing whitespace
      maxlength: [200, 'Description cannot be more than 200 characters'],
    },
    date: {
      type: Date,
      required: true,
      default: Date.now, // Default to current date if not provided
    },
    type: {
      type: String,
      enum: ['income', 'expense'], // Restricts values to 'income' or 'expense'
      required: true,
    },
    category: {
      type: String,
      default: 'Uncategorized', // Default category
      trim: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// Create indexes for commonly queried fields to improve performance
TransactionSchema.index({ userId: 1, date: -1 }); // For querying user's transactions by date
TransactionSchema.index({ type: 1 }); // For filtering by transaction type

// Export the Mongoose model.
// This pattern prevents Mongoose from recompiling the model if it's already defined,
// which can happen in development with hot-reloading.
export default mongoose.models.Transaction as mongoose.Model<ITransaction> ||
             mongoose.model<ITransaction>('Transaction', TransactionSchema);

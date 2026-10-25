import React, { useState } from 'react';
import { X, Receipt, DollarSign, AlertCircle } from 'lucide-react';
import { Pet, Expense, ExpenseCategory } from '../../types/index.ts';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  pets: Pet[];
  onSave: (expenseData: Partial<Expense>) => Promise<void>;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ isOpen, onClose, pets, onSave }) => {
  const [selectedPetId, setSelectedPetId] = useState(pets[0]?.id || '');
  const [category, setCategory] = useState<ExpenseCategory>('Food');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories: ExpenseCategory[] = [
    'Food',
    'Medical',
    'Grooming',
    'Medicine',
    'Toys & Accessories',
    'Boarding',
    'Other',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPetId) {
      setError('Please select a pet');
      return;
    }
    if (!amount || Number(amount) <= 0 || !description.trim()) {
      setError('Please enter a valid amount and description');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await onSave({
        petId: selectedPetId,
        category,
        amount: Number(amount),
        date,
        description: description.trim(),
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-emerald-100 overflow-hidden my-6">
        <div className="flex items-center justify-between px-6 py-4 bg-emerald-50 border-b border-emerald-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-600 text-white">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg font-display">Log Pet Care Expense</h3>
              <p className="text-xs text-gray-600">Track food, vet visits, medications, and accessories</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Select Pet *</label>
            <select
              value={selectedPetId}
              onChange={(e) => setSelectedPetId(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              {pets.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.species})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Expense Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Amount (₹) *</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400 text-xs">₹</span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-7 pr-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Date *</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Description / Item Details *</label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Royal Canin 30lb kibble, Nail clipping spa..."
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
            >
              {loading ? 'Logging...' : 'Save Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

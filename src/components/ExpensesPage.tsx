import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  DollarSign,
  Trash2,
  Filter,
  PieChart,
  ShoppingBag,
  Stethoscope,
  Scissors,
  Pill,
  Home,
  Tag,
} from 'lucide-react';
import { Expense, ExpenseCategory, Pet } from '../types/index.ts';
import { formatINR } from '../utils/formatCurrency.ts';

interface ExpensesPageProps {
  expenses: Expense[];
  pets: Pet[];
  onOpenAddExpense: () => void;
  onDeleteExpense: (id: string) => Promise<void>;
}

export const ExpensesPage: React.FC<ExpensesPageProps> = ({
  expenses,
  pets,
  onOpenAddExpense,
  onDeleteExpense,
}) => {
  const [selectedPetId, setSelectedPetId] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filtered = expenses.filter((e) => {
    const matchesPet = selectedPetId === 'all' || e.petId === selectedPetId;
    const matchesCategory = selectedCategory === 'all' || e.category === selectedCategory;
    return matchesPet && matchesCategory;
  });

  const totalSpent = filtered.reduce((acc, curr) => acc + curr.amount, 0);

  // Group by category
  const categoryTotals: Record<string, number> = {};
  filtered.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  const categoryIcons: Record<string, any> = {
    Food: ShoppingBag,
    Medical: Stethoscope,
    Grooming: Scissors,
    Medicine: Pill,
    'Toys & Accessories': Tag,
    Boarding: Home,
    Other: Receipt,
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display flex items-center gap-2.5">
            <Receipt className="w-6 h-6 text-emerald-600" />
            <span>Pet Care Financial & Expense Tracker</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Monitor pet care budget across nutrition, healthcare, grooming, medicines, and accessories.
          </p>
        </div>

        <button
          onClick={onOpenAddExpense}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Log New Expense</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-emerald-100 uppercase tracking-wider block">
            Total Tracked Spending
          </span>
          <div className="text-3xl font-black font-display">{formatINR(totalSpent)}</div>
          <p className="text-[11px] text-emerald-200">{filtered.length} recorded purchases</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
            Top Category
          </span>
          {Object.keys(categoryTotals).length > 0 ? (
            (() => {
              const top = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
              return (
                <div>
                  <div className="text-xl font-bold text-gray-900">{top[0]}</div>
                  <div className="text-xs text-emerald-700 font-semibold">{formatINR(top[1])} total</div>
                </div>
              );
            })()
          ) : (
            <div className="text-sm font-bold text-gray-400">None yet</div>
          )}
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
            Average Per Expense
          </span>
          <div className="text-2xl font-bold text-gray-900">
            {formatINR(filtered.length > 0 ? totalSpent / filtered.length : 0)}
          </div>
          <p className="text-[11px] text-gray-400">Across {pets.length} active pets</p>
        </div>
      </div>

      {/* Category Breakdown Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {[
          'Food',
          'Medical',
          'Grooming',
          'Medicine',
          'Toys & Accessories',
          'Boarding',
          'Other',
        ].map((cat) => {
          const Icon = categoryIcons[cat] || Receipt;
          const sum = categoryTotals[cat] || 0;
          return (
            <div
              key={cat}
              onClick={() => setSelectedCategory(selectedCategory === cat ? 'all' : cat)}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                selectedCategory === cat
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-500'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1 text-gray-500">
                <Icon className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-[11px] font-bold truncate">{cat}</span>
              </div>
              <div className="text-sm font-black text-gray-900">{formatINR(sum)}</div>
            </div>
          );
        })}
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-semibold">Filter:</span>
          <select
            value={selectedPetId}
            onChange={(e) => setSelectedPetId(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 bg-gray-50"
          >
            <option value="all">All Pets</option>
            {pets.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 bg-gray-50"
          >
            <option value="all">All Categories</option>
            {[
              'Food',
              'Medical',
              'Grooming',
              'Medicine',
              'Toys & Accessories',
              'Boarding',
              'Other',
            ].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <span className="text-xs text-gray-500">
          Showing <strong>{filtered.length}</strong> items
        </span>
      </div>

      {/* Expense List Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 uppercase font-bold tracking-wider text-[10px] border-b border-gray-100">
              <tr>
                <th className="p-3.5">Description</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Pet</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5 text-right">Amount</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    No expense records found. Click "+ Log New Expense" to record a purchase.
                  </td>
                </tr>
              ) : (
                filtered.map((exp) => (
                  <tr key={exp.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="p-3.5 font-bold text-gray-900">{exp.description}</td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-100">
                        {exp.category}
                      </span>
                    </td>
                    <td className="p-3.5 font-medium text-gray-700">{exp.petName}</td>
                    <td className="p-3.5 text-gray-500">{exp.date}</td>
                    <td className="p-3.5 text-right font-black text-gray-900 text-sm">
                      {formatINR(exp.amount)}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => onDeleteExpense(exp.id)}
                        className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg transition-colors"
                        title="Delete expense"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

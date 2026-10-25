import React, { useState } from 'react';
import { X, Shield, AlertCircle } from 'lucide-react';
import { Pet, Vaccination } from '../../types/index.ts';

interface AddVaccineModalProps {
  isOpen: boolean;
  onClose: () => void;
  pets: Pet[];
  preselectedPetId?: string;
  onSave: (vacData: Partial<Vaccination>) => Promise<void>;
}

export const AddVaccineModal: React.FC<AddVaccineModalProps> = ({
  isOpen,
  onClose,
  pets,
  preselectedPetId,
  onSave,
}) => {
  const [selectedPetId, setSelectedPetId] = useState(preselectedPetId || pets[0]?.id || '');
  const [vaccineName, setVaccineName] = useState('Rabies (3-Year Core)');
  const [administeredDate, setAdministeredDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [nextDueDate, setNextDueDate] = useState(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().split('T')[0];
  });
  const [veterinarianName, setVeterinarianName] = useState('Dr. Sarah Jenkins');
  const [batchNumber, setBatchNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickVaccines = [
    'Rabies (3-Year Core)',
    'DHPP (Distemper, Parvo, Adenovirus)',
    'Bordetella (Kennel Cough)',
    'FVRCP (Feline Viral Rhinotracheitis)',
    'FeLV (Feline Leukemia)',
    'Lyme Disease Vaccine',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPetId) {
      setError('Please select a pet');
      return;
    }
    if (!vaccineName || !administeredDate || !nextDueDate) {
      setError('Vaccine name, administered date, and next due date are required');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await onSave({
        petId: selectedPetId,
        vaccineName,
        administeredDate,
        nextDueDate,
        veterinarianName: veterinarianName || 'Clinic Veterinarian',
        batchNumber: batchNumber || 'VAC-LOT-' + Math.floor(1000 + Math.random() * 9000),
        notes,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to record vaccination');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-emerald-100 overflow-hidden my-6">
        <div className="flex items-center justify-between px-6 py-4 bg-emerald-50 border-b border-emerald-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-600 text-white">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg font-display">Record Pet Vaccination</h3>
              <p className="text-xs text-gray-600">Digital immunization record & automated booster alerts</p>
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
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

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Vaccine Name *</label>
            <input
              type="text"
              required
              value={vaccineName}
              onChange={(e) => setVaccineName(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {quickVaccines.map((v) => (
                <button
                  type="button"
                  key={v}
                  onClick={() => setVaccineName(v)}
                  className="px-2 py-0.5 text-[11px] rounded-lg bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 text-gray-600 transition-colors"
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Administered Date *</label>
              <input
                type="date"
                required
                value={administeredDate}
                onChange={(e) => setAdministeredDate(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Next Due Date (Booster) *</label>
              <input
                type="date"
                required
                value={nextDueDate}
                onChange={(e) => setNextDueDate(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Administering Veterinarian</label>
              <input
                type="text"
                value={veterinarianName}
                onChange={(e) => setVeterinarianName(e.target.value)}
                placeholder="Dr. Sarah Jenkins"
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Batch / Serial Lot #</label>
              <input
                type="text"
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                placeholder="e.g. DEF-RAB-9921"
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Clinical Notes or Reactions</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Administered right shoulder SQ. No swelling or lethargy observed."
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
              {loading ? 'Recording...' : 'Save Vaccination Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

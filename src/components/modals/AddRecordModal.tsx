import React, { useState } from 'react';
import { X, FileText, Plus, Trash2, AlertCircle } from 'lucide-react';
import { Pet, HealthRecord, PrescriptionItem } from '../../types/index.ts';

interface AddRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  pets: Pet[];
  preselectedPetId?: string;
  onSave: (recordData: Partial<HealthRecord>) => Promise<void>;
}

export const AddRecordModal: React.FC<AddRecordModalProps> = ({
  isOpen,
  onClose,
  pets,
  preselectedPetId,
  onSave,
}) => {
  const [selectedPetId, setSelectedPetId] = useState(preselectedPetId || pets[0]?.id || '');
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  const [notes, setNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [weightKg, setWeightKg] = useState('15.0');
  const [temperatureC, setTemperatureC] = useState('38.5');
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([
    { medicine: '', dosage: '', frequency: '', duration: '' },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddPrescriptionRow = () => {
    setPrescriptions([...prescriptions, { medicine: '', dosage: '', frequency: '', duration: '' }]);
  };

  const handleRemovePrescriptionRow = (index: number) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== index));
  };

  const handlePrescriptionChange = (index: number, field: keyof PrescriptionItem, value: string) => {
    const updated = [...prescriptions];
    updated[index][field] = value;
    setPrescriptions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPetId) {
      setError('Please select a pet');
      return;
    }
    if (!diagnosis.trim() || !treatment.trim()) {
      setError('Diagnosis and treatment plan are required');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const validPrescriptions = prescriptions.filter((p) => p.medicine.trim() !== '');
      await onSave({
        petId: selectedPetId,
        diagnosis: diagnosis.trim(),
        treatment: treatment.trim(),
        prescription: validPrescriptions,
        notes: notes.trim(),
        followUpDate,
        weightKg: Number(weightKg) || undefined,
        temperatureC: Number(temperatureC) || undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save health record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-emerald-100 overflow-hidden my-6">
        <div className="flex items-center justify-between px-6 py-4 bg-emerald-50 border-b border-emerald-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-600 text-white">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg font-display">Add Clinical Consultation Record</h3>
              <p className="text-xs text-gray-600">Authorized veterinary clinical diagnosis, treatment and prescription</p>
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
              <label className="block text-xs font-semibold text-gray-700 mb-1">Current Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Temperature (°C)</label>
              <input
                type="number"
                step="0.1"
                value={temperatureC}
                onChange={(e) => setTemperatureC(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Clinical Diagnosis *</label>
            <input
              type="text"
              required
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="e.g. Acute Otitis Externa, Mild Canine Gastroenteritis"
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Treatment Performed *</label>
            <textarea
              rows={2}
              required
              value={treatment}
              onChange={(e) => setTreatment(e.target.value)}
              placeholder="e.g. Ear canal flush performed under gentle sedation. Cytology showed yeast presence."
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Prescriptions Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-gray-700">Digital Prescription / Medications</label>
              <button
                type="button"
                onClick={handleAddPrescriptionRow}
                className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 font-bold"
              >
                <Plus className="w-3.5 h-3.5" /> Add Medicine
              </button>
            </div>

            <div className="space-y-2">
              {prescriptions.map((p, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                  <input
                    type="text"
                    value={p.medicine}
                    onChange={(e) => handlePrescriptionChange(idx, 'medicine', e.target.value)}
                    placeholder="Medicine name"
                    className="flex-2 px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 bg-white"
                  />
                  <input
                    type="text"
                    value={p.dosage}
                    onChange={(e) => handlePrescriptionChange(idx, 'dosage', e.target.value)}
                    placeholder="Dosage (e.g. 250mg)"
                    className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 bg-white"
                  />
                  <input
                    type="text"
                    value={p.frequency}
                    onChange={(e) => handlePrescriptionChange(idx, 'frequency', e.target.value)}
                    placeholder="Frequency"
                    className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 bg-white"
                  />
                  <input
                    type="text"
                    value={p.duration}
                    onChange={(e) => handlePrescriptionChange(idx, 'duration', e.target.value)}
                    placeholder="Duration"
                    className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 bg-white"
                  />
                  {prescriptions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePrescriptionRow(idx)}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded-md"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Follow-Up Date (Optional)</label>
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Veterinarian Notes</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Patient rested well, advise Elizabethan collar..."
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
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
              {loading ? 'Saving Record...' : 'Save Clinical Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

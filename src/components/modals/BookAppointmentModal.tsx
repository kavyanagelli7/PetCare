import React, { useState } from 'react';
import { X, Calendar, Clock, Stethoscope, AlertTriangle, CheckCircle2, DollarSign } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Pet, Veterinarian } from '../../types/index.ts';
import { formatINR } from '../../utils/formatCurrency.ts';

interface BookAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  pets: Pet[];
  vets: Veterinarian[];
  preselectedVetId?: string;
  preselectedPetId?: string;
  onBook: (data: {
    petId: string;
    vetId: string;
    date: string;
    timeSlot: string;
    reason: string;
    symptoms?: string;
  }) => Promise<void>;
}

export const BookAppointmentModal: React.FC<BookAppointmentModalProps> = ({
  isOpen,
  onClose,
  pets,
  vets,
  preselectedVetId,
  preselectedPetId,
  onBook,
}) => {
  const [selectedPetId, setSelectedPetId] = useState(preselectedPetId || pets[0]?.id || '');
  const [selectedVetId, setSelectedVetId] = useState(preselectedVetId || vets[0]?.id || '');
  const [date, setDate] = useState(() => {
    // Tomorrow as default date
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [selectedSlot, setSelectedSlot] = useState('');
  const [reason, setReason] = useState('Routine Wellness Checkup & Booster');
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const activeVet = vets.find((v) => v.id === selectedVetId) || vets[0];
  const availableSlots = activeVet?.timeSlots || ['09:00 AM', '10:30 AM', '02:00 PM', '03:30 PM'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPetId) {
      setError('Please select or add a pet first.');
      return;
    }
    if (!selectedSlot) {
      setError('Please select an available appointment time slot.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await onBook({
        petId: selectedPetId,
        vetId: activeVet.id,
        date,
        timeSlot: selectedSlot,
        reason,
        symptoms,
      });

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#059669', '#34d399', '#f59e0b'],
      });

      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to book appointment');
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
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg font-display">Book Veterinary Consultation</h3>
              <p className="text-xs text-gray-600">Select your pet, preferred veterinary specialist, and slot</p>
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
          <div className="mx-6 mt-4 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Scheduling Alert</span>
              {error}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Step 1: Pet Selection */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">1. Select Patient Pet *</label>
            {pets.length === 0 ? (
              <div className="p-3 bg-amber-50 rounded-xl text-xs text-amber-800 border border-amber-200">
                You haven't registered any pets yet. Please add a pet before booking an appointment.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {pets.map((pet) => {
                  const isSelected = selectedPetId === pet.id;
                  return (
                    <button
                      type="button"
                      key={pet.id}
                      onClick={() => setSelectedPetId(pet.id)}
                      className={`flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <img
                        src={pet.photoUrl}
                        alt={pet.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-gray-900 truncate">{pet.name}</div>
                        <div className="text-[10px] text-gray-500 truncate">{pet.species} • {pet.breed}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Step 2: Vet Selection */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">2. Select Veterinarian *</label>
            <div className="space-y-2">
              {vets.map((vet) => {
                const isSelected = selectedVetId === vet.id;
                return (
                  <div
                    key={vet.id}
                    onClick={() => {
                      setSelectedVetId(vet.id);
                      setSelectedSlot('');
                    }}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-500'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={vet.avatar}
                        alt={vet.name}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-gray-900">{vet.name}</div>
                        <div className="text-[11px] text-emerald-700 font-medium">{vet.specialization}</div>
                        <div className="text-[10px] text-gray-500">{vet.clinicName} • ⭐ {vet.rating} ({vet.reviewCount} reviews)</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-gray-900 block">{formatINR(vet.consultationFee)}</span>
                      <span className="text-[10px] text-gray-500">Consult fee</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 3: Date & Time Slot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">3. Consultation Date *</label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Available Slots on Selected Date *</label>
              <div className="grid grid-cols-2 gap-1.5">
                {availableSlots.map((slot) => {
                  const isSlotSelected = selectedSlot === slot;
                  return (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all text-center ${
                        isSlotSelected
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Step 4: Reason & Symptoms */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Reason for Visit *</label>
            <input
              type="text"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Annual physical exam, skin irritation, limping..."
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Observed Symptoms or Notes</label>
            <textarea
              rows={2}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Describe symptoms, duration, behavior changes or medication questions..."
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Summary Box */}
          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between text-xs text-gray-600">
            <div>
              <span className="font-semibold text-gray-800">Cancellation Policy:</span> Free cancellation up to 2 hours prior to consultation.
            </div>
            <div className="font-bold text-gray-900 text-sm">
              Total: {formatINR(activeVet?.consultationFee || 750)}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || pets.length === 0}
              className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
            >
              {loading ? 'Confirming Slot...' : 'Confirm Appointment Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

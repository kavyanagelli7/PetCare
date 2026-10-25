import React, { useState } from 'react';
import {
  Stethoscope,
  Calendar,
  Clock,
  UserCheck,
  CheckCircle2,
  XCircle,
  Plus,
  FileText,
  DollarSign,
  Settings,
  Sparkles,
} from 'lucide-react';
import { Appointment, Pet, HealthRecord, Veterinarian, AppointmentStatus } from '../types/index.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { formatINR } from '../utils/formatCurrency.ts';

interface VetDashboardProps {
  vet: Veterinarian | null;
  appointments: Appointment[];
  pets: Pet[];
  onOpenAddRecord: (petId?: string) => void;
  onUpdateStatus: (id: string, status: AppointmentStatus, notes?: string) => Promise<void>;
  onUpdateAvailability: (id: string, data: any) => Promise<void>;
  onSelectTab: (tab: string) => void;
}

export const VetDashboard: React.FC<VetDashboardProps> = ({
  vet,
  appointments,
  pets,
  onOpenAddRecord,
  onUpdateStatus,
  onUpdateAvailability,
  onSelectTab,
}) => {
  const { currentUser } = useAuth();
  const [fee, setFee] = useState(vet?.consultationFee?.toString() || '750');
  const [savingFee, setSavingFee] = useState(false);

  const pendingAppointments = appointments.filter((a) => a.status === 'pending');
  const confirmedAppointments = appointments.filter((a) => a.status === 'confirmed');
  const completedAppointments = appointments.filter((a) => a.status === 'completed');

  const handleSaveAvailability = async () => {
    if (!vet) return;
    setSavingFee(true);
    try {
      await onUpdateAvailability(vet.id, {
        consultationFee: Number(fee),
      });
    } finally {
      setSavingFee(false);
    }
  };

  return (
    <div className="space-y-8 text-left">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-teal-800 to-emerald-900 text-white shadow-md shadow-teal-900/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-teal-200 text-xs font-semibold">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Veterinary Practitioner Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display">
            {vet?.name || currentUser?.name || 'Dr. Sarah Jenkins, DVM'}
          </h1>
          <p className="text-teal-100 text-xs sm:text-sm max-w-xl">
            Specialization: <strong>{vet?.specialization || 'Canine & Feline Medicine'}</strong> • {vet?.clinicName}
          </p>
        </div>

        <button
          onClick={() => onOpenAddRecord()}
          className="px-5 py-3 bg-white text-teal-900 hover:bg-teal-50 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4 text-teal-700" />
          <span>Write Clinical Record</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            Awaiting Confirmation
          </span>
          <div className="text-2xl font-black text-amber-600 font-display">
            {pendingAppointments.length}
          </div>
          <p className="text-[11px] text-gray-400">Action required</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            Confirmed Schedule
          </span>
          <div className="text-2xl font-black text-emerald-600 font-display">
            {confirmedAppointments.length}
          </div>
          <p className="text-[11px] text-gray-400">Scheduled patient visits</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            Completed Consults
          </span>
          <div className="text-2xl font-black text-blue-600 font-display">
            {completedAppointments.length}
          </div>
          <p className="text-[11px] text-gray-400">All-time patients treated</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            Consultation Fee
          </span>
          <div className="text-2xl font-black text-gray-900 font-display">
            {formatINR(vet?.consultationFee || 750)}
          </div>
          <p className="text-[11px] text-gray-400">Per 30-minute exam</p>
        </div>
      </div>

      {/* Patient Appointments Queue */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900 font-display flex items-center gap-2">
            <Calendar className="w-5 h-5 text-teal-600" />
            <span>Consultation Queue & Status Updates</span>
          </h2>
          <span className="text-xs text-gray-500">{appointments.length} total assigned visits</span>
        </div>

        {appointments.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-400">
            No appointments booked in this veterinary schedule.
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="p-4 rounded-xl border border-gray-100 bg-gray-50/60 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 text-sm">{apt.reason}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        apt.status === 'confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : apt.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : apt.status === 'completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {apt.status}
                    </span>
                  </div>

                  <div className="text-gray-600 flex flex-wrap items-center gap-3">
                    <span>
                      🐾 Patient: <strong>{apt.petName}</strong> ({apt.petSpecies})
                    </span>
                    <span>
                      👤 Owner: <strong>{apt.ownerName}</strong> ({apt.ownerPhone || apt.ownerEmail})
                    </span>
                    <span>
                      📅 {apt.date} at <strong>{apt.timeSlot}</strong>
                    </span>
                  </div>

                  {apt.symptoms && (
                    <div className="text-[11px] text-gray-500 italic">
                      Symptoms: {apt.symptoms}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  {apt.status === 'pending' && (
                    <button
                      onClick={() => onUpdateStatus(apt.id, 'confirmed', 'Confirmed by Dr. Sarah.')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs"
                    >
                      Confirm Booking
                    </button>
                  )}

                  {apt.status === 'confirmed' && (
                    <>
                      <button
                        onClick={() => onOpenAddRecord(apt.petId)}
                        className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold text-xs"
                      >
                        + Write Prescription
                      </button>
                      <button
                        onClick={() =>
                          onUpdateStatus(apt.id, 'completed', 'Examination complete. Prescription issued.')
                        }
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs"
                      >
                        Complete Visit
                      </button>
                    </>
                  )}

                  {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                    <button
                      onClick={() => onUpdateStatus(apt.id, 'cancelled', 'Schedule conflict / cancelled.')}
                      className="px-2.5 py-1.5 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg text-xs font-semibold"
                    >
                      Decline
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Vet Practice Settings */}
      <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-xs space-y-3">
        <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
          <Settings className="w-4 h-4 text-gray-500" />
          <span>Practice Fee & Availability Configuration</span>
        </h3>
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div>
            <label className="block text-gray-500 mb-1">Standard Consult Fee (₹)</label>
            <input
              type="number"
              value={fee}
              onChange={(e) => setFee(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg w-28"
            />
          </div>
          <div className="self-end">
            <button
              onClick={handleSaveAvailability}
              disabled={savingFee}
              className="px-4 py-2 bg-teal-700 text-white rounded-lg font-bold hover:bg-teal-800 transition-colors"
            >
              {savingFee ? 'Saving...' : 'Update Clinic Rate'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

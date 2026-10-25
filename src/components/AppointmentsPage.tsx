import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Plus,
  Stethoscope,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Filter,
  DollarSign,
  UserCheck,
} from 'lucide-react';
import { Appointment, AppointmentStatus } from '../types/index.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { formatINR } from '../utils/formatCurrency.ts';

interface AppointmentsPageProps {
  appointments: Appointment[];
  onOpenBookAppointment: () => void;
  onUpdateStatus: (id: string, status: AppointmentStatus, notes?: string) => Promise<void>;
}

export const AppointmentsPage: React.FC<AppointmentsPageProps> = ({
  appointments,
  onOpenBookAppointment,
  onUpdateStatus,
}) => {
  const { role } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filtered = appointments.filter((apt) => {
    if (statusFilter === 'all') return true;
    return apt.status === statusFilter;
  });

  const handleStatusChange = async (id: string, status: AppointmentStatus, notes?: string) => {
    setLoadingId(id);
    try {
      await onUpdateStatus(id, status, notes);
      setCancellingId(null);
      setCancelReason('');
    } finally {
      setLoadingId(null);
    }
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'confirmed':
        return { label: 'Confirmed', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'completed':
        return { label: 'Completed', bg: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'cancelled':
        return { label: 'Cancelled', bg: 'bg-rose-100 text-rose-800 border-rose-200' };
      default:
        return { label: 'Pending Confirmation', bg: 'bg-amber-100 text-amber-800 border-amber-200' };
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display flex items-center gap-2.5">
            <Calendar className="w-6 h-6 text-emerald-600" />
            <span>Veterinary Consultations & Scheduling</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Book appointments with vetted specialists, view consult fees, and manage status in real time.
          </p>
        </div>

        <button
          onClick={onOpenBookAppointment}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Book Appointment</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {['all', 'confirmed', 'pending', 'completed', 'cancelled'].map((tab) => {
          const count =
            tab === 'all' ? appointments.length : appointments.filter((a) => a.status === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                statusFilter === tab
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span>{tab === 'all' ? 'All Bookings' : tab}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  statusFilter === tab ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Appointments List */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white border border-dashed border-gray-200 space-y-3">
          <Calendar className="w-10 h-10 text-gray-300 mx-auto" />
          <h3 className="font-bold text-gray-700 text-sm">No appointments in this category</h3>
          <p className="text-xs text-gray-500">Need to check up on your pet? Book a consultation slot above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((apt) => {
            const badge = getStatusBadge(apt.status);
            const isCancelling = cancellingId === apt.id;

            return (
              <div
                key={apt.id}
                className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs hover:border-emerald-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left Info */}
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-100 flex flex-col items-center justify-center font-bold text-xs shrink-0">
                    <span className="text-sm font-black">{apt.date.split('-')[2]}</span>
                    <span className="text-[9px] uppercase font-semibold">
                      {new Date(apt.date).toLocaleString('default', { month: 'short' })}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-sm text-gray-900">{apt.reason}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${badge.bg}`}>
                        {badge.label}
                      </span>
                    </div>

                    <div className="text-xs text-gray-600 flex flex-wrap items-center gap-x-4 gap-y-1">
                      <span>
                        🐾 Patient: <strong className="text-gray-900">{apt.petName}</strong> ({apt.petSpecies})
                      </span>
                      <span>
                        🩺 Doctor: <strong className="text-gray-900">{apt.vetName}</strong>
                      </span>
                      <span>
                        🕒 Time: <strong className="text-gray-900">{apt.timeSlot}</strong>
                      </span>
                    </div>

                    {apt.symptoms && (
                      <div className="text-[11px] text-gray-500">
                        <span className="font-medium">Reported Symptoms:</span> {apt.symptoms}
                      </div>
                    )}

                    {apt.notes && (
                      <div className="text-[11px] text-emerald-800 bg-emerald-50/60 px-2 py-1 rounded-md inline-block">
                        Clinic note: {apt.notes}
                      </div>
                    )}

                    {apt.cancellationReason && (
                      <div className="text-[11px] text-rose-700 bg-rose-50 px-2 py-1 rounded-md inline-block">
                        Cancellation reason: {apt.cancellationReason}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-3 self-end md:self-auto shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right">
                    <span className="text-sm font-bold text-gray-900 block">{formatINR(apt.fee)}</span>
                    <span className="text-[10px] text-gray-400">Consult fee</span>
                  </div>

                  {/* Actions for Vet or Admin */}
                  {(role === 'vet' || role === 'admin') && apt.status === 'pending' && (
                    <button
                      onClick={() => handleStatusChange(apt.id, 'confirmed', 'Confirmed by veterinary team.')}
                      disabled={loadingId === apt.id}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                    >
                      Confirm Slot
                    </button>
                  )}

                  {(role === 'vet' || role === 'admin') && apt.status === 'confirmed' && (
                    <button
                      onClick={() => handleStatusChange(apt.id, 'completed', 'Consultation finished successfully.')}
                      disabled={loadingId === apt.id}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                    >
                      Mark Completed
                    </button>
                  )}

                  {/* Cancel Button */}
                  {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                    <div>
                      {isCancelling ? (
                        <div className="flex items-center gap-1.5 animate-fade-in">
                          <input
                            type="text"
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            placeholder="Reason for cancellation"
                            className="px-2 py-1 text-xs border border-gray-300 rounded-lg focus:outline-none"
                          />
                          <button
                            onClick={() =>
                              handleStatusChange(
                                apt.id,
                                'cancelled',
                                cancelReason || 'Cancelled by user request.'
                              )
                            }
                            className="px-2.5 py-1 bg-rose-600 text-white rounded-lg text-xs font-bold"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setCancellingId(null)}
                            className="text-xs text-gray-500 hover:text-gray-700 underline"
                          >
                            Back
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setCancellingId(apt.id)}
                          className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold border border-rose-200 transition-colors"
                        >
                          Cancel Slot
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

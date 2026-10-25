import React from 'react';
import {
  PawPrint,
  Calendar,
  Shield,
  Plus,
  AlertTriangle,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Receipt,
  CheckCircle2,
  Stethoscope,
} from 'lucide-react';
import { Pet, Appointment, Vaccination, Reminder, Expense, HealthRecord } from '../types/index.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { formatINR } from '../utils/formatCurrency.ts';

interface OwnerDashboardProps {
  pets: Pet[];
  appointments: Appointment[];
  vaccinations: Vaccination[];
  reminders: Reminder[];
  expenses: Expense[];
  healthRecords: HealthRecord[];
  onOpenAddPet: () => void;
  onOpenBookAppointment: () => void;
  onOpenAddExpense: () => void;
  onSelectTab: (tab: string) => void;
  onSelectPet: (pet: Pet) => void;
  onToggleReminder: (id: string) => void;
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
  pets,
  appointments,
  vaccinations,
  reminders,
  expenses,
  healthRecords,
  onOpenAddPet,
  onOpenBookAppointment,
  onOpenAddExpense,
  onSelectTab,
  onSelectPet,
  onToggleReminder,
}) => {
  const { currentUser } = useAuth();

  const upcomingAppointments = appointments
    .filter((a) => a.status === 'confirmed' || a.status === 'pending')
    .slice(0, 3);

  const dueVaccinations = vaccinations
    .filter((v) => v.status === 'due_soon' || v.status === 'overdue')
    .slice(0, 3);

  const pendingReminders = reminders.filter((r) => !r.isCompleted).slice(0, 4);

  const totalSpentThisMonth = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-8 text-left">
      {/* Welcome & Quick Action Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-700 via-emerald-800 to-teal-900 text-white shadow-md shadow-emerald-900/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-emerald-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Pet Parent Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display">
            Welcome back, {currentUser?.name || 'Pet Parent'}! 🐾
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm max-w-xl">
            You are managing <strong>{pets.length} companion{pets.length === 1 ? '' : 's'}</strong>. Milo's DHPP booster is due in 18 days, and all vital health passports are synced.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenBookAppointment}
            className="px-4 py-2.5 bg-white text-emerald-900 hover:bg-emerald-50 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Calendar className="w-4 h-4 text-emerald-700" />
            <span>Book Vet Visit</span>
          </button>
          <button
            onClick={onOpenAddPet}
            className="px-4 py-2.5 bg-emerald-600/80 hover:bg-emerald-600 text-white border border-white/20 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Pet</span>
          </button>
        </div>
      </div>

      {/* Pet Summary Cards Strip */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 font-display flex items-center gap-2">
            <PawPrint className="w-5 h-5 text-emerald-600" />
            <span>My Registered Pets ({pets.length})</span>
          </h2>
          <button
            onClick={() => onSelectTab('pets')}
            className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
          >
            <span>View All Profiles</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {pets.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white border border-dashed border-gray-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <PawPrint className="w-6 h-6" />
            </div>
            <p className="text-xs text-gray-500">No pets registered yet. Click below to create your pet's digital health record.</p>
            <button
              onClick={onOpenAddPet}
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
            >
              Register Pet Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pets.map((pet) => (
              <div
                key={pet.id}
                onClick={() => onSelectPet(pet)}
                className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="flex items-start gap-3 mb-3">
                  <img
                    src={pet.photoUrl}
                    alt={pet.name}
                    className="w-14 h-14 rounded-xl object-cover border border-emerald-100 group-hover:scale-105 transition-transform"
                  />
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-gray-900 truncate group-hover:text-emerald-700 transition-colors">
                      {pet.name}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                      {pet.species} • {pet.breed}
                    </p>
                    <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-semibold">
                      {pet.ageYears}y {pet.ageMonths}m • {pet.weightKg}kg
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-50 flex items-center justify-between text-[11px] text-gray-500">
                  <span>
                    {pet.allergies.length > 0 ? (
                      <span className="text-amber-700 font-medium">⚠️ {pet.allergies.length} allergies</span>
                    ) : (
                      <span className="text-emerald-700 font-medium">✓ No known allergies</span>
                    )}
                  </span>
                  <span className="text-emerald-700 font-bold group-hover:translate-x-0.5 transition-transform">
                    Passport →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mid Section: Appointments & Vaccination Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upcoming Appointments (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-bold text-gray-900 font-display flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>Upcoming Veterinary Consultations</span>
            </h2>
            <button
              onClick={() => onSelectTab('appointments')}
              className="text-xs font-bold text-emerald-700 hover:underline"
            >
              Manage ({appointments.length})
            </button>
          </div>

          {upcomingAppointments.length === 0 ? (
            <div className="p-6 text-center text-xs text-gray-500 bg-gray-50 rounded-xl space-y-2">
              <Calendar className="w-8 h-8 text-gray-300 mx-auto" />
              <p>No upcoming visits scheduled.</p>
              <button
                onClick={onOpenBookAppointment}
                className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-bold text-xs"
              >
                Schedule Checkup
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/60 hover:bg-emerald-50/30 transition-colors flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex flex-col items-center justify-center font-bold text-xs shrink-0">
                      <span>{apt.date.split('-')[2]}</span>
                      <span className="text-[9px] uppercase font-semibold">
                        {new Date(apt.date).toLocaleString('default', { month: 'short' })}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-gray-900">{apt.reason}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            apt.status === 'confirmed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {apt.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5">
                        Patient: <strong>{apt.petName}</strong> • Specialist: {apt.vetName} • 🕒 {apt.timeSlot}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-gray-900 block">{formatINR(apt.fee)}</span>
                    <button
                      onClick={() => onSelectTab('appointments')}
                      className="text-[10px] text-emerald-700 hover:underline font-semibold"
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Vaccine & Booster Reminders (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-bold text-gray-900 font-display flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Vaccination Booster Alerts</span>
            </h2>
            <button
              onClick={() => onSelectTab('health')}
              className="text-xs font-bold text-emerald-700 hover:underline"
            >
              Passport
            </button>
          </div>

          <div className="space-y-2.5">
            {dueVaccinations.length === 0 ? (
              <div className="p-4 bg-emerald-50 rounded-xl text-xs text-emerald-800 border border-emerald-100 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>All core vaccines for your registered pets are currently up to date!</span>
              </div>
            ) : (
              dueVaccinations.map((vac) => (
                <div
                  key={vac.id}
                  className="p-3 rounded-xl border border-amber-200 bg-amber-50/50 flex items-start justify-between gap-2 text-xs"
                >
                  <div>
                    <span className="font-bold text-gray-900 block">{vac.vaccineName}</span>
                    <span className="text-gray-600 text-[11px]">
                      Pet: <strong>{vac.petName}</strong> • Next Due: <strong>{vac.nextDueDate}</strong>
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-bold shrink-0">
                    Due Soon
                  </span>
                </div>
              ))
            )}

            {/* Quick reminder tasks */}
            <div className="pt-2 border-t border-gray-100 space-y-1.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Pending Care Tasks
              </span>
              {pendingReminders.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-100 text-xs text-gray-700"
                >
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleReminder(r.id)}
                      className="w-4 h-4 rounded-full border border-gray-300 hover:border-emerald-600 flex items-center justify-center transition-colors"
                    />
                    <span>{r.title}</span>
                  </div>
                  <span className="text-[10px] text-gray-400">{r.dueDate}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recent Health Records & Expense Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Clinical Records (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-bold text-gray-900 font-display flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-emerald-600" />
              <span>Recent Veterinary Clinical Records</span>
            </h2>
            <button
              onClick={() => onSelectTab('health')}
              className="text-xs font-bold text-emerald-700 hover:underline"
            >
              Full History
            </button>
          </div>

          <div className="space-y-3">
            {healthRecords.slice(0, 2).map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-gray-900 text-sm">{rec.diagnosis}</div>
                  <span className="text-gray-400 text-[11px]">{rec.date}</span>
                </div>
                <div className="text-gray-600 leading-relaxed">
                  <span className="font-semibold text-gray-700">Treatment:</span> {rec.treatment}
                </div>
                {rec.prescription.length > 0 && (
                  <div className="p-2.5 rounded-lg bg-white border border-gray-200 space-y-1">
                    <span className="font-bold text-emerald-800 text-[11px] block">Prescribed Medication:</span>
                    {rec.prescription.map((p, i) => (
                      <div key={i} className="text-[11px] text-gray-600">
                        • {p.medicine} ({p.dosage}) – {p.frequency} for {p.duration}
                      </div>
                    ))}
                  </div>
                )}
                <div className="text-[11px] text-gray-400">
                  Doctor: {rec.vetName} • Patient: {rec.petName} ({rec.weightKg} kg)
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expense Overview Widget (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-bold text-gray-900 font-display flex items-center gap-2">
              <Receipt className="w-4 h-4 text-emerald-600" />
              <span>Pet Expense Summary</span>
            </h2>
            <button
              onClick={onOpenAddExpense}
              className="text-xs font-bold text-emerald-700 hover:underline"
            >
              + Log Expense
            </button>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-500 font-semibold block">TOTAL EXPENDITURE</span>
              <span className="text-2xl font-black text-gray-900 font-display">
                {formatINR(totalSpentThisMonth)}
              </span>
            </div>
            <button
              onClick={() => onSelectTab('expenses')}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors"
            >
              View Analytics
            </button>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              Recent Transactions
            </span>
            {expenses.slice(0, 3).map((exp) => (
              <div
                key={exp.id}
                className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 border border-gray-100 text-xs"
              >
                <div>
                  <div className="font-semibold text-gray-900">{exp.description}</div>
                  <div className="text-[11px] text-gray-500">
                    {exp.category} • {exp.petName} • {exp.date}
                  </div>
                </div>
                <span className="font-bold text-gray-900 text-sm">{formatINR(exp.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

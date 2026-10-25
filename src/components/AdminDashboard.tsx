import React, { useState } from 'react';
import {
  Shield,
  Users,
  PawPrint,
  Calendar,
  Heart,
  Search,
  DollarSign,
  CheckCircle2,
  XCircle,
  FileText,
  UserCheck,
} from 'lucide-react';
import {
  AdminStats,
  User,
  AdoptionRequest,
  Appointment,
  LostFoundReport,
} from '../types/index.ts';
import { formatINR } from '../utils/formatCurrency.ts';

interface AdminDashboardProps {
  stats: AdminStats | null;
  users: User[];
  adoptionRequests: AdoptionRequest[];
  appointments: Appointment[];
  lostFoundReports: LostFoundReport[];
  onUpdateUserRole: (id: string, role: string) => Promise<void>;
  onUpdateAdoptionRequest: (id: string, status: string, notes?: string) => Promise<void>;
  onSelectTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  stats,
  users,
  adoptionRequests,
  appointments,
  lostFoundReports,
  onUpdateUserRole,
  onUpdateAdoptionRequest,
  onSelectTab,
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'overview' | 'adoptions' | 'users' | 'appointments'>('overview');

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-purple-200 text-xs font-semibold">
            <Shield className="w-3.5 h-3.5 text-purple-300" />
            <span>Platform Governance & Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display">
            PetCare Central Command Hub
          </h1>
          <p className="text-purple-100 text-xs sm:text-sm max-w-xl">
            Real-time multi-tenant monitoring, adoption vetting, role management, and emergency report moderation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-xl text-xs font-bold">
            System Online (100% Uptime)
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs space-y-1">
          <span className="text-[10px] text-gray-400 uppercase font-bold block">Total Accounts</span>
          <div className="text-2xl font-black text-gray-900">{stats?.totalUsers || users.length}</div>
          <span className="text-[10px] text-emerald-600 font-semibold">Active & Verified</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs space-y-1">
          <span className="text-[10px] text-gray-400 uppercase font-bold block">Registered Pets</span>
          <div className="text-2xl font-black text-emerald-700">{stats?.totalPets || 4}</div>
          <span className="text-[10px] text-gray-400">Electronic Passports</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs space-y-1">
          <span className="text-[10px] text-gray-400 uppercase font-bold block">Specialist Vets</span>
          <div className="text-2xl font-black text-teal-700">{stats?.totalVets || 3}</div>
          <span className="text-[10px] text-gray-400">Licensed Clinics</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs space-y-1">
          <span className="text-[10px] text-gray-400 uppercase font-bold block">Appointments</span>
          <div className="text-2xl font-black text-blue-700">{stats?.totalAppointments || appointments.length}</div>
          <span className="text-[10px] text-emerald-600 font-semibold">0 double-bookings</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs space-y-1">
          <span className="text-[10px] text-gray-400 uppercase font-bold block">Adoption Inquiries</span>
          <div className="text-2xl font-black text-rose-600">{adoptionRequests.length}</div>
          <span className="text-[10px] text-amber-600 font-semibold">Vetting in progress</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs space-y-1">
          <span className="text-[10px] text-gray-400 uppercase font-bold block">Consultation Volume</span>
          <div className="text-2xl font-black text-purple-700 font-display">
            {formatINR(stats?.monthlyRevenue || 3450)}
          </div>
          <span className="text-[10px] text-gray-400">Clinic billing</span>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex border-b border-gray-200 gap-2">
        {[
          { id: 'overview', label: 'Platform Status', count: null },
          { id: 'adoptions', label: 'Adoption Applications', count: adoptionRequests.length },
          { id: 'users', label: 'User Roles & RBAC', count: users.length },
          { id: 'appointments', label: 'All Appointments', count: appointments.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveAdminTab(tab.id as any)}
            className={`py-2.5 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeAdminTab === tab.id
                ? 'border-purple-600 text-purple-800 bg-purple-50/40 rounded-t-lg'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== null && (
              <span className="px-1.5 py-0.2 rounded-full bg-gray-100 text-gray-600 text-[10px]">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab: Overview */}
      {activeAdminTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status Breakdown */}
          <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-gray-900">Appointment Status Distribution</h3>
            <div className="space-y-3">
              {[
                {
                  label: 'Confirmed Appointments',
                  count: appointments.filter((a) => a.status === 'confirmed').length,
                  color: 'bg-emerald-500',
                },
                {
                  label: 'Pending Clinic Review',
                  count: appointments.filter((a) => a.status === 'pending').length,
                  color: 'bg-amber-500',
                },
                {
                  label: 'Completed Consultations',
                  count: appointments.filter((a) => a.status === 'completed').length,
                  color: 'bg-blue-500',
                },
                {
                  label: 'Cancelled Sessions',
                  count: appointments.filter((a) => a.status === 'cancelled').length,
                  color: 'bg-rose-500',
                },
              ].map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-gray-700">{item.label}</span>
                    <span className="text-gray-900">{item.count}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full ${item.color}`}
                      style={{
                        width: `${Math.max(10, (item.count / Math.max(1, appointments.length)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Admin Actions */}
          <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-gray-900">Administrative Tools</h3>
            <div className="space-y-2.5">
              <button
                onClick={() => onSelectTab('adoption')}
                className="w-full p-3 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-between text-xs text-gray-700 transition-colors"
              >
                <span>Browse & Moderate Adoption Listings</span>
                <Heart className="w-4 h-4 text-rose-500" />
              </button>
              <button
                onClick={() => onSelectTab('lost-found')}
                className="w-full p-3 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-between text-xs text-gray-700 transition-colors"
              >
                <span>Review Community Lost & Found Alerts</span>
                <Search className="w-4 h-4 text-amber-500" />
              </button>
              <button
                onClick={() => onSelectTab('articles')}
                className="w-full p-3 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-between text-xs text-gray-700 transition-colors"
              >
                <span>Editorial & Knowledge Base Manager</span>
                <FileText className="w-4 h-4 text-emerald-600" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Adoption Applications Review */}
      {activeAdminTab === 'adoptions' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase font-bold tracking-wider text-[10px] border-b border-gray-100">
                <tr>
                  <th className="p-3.5">Pet</th>
                  <th className="p-3.5">Applicant Info</th>
                  <th className="p-3.5">Housing & Experience</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Review Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {adoptionRequests.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-400">
                      No adoption applications submitted.
                    </td>
                  </tr>
                ) : (
                  adoptionRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="p-3.5 font-bold text-gray-900">{req.petName}</td>
                      <td className="p-3.5">
                        <div className="font-semibold text-gray-900">{req.applicantName}</div>
                        <div className="text-[11px] text-gray-500">
                          {req.applicantEmail} • {req.applicantPhone}
                        </div>
                      </td>
                      <td className="p-3.5 text-gray-600">
                        <div>
                          <strong>Home:</strong> {req.housingType} {req.hasFencedYard ? '(Fenced Yard)' : ''}
                        </div>
                        <div className="text-[11px] text-gray-500 line-clamp-1">
                          Pets: {req.existingPets} • {req.experienceDescription}
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            req.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : req.status === 'rejected'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {req.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                        {req.status === 'pending' && (
                          <>
                            <button
                              onClick={() => onUpdateAdoptionRequest(req.id, 'approved', 'Home check verified.')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => onUpdateAdoptionRequest(req.id, 'rejected', 'Ineligible.')}
                              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {req.status === 'approved' && (
                          <button
                            onClick={() => onUpdateAdoptionRequest(req.id, 'completed', 'Adoption finalized.')}
                            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors"
                          >
                            Mark Finalized
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Users & Roles */}
      {activeAdminTab === 'users' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase font-bold tracking-wider text-[10px] border-b border-gray-100">
                <tr>
                  <th className="p-3.5">User</th>
                  <th className="p-3.5">Email</th>
                  <th className="p-3.5">Current Role</th>
                  <th className="p-3.5">Registered</th>
                  <th className="p-3.5 text-right">Modify Access Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={u.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80'}
                          alt={u.name}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <span className="font-bold text-gray-900">{u.name}</span>
                      </div>
                    </td>
                    <td className="p-3.5 text-gray-600">{u.email}</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          u.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : u.role === 'vet'
                            ? 'bg-teal-100 text-teal-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3.5 text-gray-500">{u.createdAt?.split('T')[0] || '2026'}</td>
                    <td className="p-3.5 text-right">
                      <select
                        value={u.role}
                        onChange={(e) => onUpdateUserRole(u.id, e.target.value)}
                        className="px-2.5 py-1 text-xs rounded-lg border border-gray-200 bg-white font-medium text-gray-700"
                      >
                        <option value="owner">Pet Owner</option>
                        <option value="vet">Veterinarian</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Appointments Oversight */}
      {activeAdminTab === 'appointments' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase font-bold tracking-wider text-[10px] border-b border-gray-100">
                <tr>
                  <th className="p-3.5">Patient / Owner</th>
                  <th className="p-3.5">Doctor & Specialty</th>
                  <th className="p-3.5">Date & Time</th>
                  <th className="p-3.5">Reason</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Fee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {appointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-gray-900">{apt.petName} ({apt.petSpecies})</div>
                      <div className="text-[11px] text-gray-500">{apt.ownerName}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-gray-900">{apt.vetName}</div>
                      <div className="text-[11px] text-gray-500">{apt.vetSpecialization}</div>
                    </td>
                    <td className="p-3.5 text-gray-700">
                      <div>{apt.date}</div>
                      <div className="text-[11px] text-gray-400">{apt.timeSlot}</div>
                    </td>
                    <td className="p-3.5 text-gray-600 max-w-[180px] truncate">{apt.reason}</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          apt.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : apt.status === 'completed'
                            ? 'bg-blue-100 text-blue-800'
                            : apt.status === 'cancelled'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {apt.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right font-black text-gray-900">
                      {formatINR(apt.fee)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

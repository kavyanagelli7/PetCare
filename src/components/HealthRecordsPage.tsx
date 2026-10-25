import React, { useState } from 'react';
import {
  FileText,
  Shield,
  Plus,
  Pill,
  Activity,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Thermometer,
  Clock,
  UserCheck,
} from 'lucide-react';
import { HealthRecord, Vaccination, Pet } from '../types/index.ts';
import { useAuth } from '../context/AuthContext.tsx';

interface HealthRecordsPageProps {
  pets: Pet[];
  healthRecords: HealthRecord[];
  vaccinations: Vaccination[];
  onOpenAddRecord: () => void;
  onOpenAddVaccine: () => void;
}

export const HealthRecordsPage: React.FC<HealthRecordsPageProps> = ({
  pets,
  healthRecords,
  vaccinations,
  onOpenAddRecord,
  onOpenAddVaccine,
}) => {
  const { role } = useAuth();
  const [selectedPetId, setSelectedPetId] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'consultations' | 'vaccinations'>('consultations');

  const filteredRecords =
    selectedPetId === 'all'
      ? healthRecords
      : healthRecords.filter((r) => r.petId === selectedPetId);

  const filteredVaccines =
    selectedPetId === 'all'
      ? vaccinations
      : vaccinations.filter((v) => v.petId === selectedPetId);

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-emerald-600" />
            <span>Pet Electronic Health Records & Vaccinations</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Certified medical history, diagnoses, prescriptions, and digital immunization tracking.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={onOpenAddVaccine}
            className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200 transition-colors flex items-center gap-1.5"
          >
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>+ Log Vaccine</span>
          </button>
          <button
            onClick={onOpenAddRecord}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Clinical Record</span>
          </button>
        </div>
      </div>

      {/* Pet Filter and Tab Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Sub-Tabs: Consultations vs Vaccinations */}
        <div className="flex rounded-xl bg-gray-100 p-1">
          <button
            onClick={() => setActiveTab('consultations')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'consultations'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
            <span>Consultation History ({filteredRecords.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('vaccinations')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'vaccinations'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>Immunization Passport ({filteredVaccines.length})</span>
          </button>
        </div>

        {/* Pet Filter Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-medium">Filter by Pet:</span>
          <select
            value={selectedPetId}
            onChange={(e) => setSelectedPetId(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-gray-200 bg-white font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Pets ({pets.length})</option>
            {pets.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.species})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tab 1: Clinical Consultations */}
      {activeTab === 'consultations' && (
        <div className="space-y-4">
          {filteredRecords.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white border border-dashed border-gray-200 space-y-2">
              <FileText className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="text-xs text-gray-500">No clinical consultation records found.</p>
            </div>
          ) : (
            filteredRecords.map((rec) => (
              <div
                key={rec.id}
                className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs hover:border-emerald-200 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                      🩺
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-gray-900">{rec.diagnosis}</h3>
                      <div className="text-xs text-gray-500 flex items-center gap-2">
                        <span>
                          Patient: <strong className="text-emerald-700">{rec.petName}</strong>
                        </span>
                        <span>• Attending: {rec.vetName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-500 self-start sm:self-auto">
                    {rec.weightKg && (
                      <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md font-medium text-gray-700">
                        Weight: {rec.weightKg} kg
                      </span>
                    )}
                    {rec.temperatureC && (
                      <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md font-medium text-gray-700">
                        <Thermometer className="w-3.5 h-3.5 text-rose-500" />
                        {rec.temperatureC} °C
                      </span>
                    )}
                    <span className="text-gray-400 font-semibold">{rec.date}</span>
                  </div>
                </div>

                {/* Treatment summary */}
                <div className="space-y-1 text-xs">
                  <span className="font-bold text-gray-900 block">Clinical Examination & Treatment Performed:</span>
                  <p className="text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">
                    {rec.treatment}
                  </p>
                </div>

                {/* Prescriptions */}
                {rec.prescription && rec.prescription.length > 0 && (
                  <div className="space-y-2">
                    <span className="font-bold text-gray-900 text-xs flex items-center gap-1.5">
                      <Pill className="w-3.5 h-3.5 text-emerald-600" />
                      Prescribed Medications:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {rec.prescription.map((rx, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl border border-emerald-100 bg-emerald-50/40 space-y-0.5"
                        >
                          <div className="font-bold text-emerald-950 text-xs">{rx.medicine}</div>
                          <div className="text-[11px] text-gray-600">
                            <strong>Dosage:</strong> {rx.dosage} • <strong>Frequency:</strong> {rx.frequency}
                          </div>
                          <div className="text-[11px] text-gray-500">
                            <strong>Duration:</strong> {rx.duration}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes and Follow up */}
                <div className="flex flex-wrap items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-50">
                  <span>{rec.notes ? `Doctor Notes: ${rec.notes}` : ''}</span>
                  {rec.followUpDate && (
                    <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Follow-up recommended on {rec.followUpDate}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Vaccinations */}
      {activeTab === 'vaccinations' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase font-bold tracking-wider text-[10px] border-b border-gray-100">
                <tr>
                  <th className="p-3.5">Patient Pet</th>
                  <th className="p-3.5">Vaccine Protocol</th>
                  <th className="p-3.5">Administered Date</th>
                  <th className="p-3.5">Next Booster Due</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Veterinarian / Lot #</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filteredVaccines.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-400">
                      No vaccinations recorded.
                    </td>
                  </tr>
                ) : (
                  filteredVaccines.map((vac) => {
                    const isUpToDate = vac.status === 'up_to_date';
                    const isDueSoon = vac.status === 'due_soon';

                    return (
                      <tr key={vac.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="p-3.5 font-bold text-gray-900">{vac.petName}</td>
                        <td className="p-3.5">
                          <span className="font-semibold text-gray-900 block">{vac.vaccineName}</span>
                          {vac.notes && <span className="text-[11px] text-gray-400">{vac.notes}</span>}
                        </td>
                        <td className="p-3.5 text-gray-600">{vac.administeredDate}</td>
                        <td className="p-3.5 font-bold text-gray-900">{vac.nextDueDate}</td>
                        <td className="p-3.5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                              isUpToDate
                                ? 'bg-emerald-100 text-emerald-800'
                                : isDueSoon
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {vac.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-3.5 text-gray-500 text-[11px]">
                          <div>{vac.veterinarianName}</div>
                          <span className="text-[10px] text-gray-400 font-mono">Lot: {vac.batchNumber}</span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

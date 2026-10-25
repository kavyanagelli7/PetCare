import React, { useState } from 'react';
import {
  Search,
  Plus,
  AlertTriangle,
  MapPin,
  Calendar,
  CheckCircle2,
  Phone,
  Mail,
} from 'lucide-react';
import { LostFoundReport } from '../types/index.ts';

interface LostFoundPageProps {
  reports: LostFoundReport[];
  onOpenReportModal: () => void;
  onResolveReport: (id: string) => Promise<void>;
}

export const LostFoundPage: React.FC<LostFoundPageProps> = ({
  reports,
  onOpenReportModal,
  onResolveReport,
}) => {
  const [typeFilter, setTypeFilter] = useState<'all' | 'lost' | 'found'>('all');
  const [searchCity, setSearchCity] = useState('');

  const filtered = reports.filter((r) => {
    const matchesType = typeFilter === 'all' || r.type === typeFilter;
    const matchesCity =
      !searchCity ||
      r.city.toLowerCase().includes(searchCity.toLowerCase()) ||
      r.location.toLowerCase().includes(searchCity.toLowerCase()) ||
      r.petName?.toLowerCase().includes(searchCity.toLowerCase());
    return matchesType && matchesCity;
  });

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display flex items-center gap-2.5">
            <Search className="w-6 h-6 text-amber-500" />
            <span>Lost & Found Community Pet Finder</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time neighborhood network for reporting missing pets or reuniting found animals with their families.
          </p>
        </div>

        <button
          onClick={onOpenReportModal}
          className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-600/20 flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>File Lost / Found Report</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex rounded-xl bg-gray-100 p-1 w-full sm:w-auto">
          <button
            onClick={() => setTypeFilter('all')}
            className={`flex-1 sm:flex-initial px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
              typeFilter === 'all' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600'
            }`}
          >
            All Reports ({reports.length})
          </button>
          <button
            onClick={() => setTypeFilter('lost')}
            className={`flex-1 sm:flex-initial px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
              typeFilter === 'lost' ? 'bg-rose-500 text-white shadow-xs' : 'text-gray-600'
            }`}
          >
            🚨 Lost Pets
          </button>
          <button
            onClick={() => setTypeFilter('found')}
            className={`flex-1 sm:flex-initial px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
              typeFilter === 'found' ? 'bg-emerald-600 text-white shadow-xs' : 'text-gray-600'
            }`}
          >
            🐾 Found Pets
          </button>
        </div>

        <input
          type="text"
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
          placeholder="Search by city, landmark, or pet..."
          className="w-full sm:w-64 px-3 py-1.5 text-xs rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      {/* Reports Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white border border-dashed border-gray-200 space-y-2">
          <Search className="w-10 h-10 text-gray-300 mx-auto" />
          <p className="text-xs text-gray-500">No active reports match your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((rep) => {
            const isLost = rep.type === 'lost';

            return (
              <div
                key={rep.id}
                className={`bg-white rounded-3xl border shadow-xs overflow-hidden flex flex-col justify-between transition-all ${
                  rep.isResolved
                    ? 'border-emerald-200 bg-emerald-50/20 opacity-80'
                    : isLost
                    ? 'border-rose-100 hover:border-rose-200'
                    : 'border-emerald-100 hover:border-emerald-200'
                }`}
              >
                <div>
                  <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                    <img
                      src={rep.photoUrl}
                      alt={rep.petName || 'Pet'}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-md ${
                          rep.isResolved
                            ? 'bg-emerald-700 text-white'
                            : isLost
                            ? 'bg-rose-600 text-white'
                            : 'bg-emerald-600 text-white'
                        }`}
                      >
                        {rep.isResolved ? '✓ Reunited & Resolved' : isLost ? '🚨 Missing / Lost' : '🐾 Found Pet'}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="text-base font-bold text-gray-900 font-display">
                        {rep.petName}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {rep.species} • {rep.breed} • Color: {rep.primaryColor}
                      </p>
                    </div>

                    <div className="text-xs text-gray-600 space-y-1 bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-1.5 text-gray-700 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>{rep.location}, {rep.city}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-500 text-[11px]">
                        <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span>Date {isLost ? 'Lost' : 'Found'}: {rep.lastSeenDate}</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                      {rep.description}
                    </p>

                    {/* Contact details */}
                    <div className="pt-2 border-t border-gray-100 text-[11px] text-gray-600 space-y-0.5">
                      <div className="font-semibold text-gray-800">Contact: {rep.contactName}</div>
                      {rep.contactPhone && (
                        <div className="flex items-center gap-1 text-emerald-700">
                          <Phone className="w-3 h-3" /> {rep.contactPhone}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {!rep.isResolved && (
                  <div className="px-5 pb-5 pt-1">
                    <button
                      onClick={() => onResolveReport(rep.id)}
                      className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition-colors"
                    >
                      Mark as Reunited / Resolved
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

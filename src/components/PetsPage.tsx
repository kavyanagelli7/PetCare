import React, { useState } from 'react';
import {
  PawPrint,
  Plus,
  Shield,
  Calendar,
  AlertTriangle,
  Trash2,
  Edit2,
  FileText,
  Activity,
  Heart,
  X,
  Stethoscope,
} from 'lucide-react';
import { Pet, Vaccination, HealthRecord } from '../types/index.ts';

interface PetsPageProps {
  pets: Pet[];
  vaccinations: Vaccination[];
  healthRecords: HealthRecord[];
  onOpenAddPet: () => void;
  onDeletePet: (id: string) => Promise<void>;
  onBookForPet: (petId: string) => void;
}

export const PetsPage: React.FC<PetsPageProps> = ({
  pets,
  vaccinations,
  healthRecords,
  onOpenAddPet,
  onDeletePet,
  onBookForPet,
}) => {
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [search, setSearch] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('all');

  const filteredPets = pets.filter((pet) => {
    const matchesSearch =
      pet.name.toLowerCase().includes(search.toLowerCase()) ||
      pet.breed.toLowerCase().includes(search.toLowerCase());
    const matchesSpecies = speciesFilter === 'all' || pet.species.toLowerCase() === speciesFilter.toLowerCase();
    return matchesSearch && matchesSpecies;
  });

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display flex items-center gap-2.5">
            <PawPrint className="w-6 h-6 text-emerald-600" />
            <span>Pet Management & Digital Passports</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Maintain electronic health records, vaccination schedules, microchips and medical notes for each companion.
          </p>
        </div>

        <button
          onClick={onOpenAddPet}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Pet</span>
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by pet name or breed..."
            className="w-full px-3.5 py-2 pl-9 text-xs rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <PawPrint className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['all', 'Dog', 'Cat', 'Rabbit', 'Bird', 'Other'].map((spec) => (
            <button
              key={spec}
              onClick={() => setSpeciesFilter(spec)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                speciesFilter.toLowerCase() === spec.toLowerCase()
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {spec === 'all' ? 'All Pets' : spec}
            </button>
          ))}
        </div>
      </div>

      {/* Pet Cards Grid */}
      {filteredPets.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white border border-dashed border-gray-200 space-y-3">
          <PawPrint className="w-10 h-10 text-gray-300 mx-auto" />
          <h3 className="font-bold text-gray-700 text-sm">No pets found matching criteria</h3>
          <p className="text-xs text-gray-500">Try adjusting your filters or register a new pet companion.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPets.map((pet) => {
            const petVaccines = vaccinations.filter((v) => v.petId === pet.id);
            const petRecords = healthRecords.filter((r) => r.petId === pet.id);
            const hasOverdueVaccine = petVaccines.some((v) => v.status === 'overdue');
            const hasDueSoonVaccine = petVaccines.some((v) => v.status === 'due_soon');

            return (
              <div
                key={pet.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
                    <img
                      src={pet.photoUrl}
                      alt={pet.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-3 right-3 flex gap-1.5">
                      {hasOverdueVaccine ? (
                        <span className="px-2.5 py-1 rounded-full bg-rose-500 text-white text-[10px] font-bold shadow-md">
                          Booster Overdue
                        </span>
                      ) : hasDueSoonVaccine ? (
                        <span className="px-2.5 py-1 rounded-full bg-amber-500 text-white text-[10px] font-bold shadow-md">
                          Vaccine Due Soon
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold shadow-md">
                          Vaccines Current
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-2 left-3 px-2 py-0.5 rounded-md bg-black/60 text-white text-[11px] font-medium backdrop-blur-xs">
                      {pet.species} • {pet.breed}
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 font-display">{pet.name}</h3>
                        <p className="text-xs text-gray-500">
                          {pet.gender} • {pet.ageYears} yrs {pet.ageMonths} mos
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-gray-900 block">{pet.weightKg} kg</span>
                        <span className="text-[10px] text-gray-400">Recorded Weight</span>
                      </div>
                    </div>

                    {/* Allergies / Medical tags */}
                    <div className="text-xs space-y-1">
                      {pet.allergies.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {pet.allergies.map((alg, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[10px] font-semibold border border-rose-100"
                            >
                              ⚠️ {alg}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[11px] text-emerald-700 font-medium">✓ No known drug/food allergies</span>
                      )}
                    </div>

                    {pet.microchipId && (
                      <div className="text-[11px] text-gray-500 bg-gray-50 p-2 rounded-lg border border-gray-100">
                        <span className="font-semibold text-gray-700">Microchip:</span> {pet.microchipId}
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-4 pb-4 pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedPet(pet)}
                    className="flex-1 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition-colors text-center"
                  >
                    View Digital Passport
                  </button>
                  <button
                    onClick={() => onBookForPet(pet.id)}
                    className="p-2 text-emerald-700 hover:bg-emerald-50 rounded-xl border border-emerald-200 transition-colors"
                    title="Book Veterinary Consultation"
                  >
                    <Calendar className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete ${pet.name}'s profile?`)) {
                        onDeletePet(pet.id);
                      }
                    }}
                    className="p-2 text-gray-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                    title="Remove Pet"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Individual Pet Detail / Digital Passport Modal */}
      {selectedPet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden my-6 flex flex-col max-h-[85vh]">
            <div className="relative h-48 bg-gradient-to-r from-emerald-700 to-teal-800 p-6 text-white flex items-end justify-between">
              <button
                onClick={() => setSelectedPet(null)}
                className="absolute top-4 right-4 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-4">
                <img
                  src={selectedPet.photoUrl}
                  alt={selectedPet.name}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-lg"
                />
                <div>
                  <h2 className="text-2xl font-extrabold font-display">{selectedPet.name}</h2>
                  <p className="text-xs text-emerald-100">
                    {selectedPet.species} • {selectedPet.breed} • {selectedPet.gender}
                  </p>
                  <div className="mt-1 text-[11px] text-emerald-200">
                    Age: {selectedPet.ageYears}y {selectedPet.ageMonths}m | Weight: {selectedPet.weightKg} kg
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs text-gray-700">
              {/* Pet Quick Vitals */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-[10px] text-gray-400 font-bold block uppercase">Microchip</span>
                  <span className="font-bold text-gray-800">{selectedPet.microchipId || 'None registered'}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-[10px] text-gray-400 font-bold block uppercase">Date of Birth</span>
                  <span className="font-bold text-gray-800">{selectedPet.dateOfBirth || 'Estimated'}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-[10px] text-gray-400 font-bold block uppercase">Weight</span>
                  <span className="font-bold text-emerald-700">{selectedPet.weightKg} kg</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-[10px] text-gray-400 font-bold block uppercase">Allergies</span>
                  <span className="font-bold text-rose-700">{selectedPet.allergies.length} recorded</span>
                </div>
              </div>

              {/* Medical notes */}
              {selectedPet.medicalNotes && (
                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 leading-relaxed">
                  <strong className="block text-[11px] mb-0.5">Clinical / Behavioral Notes:</strong>
                  {selectedPet.medicalNotes}
                </div>
              )}

              {/* Vaccinations for this pet */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900 text-sm">Vaccination Passport Logs</span>
                  <span className="text-[11px] text-emerald-700 font-medium">Digital Immunization Verified</span>
                </div>

                {vaccinations.filter((v) => v.petId === selectedPet.id).length === 0 ? (
                  <p className="text-gray-400 text-xs italic">No vaccination records logged yet.</p>
                ) : (
                  <div className="space-y-2">
                    {vaccinations
                      .filter((v) => v.petId === selectedPet.id)
                      .map((vac) => (
                        <div
                          key={vac.id}
                          className="p-3 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-between"
                        >
                          <div>
                            <span className="font-bold text-gray-900 block">{vac.vaccineName}</span>
                            <span className="text-[11px] text-gray-500">
                              Administered: {vac.administeredDate} • Doctor: {vac.veterinarianName} • Batch: {vac.batchNumber}
                            </span>
                          </div>
                          <div className="text-right">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                vac.status === 'up_to_date'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : vac.status === 'due_soon'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {vac.status.replace('_', ' ')}
                            </span>
                            <span className="text-[10px] text-gray-400 block mt-0.5">Next Due: {vac.nextDueDate}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Medical Records for this pet */}
              <div className="space-y-2">
                <span className="font-bold text-gray-900 text-sm block">Consultation History</span>
                {healthRecords.filter((r) => r.petId === selectedPet.id).length === 0 ? (
                  <p className="text-gray-400 text-xs italic">No clinical records found for {selectedPet.name}.</p>
                ) : (
                  <div className="space-y-2">
                    {healthRecords
                      .filter((r) => r.petId === selectedPet.id)
                      .map((rec) => (
                        <div
                          key={rec.id}
                          className="p-3 rounded-xl border border-gray-100 bg-gray-50 space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-gray-900">{rec.diagnosis}</span>
                            <span className="text-[10px] text-gray-400">{rec.date}</span>
                          </div>
                          <p className="text-gray-600">{rec.treatment}</p>
                          <div className="text-[11px] text-gray-400">Doctor: {rec.vetName}</div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={() => {
                  onBookForPet(selectedPet.id);
                  setSelectedPet(null);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Book Vet Visit for {selectedPet.name}
              </button>
              <button
                onClick={() => setSelectedPet(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

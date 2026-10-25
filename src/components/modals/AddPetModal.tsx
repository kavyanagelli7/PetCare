import React, { useState } from 'react';
import { X, PawPrint, Upload, AlertCircle } from 'lucide-react';
import { Pet, PetSpecies, PetGender } from '../../types/index.ts';

interface AddPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (petData: Partial<Pet>) => Promise<void>;
}

export const AddPetModal: React.FC<AddPetModalProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<PetSpecies>('Dog');
  const [breed, setBreed] = useState('');
  const [ageYears, setAgeYears] = useState('2');
  const [ageMonths, setAgeMonths] = useState('0');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState<PetGender>('Male');
  const [weightKg, setWeightKg] = useState('12.5');
  const [photoUrl, setPhotoUrl] = useState('');
  const [allergies, setAllergies] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');
  const [microchipId, setMicrochipId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide your pet\'s name');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      await onSave({
        name: name.trim(),
        species,
        breed: breed.trim() || 'Mixed Breed',
        ageYears: Number(ageYears) || 0,
        ageMonths: Number(ageMonths) || 0,
        dateOfBirth,
        gender,
        weightKg: Number(weightKg) || 5.0,
        photoUrl: photoUrl.trim(),
        allergies: allergies
          ? allergies.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        medicalNotes: medicalNotes.trim(),
        microchipId: microchipId.trim(),
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to register pet');
    } finally {
      setLoading(false);
    }
  };

  const samplePhotoUrl = (type: string) => {
    const urls: Record<string, string> = {
      Dog: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
      Cat: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
      Rabbit: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=600&q=80',
      Bird: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=600&q=80',
      Other: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&w=600&q=80',
    };
    setPhotoUrl(urls[type] || urls.Dog);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-emerald-100 overflow-hidden my-8">
        <div className="flex items-center justify-between px-6 py-4 bg-emerald-50 border-b border-emerald-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-600 text-white">
              <PawPrint className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg font-display">Register New Pet</h3>
              <p className="text-xs text-gray-600">Create a digital passport and electronic health record</p>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Pet Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Milo, Bella, Oliver"
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Species *</label>
              <select
                value={species}
                onChange={(e) => {
                  const s = e.target.value as PetSpecies;
                  setSpecies(s);
                  samplePhotoUrl(s);
                }}
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="Dog">Dog 🐕</option>
                <option value="Cat">Cat 🐈</option>
                <option value="Rabbit">Rabbit 🐇</option>
                <option value="Bird">Bird 🦜</option>
                <option value="Other">Other Pet 🐾</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Breed</label>
              <input
                type="text"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                placeholder="e.g. Golden Retriever, British Shorthair"
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as PetGender)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="Male">Male ♂</option>
                <option value="Female">Female ♀</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Age (Years)</label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={ageYears}
                  onChange={(e) => setAgeYears(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Months</label>
                <input
                  type="number"
                  min="0"
                  max="11"
                  value={ageMonths}
                  onChange={(e) => setAgeMonths(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                min="0.01"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                placeholder="e.g. 15.4"
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Photo URL</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={() => samplePhotoUrl(species)}
                className="px-3 py-2 text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors whitespace-nowrap"
              >
                Auto-fill Photo
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Known Allergies (comma separated)</label>
            <input
              type="text"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="e.g. Chicken protein, Penicillin, Dust mites"
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Microchip Number (Optional)</label>
              <input
                type="text"
                value={microchipId}
                onChange={(e) => setMicrochipId(e.target.value)}
                placeholder="e.g. 985141002341991"
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Date of Birth</label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Medical & Dietary Notes</label>
            <textarea
              rows={2}
              value={medicalNotes}
              onChange={(e) => setMedicalNotes(e.target.value)}
              placeholder="e.g. Sensitive stomach, dislikes loud thunder, spayed/neutered..."
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
              {loading ? 'Registering...' : 'Register Pet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

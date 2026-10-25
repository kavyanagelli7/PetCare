import React, { useState } from 'react';
import { X, Search, AlertCircle, MapPin } from 'lucide-react';
import { LostFoundReport, PetSpecies, ReportType } from '../../types/index.ts';

interface ReportLostFoundModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reportData: Partial<LostFoundReport>) => Promise<void>;
}

export const ReportLostFoundModal: React.FC<ReportLostFoundModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [type, setType] = useState<ReportType>('lost');
  const [petName, setPetName] = useState('');
  const [species, setSpecies] = useState<PetSpecies>('Dog');
  const [breed, setBreed] = useState('');
  const [primaryColor, setPrimaryColor] = useState('');
  const [lastSeenDate, setLastSeenDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim() || !city.trim() || !description.trim()) {
      setError('Location, city, and description are required');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await onSave({
        type,
        petName: petName.trim() || (type === 'found' ? 'Unknown (Found Pet)' : 'Beloved Pet'),
        species,
        breed: breed.trim() || 'Unknown Breed',
        primaryColor: primaryColor.trim() || 'Mixed',
        lastSeenDate,
        location: location.trim(),
        city: city.trim(),
        description: description.trim(),
        photoUrl:
          photoUrl.trim() ||
          'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
        contactName: contactName.trim() || 'Community Member',
        contactPhone: contactPhone.trim(),
        contactEmail: contactEmail.trim(),
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-amber-100 overflow-hidden my-6">
        <div className="flex items-center justify-between px-6 py-4 bg-amber-50/70 border-b border-amber-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500 text-white">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg font-display">Report Lost or Found Pet</h3>
              <p className="text-xs text-gray-600">Help reunite missing pets with their families</p>
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
          {/* Report Type Switcher */}
          <div className="flex rounded-xl bg-gray-100 p-1">
            <button
              type="button"
              onClick={() => setType('lost')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                type === 'lost'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🚨 I Lost My Pet
            </button>
            <button
              type="button"
              onClick={() => setType('found')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                type === 'found'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🐾 I Found a Pet
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {type === 'lost' ? 'Pet Name *' : 'Name (if collar tag present)'}
              </label>
              <input
                type="text"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                placeholder={type === 'lost' ? 'e.g. Copper' : 'Unknown or Tag Name'}
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Species *</label>
              <select
                value={species}
                onChange={(e) => setSpecies(e.target.value as PetSpecies)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
                <option value="Rabbit">Rabbit</option>
                <option value="Bird">Bird</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Breed / Appearance</label>
              <input
                type="text"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                placeholder="e.g. Beagle mix, Tabby cat"
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Primary Fur Color(s)</label>
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                placeholder="e.g. Tri-color, Ginger, Black & White"
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Date {type === 'lost' ? 'Lost' : 'Found'} *</label>
              <input
                type="date"
                required
                value={lastSeenDate}
                onChange={(e) => setLastSeenDate(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">City / Region *</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Westwood, Central City"
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Specific Location / Landmark *</label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Near 81st Street Gate, Central Park trail or Plaza parking lot"
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Detailed Description & Distinctive Features *</label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Wearing red collar, chipped right ear, very friendly, nervous around traffic..."
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Photo URL (Optional)</label>
            <input
              type="url"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-gray-100">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Contact Name</label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Your Name"
                className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="contact@example.com"
                className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
              className="px-5 py-2.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-md shadow-amber-600/20 transition-all disabled:opacity-50"
            >
              {loading ? 'Publishing Report...' : 'Publish Community Alert'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

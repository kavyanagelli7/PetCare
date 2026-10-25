import React, { useState } from 'react';
import { X, Heart, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AdoptionListing } from '../../types/index.ts';

interface AdoptionRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: AdoptionListing | null;
  onSubmit: (listingId: string, requestData: any) => Promise<void>;
}

export const AdoptionRequestModal: React.FC<AdoptionRequestModalProps> = ({
  isOpen,
  onClose,
  listing,
  onSubmit,
}) => {
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [housingType, setHousingType] = useState('Single Family Home');
  const [hasFencedYard, setHasFencedYard] = useState(true);
  const [existingPets, setExistingPets] = useState('1 dog, friendly and vaccinated');
  const [experienceDescription, setExperienceDescription] = useState(
    'Lifelong pet parents. Active home with someone working from home full-time.'
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !listing) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await onSubmit(listing.id, {
        applicantName,
        applicantEmail,
        applicantPhone,
        housingType,
        hasFencedYard,
        existingPets,
        experienceDescription,
      });

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#ec4899', '#f43f5e', '#10b981'],
      });

      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit adoption inquiry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-rose-100 overflow-hidden my-6">
        <div className="flex items-center justify-between px-6 py-4 bg-rose-50 border-b border-rose-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500 text-white shadow-xs">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg font-display">
                Apply to Adopt {listing.petName}
              </h3>
              <p className="text-xs text-gray-600">
                {listing.species} • {listing.breed} • {listing.age}
              </p>
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
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
            <img
              src={listing.photoUrl}
              alt={listing.petName}
              className="w-14 h-14 rounded-xl object-cover"
            />
            <div className="text-xs text-gray-600 space-y-0.5">
              <div className="font-bold text-gray-900 text-sm">{listing.petName}</div>
              <div>Location: {listing.location}</div>
              <div className="text-emerald-700 font-medium">✓ Microchipped & Vaccinated</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Your Full Name *</label>
              <input
                type="text"
                required
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                placeholder="e.g. Alex Rivera"
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                value={applicantPhone}
                onChange={(e) => setApplicantPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address *</label>
            <input
              type="email"
              required
              value={applicantEmail}
              onChange={(e) => setApplicantEmail(e.target.value)}
              placeholder="alex@example.com"
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Housing Type</label>
              <select
                value={housingType}
                onChange={(e) => setHousingType(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="Single Family Home">Single Family Home</option>
                <option value="Townhouse">Townhouse</option>
                <option value="Apartment / Condo">Apartment / Condo</option>
                <option value="Farm / Rural Property">Farm / Rural Property</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="fence"
                checked={hasFencedYard}
                onChange={(e) => setHasFencedYard(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor="fence" className="text-xs text-gray-700 font-medium cursor-pointer">
                Has securely fenced yard
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Existing Pets in Household</label>
            <input
              type="text"
              value={existingPets}
              onChange={(e) => setExistingPets(e.target.value)}
              placeholder="e.g. 1 senior cat, or None"
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Pet Care Experience & Daily Routine
            </label>
            <textarea
              rows={3}
              value={experienceDescription}
              onChange={(e) => setExperienceDescription(e.target.value)}
              placeholder="Share a bit about your experience, who will care for the pet during the day..."
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
              className="px-5 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md shadow-rose-600/20 transition-all disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Adoption Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Heart,
  Plus,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  Filter,
  Sparkles,
} from 'lucide-react';
import { AdoptionListing, PetSpecies } from '../types/index.ts';

interface AdoptionPageProps {
  listings: AdoptionListing[];
  onOpenApply: (listing: AdoptionListing) => void;
  onOpenCreateListing: () => void;
}

export const AdoptionPage: React.FC<AdoptionPageProps> = ({
  listings,
  onOpenApply,
  onOpenCreateListing,
}) => {
  const [speciesFilter, setSpeciesFilter] = useState('all');

  const filtered = listings.filter((l) => {
    if (speciesFilter === 'all') return true;
    return l.species.toLowerCase() === speciesFilter.toLowerCase();
  });

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display flex items-center gap-2.5">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
            <span>Pet Adoption & Rescue Sanctuary</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Browse verified rescue companions. Fully vaccinated, microchipped, and ready for their forever home.
          </p>
        </div>

        <button
          onClick={onOpenCreateListing}
          className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20 flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Post Rescue Listing</span>
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {['all', 'Dog', 'Cat', 'Rabbit'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSpeciesFilter(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
              speciesFilter.toLowerCase() === cat.toLowerCase()
                ? 'bg-rose-500 text-white shadow-xs'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {cat === 'all' ? 'All Rescues' : `${cat}s`}
          </button>
        ))}
      </div>

      {/* Listings Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white border border-dashed border-gray-200 space-y-2">
          <Heart className="w-10 h-10 text-gray-300 mx-auto" />
          <p className="text-xs text-gray-500">No adoption listings match this filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((adp) => (
            <div
              key={adp.id}
              className="bg-white rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative h-52 w-full bg-gray-100 overflow-hidden">
                  <img
                    src={adp.photoUrl}
                    alt={adp.petName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold shadow-md uppercase ${
                        adp.status === 'available'
                          ? 'bg-emerald-600 text-white'
                          : adp.status === 'pending'
                          ? 'bg-amber-500 text-white'
                          : 'bg-gray-500 text-white'
                      }`}
                    >
                      {adp.status}
                    </span>
                  </div>
                  <div className="absolute bottom-2 left-3 px-2 py-0.5 rounded-md bg-black/60 text-white text-[11px] font-medium backdrop-blur-xs flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    <span>{adp.location}</span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 font-display">{adp.petName}</h3>
                      <p className="text-xs text-gray-500">
                        {adp.breed} • {adp.gender}
                      </p>
                    </div>
                    <span className="text-xs font-bold px-2 py-1 bg-rose-50 text-rose-700 rounded-lg">
                      {adp.age}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                    {adp.description}
                  </p>

                  <div className="flex flex-wrap gap-2 text-[10px] font-semibold text-emerald-800 pt-1">
                    {adp.isVaccinated && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-100 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Fully Vaccinated
                      </span>
                    )}
                    {adp.isNeutered && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-100 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Spayed / Neutered
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="px-5 pb-5 pt-2 border-t border-gray-50">
                <button
                  onClick={() => onOpenApply(adp)}
                  disabled={adp.status !== 'available'}
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Heart className="w-3.5 h-3.5 fill-white" />
                  <span>{adp.status === 'available' ? 'Apply to Adopt' : 'Application in Review'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

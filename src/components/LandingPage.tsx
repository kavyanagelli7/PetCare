import React from 'react';
import {
  PawPrint,
  Calendar,
  Shield,
  Stethoscope,
  Sparkles,
  Heart,
  Search,
  Receipt,
  CheckCircle2,
  ArrowRight,
  Clock,
  Award,
  ChevronRight,
} from 'lucide-react';
import { Veterinarian, CareArticle, AdoptionListing } from '../types/index.ts';
import { formatINR } from '../utils/formatCurrency.ts';

interface LandingPageProps {
  onGetStarted: () => void;
  onExploreServices: () => void;
  vets: Veterinarian[];
  articles: CareArticle[];
  adoptions: AdoptionListing[];
  onOpenProjectGuide: () => void;
  onSelectTab: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onExploreServices,
  vets,
  articles,
  adoptions,
  onOpenProjectGuide,
  onSelectTab,
}) => {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 sm:pb-24 lg:pt-16 bg-gradient-to-b from-emerald-50/70 via-[#f8faf8] to-white border-b border-emerald-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-900 text-xs font-bold">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <span>Next-Generation Pet Healthcare & Appointment Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 font-display tracking-tight leading-[1.15]">
                Smart veterinary care & health records for <span className="text-emerald-700 underline decoration-emerald-300 decoration-wavy decoration-2">happier pets.</span>
              </h1>

              <p className="text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed">
                PetCare unites pet parents, certified veterinarians, and rescue shelters. Book verified appointments without double-booking, track digital vaccination passports, log expenses, and consult an AI assistant powered by Gemini.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={onGetStarted}
                  className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition-all hover:gap-3"
                >
                  <span>Go to Pet Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={onExploreServices}
                  className="px-6 py-3.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 font-bold text-sm rounded-xl shadow-xs transition-colors"
                >
                  Explore Services & Doctors
                </button>
                <button
                  onClick={onOpenProjectGuide}
                  className="px-4 py-3.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>Academic Demo Guide</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-gray-100 grid grid-cols-3 gap-4 text-left">
                <div>
                  <div className="text-2xl font-black text-gray-900 font-display">100%</div>
                  <div className="text-xs text-gray-500">Conflict-Free Slots</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-emerald-700 font-display">24/7</div>
                  <div className="text-xs text-gray-500">Gemini AI Guidance</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-gray-900 font-display">3-Tier</div>
                  <div className="text-xs text-gray-500">Role-Based Security</div>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Cards */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md">
                {/* Main Hero Pet Image */}
                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                  <img
                    src="https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80"
                    alt="Veterinarian examining cute dog"
                    className="w-full h-80 object-cover"
                  />
                  <div className="p-5 bg-white space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                          🐾
                        </div>
                        <div>
                          <div className="font-bold text-sm text-gray-900">Milo's Health Passport</div>
                          <div className="text-xs text-gray-500">Golden Retriever • 3 Years Old</div>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                        Up to date
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                      <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                        <span className="text-[10px] text-gray-400 block font-bold">NEXT VACCINE</span>
                        <span className="font-semibold text-gray-800">DHPP Booster in 18d</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                        <span className="text-[10px] text-gray-400 block font-bold">ASSIGNED VET</span>
                        <span className="font-semibold text-gray-800">Dr. Sarah Jenkins</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating AI Notification Card */}
                <div className="absolute -top-4 -left-4 sm:-left-8 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-emerald-100 max-w-[240px] text-left animate-bounce-slow">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-bold text-gray-900">PetCare AI Assistant</span>
                  </div>
                  <p className="text-[11px] text-gray-600 leading-snug">
                    "Detected pollen season alert for Milo. Cytopoint allergy booster recommended."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid: 6 Pillars of PetCare */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            Comprehensive Pet Care OS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 font-display">
            Everything your pet needs, unified in one platform.
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            From verified vet clinic schedules to AI triage and adoption matchmaking, PetCare simplifies every aspect of animal parenting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Calendar,
              color: 'text-emerald-600 bg-emerald-50',
              title: 'Smart Appointment Booking',
              desc: 'Select certified veterinarians by specialty, view consult fees, pick available slots, and prevent double-booking.',
              tab: 'appointments',
            },
            {
              icon: Shield,
              color: 'text-teal-600 bg-teal-50',
              title: 'Digital Health Records & Passport',
              desc: 'Access clinical treatments, diagnostic reports, weight logs, and vaccination passports with automated booster reminders.',
              tab: 'health',
            },
            {
              icon: Sparkles,
              color: 'text-amber-600 bg-amber-50',
              title: 'Gemini AI Pet Care Assistant',
              desc: 'Ask about nutrition, grooming, symptoms, and behavior with species and age context, guarded by emergency toxic alerts.',
              tab: 'ai',
            },
            {
              icon: Receipt,
              color: 'text-blue-600 bg-blue-50',
              title: 'Pet Care Expense Tracker',
              desc: 'Log food, medical visits, grooming, and medicine spending with monthly visual category breakdowns.',
              tab: 'expenses',
            },
            {
              icon: Heart,
              color: 'text-rose-600 bg-rose-50',
              title: 'Pet Adoption & Rescue',
              desc: 'Browse rescue animals, view microchip/vaccination status, and submit adoption applications with administrator oversight.',
              tab: 'adoption',
            },
            {
              icon: Search,
              color: 'text-purple-600 bg-purple-50',
              title: 'Community Lost & Found Finder',
              desc: 'Publish missing pet alerts with photo, location, and safe contact methods to swiftly reunite lost pets with families.',
              tab: 'lost-found',
            },
          ].map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                onClick={() => onSelectTab(f.tab)}
                className="p-6 rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-md hover:border-emerald-200 transition-all text-left cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-emerald-700 transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    {f.desc}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 mt-4">
                  <span>Open {f.title}</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Veterinarians */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">
              Certified Specialists
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-display">
              Meet our board-certified veterinarians
            </h2>
          </div>
          <button
            onClick={() => onSelectTab('appointments')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>View All Schedules & Book</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {vets.map((vet) => (
            <div
              key={vet.id}
              className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-md transition-all text-left space-y-4"
            >
              <div className="flex items-center gap-3.5">
                <img
                  src={vet.avatar}
                  alt={vet.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-emerald-100"
                />
                <div>
                  <div className="font-bold text-sm text-gray-900">{vet.name}</div>
                  <div className="text-xs text-emerald-700 font-semibold">{vet.specialization}</div>
                  <div className="text-[11px] text-gray-500">⭐ {vet.rating} ({vet.reviewCount} reviews)</div>
                </div>
              </div>

              <p className="text-xs text-gray-600 line-clamp-2">
                {vet.bio}
              </p>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-gray-400 block text-[10px]">CONSULTATION FEE</span>
                  <span className="font-bold text-gray-900 text-sm">{formatINR(vet.consultationFee)}</span>
                </div>
                <button
                  onClick={() => onSelectTab('appointments')}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-xs transition-colors"
                >
                  Book Slot
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Adoption Showcase Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-900 to-emerald-950 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div>
              <span className="px-3 py-1 rounded-full bg-white/20 text-emerald-200 text-xs font-bold inline-block mb-2">
                Rescue & Adoption Network
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display">
                Give a rescued animal a loving forever home
              </h2>
              <p className="text-emerald-100 text-xs sm:text-sm max-w-xl mt-1">
                Every listed pet is fully vaccinated, microchipped, and examined by certified veterinarians.
              </p>
            </div>
            <button
              onClick={() => onSelectTab('adoption')}
              className="px-5 py-2.5 bg-white text-emerald-900 hover:bg-emerald-50 rounded-xl font-bold text-xs shadow-lg transition-colors whitespace-nowrap"
            >
              Browse All Adoption Pets
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {adoptions.slice(0, 3).map((adp) => (
              <div
                key={adp.id}
                onClick={() => onSelectTab('adoption')}
                className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/10 transition-all text-left cursor-pointer group"
              >
                <img
                  src={adp.photoUrl}
                  alt={adp.petName}
                  className="w-full h-40 rounded-xl object-cover mb-3 group-hover:scale-102 transition-transform"
                />
                <div className="flex items-center justify-between mb-1">
                  <div className="font-bold text-base text-white">{adp.petName}</div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 font-bold">
                    {adp.age}
                  </span>
                </div>
                <p className="text-xs text-emerald-200 truncate">{adp.breed} • {adp.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Knowledge Base Articles Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">
              Pet Care Education
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-display">
              Latest Veterinary Guides & Wellness Articles
            </h2>
          </div>
          <button
            onClick={() => onSelectTab('articles')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>Read All Articles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.map((art) => (
            <div
              key={art.id}
              onClick={() => onSelectTab('articles')}
              className="rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-md transition-all overflow-hidden cursor-pointer group text-left flex flex-col justify-between"
            >
              <div>
                <img
                  src={art.imageUrl}
                  alt={art.title}
                  className="w-full h-36 object-cover group-hover:scale-105 transition-transform"
                />
                <div className="p-4 space-y-2">
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-50 text-emerald-700">
                    {art.category}
                  </span>
                  <h3 className="font-bold text-sm text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-2">
                    {art.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {art.excerpt}
                  </p>
                </div>
              </div>
              <div className="px-4 pb-4 pt-1 flex items-center justify-between text-[11px] text-gray-400 border-t border-gray-50">
                <span>By {art.authorName}</span>
                <span>{art.readTime}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 border-t border-gray-200 text-left text-xs text-gray-500 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <PawPrint className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base text-gray-900 font-display">PetCare</span>
            </div>
            <p className="text-xs text-gray-500">
              Smart Pet Appointment & Electronic Health Care Management System. Full-Stack academic project.
            </p>
          </div>

          <div>
            <div className="font-bold text-gray-900 mb-2">Modules</div>
            <ul className="space-y-1.5 text-xs text-gray-600">
              <li>• Veterinary Appointments</li>
              <li>• Electronic Health Records</li>
              <li>• Vaccination Passport</li>
              <li>• Gemini AI Wellness Assistant</li>
            </ul>
          </div>

          <div>
            <div className="font-bold text-gray-900 mb-2">Community</div>
            <ul className="space-y-1.5 text-xs text-gray-600">
              <li>• Pet Adoption Network</li>
              <li>• Lost & Found Finder</li>
              <li>• Knowledge Center Articles</li>
              <li>• Expense Tracker</li>
            </ul>
          </div>

          <div>
            <div className="font-bold text-gray-900 mb-2">Academic Information</div>
            <p className="text-xs text-gray-500 mb-2">
              Developed for Full Stack Development (FSD) Course. Architecture: React, Node.js, Express, TypeScript, REST API, Gemini.
            </p>
            <button
              onClick={onOpenProjectGuide}
              className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-lg text-xs"
            >
              Open Viva Script
            </button>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <div>© 2026 PetCare Management System. All rights reserved.</div>
          <div className="text-gray-400">
            Medical Disclaimer: Emergency pet health conditions require in-person veterinary attention.
          </div>
        </div>
      </footer>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Heart,
  Calendar,
  Shield,
  Stethoscope,
  PawPrint,
  Bell,
  Sparkles,
  User as UserIcon,
  ChevronDown,
  LogOut,
  Layers,
  Search,
  BookOpen,
} from 'lucide-react';
import { useAuth, DEMO_PROFILES } from '../context/AuthContext.tsx';
import { UserRole } from '../types/index.ts';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  unreadCount: number;
  onOpenNotifications: () => void;
  onOpenProjectGuide: () => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  unreadCount,
  onOpenNotifications,
  onOpenProjectGuide,
  onOpenAuth,
}) => {
  const { currentUser, role, switchRole, logout } = useAuth();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getRoleBadge = (r: UserRole) => {
    switch (r) {
      case 'vet':
        return { label: 'Veterinarian', bg: 'bg-teal-100 text-teal-800 border-teal-200', icon: Stethoscope };
      case 'admin':
        return { label: 'Administrator', bg: 'bg-purple-100 text-purple-800 border-purple-200', icon: Shield };
      default:
        return { label: 'Pet Owner', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: PawPrint };
    }
  };

  const badge = getRoleBadge(role);
  const BadgeIcon = badge.icon;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => onSelectTab('landing')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
                <PawPrint className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-gray-900 font-display flex items-center gap-1">
                  Pet<span className="text-emerald-600">Care</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-700 block -mt-1">
                  Health & Care OS
                </span>
              </div>
            </button>

            {/* Quick Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold text-gray-600">
              <button
                onClick={() => onSelectTab('dashboard')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  currentTab === 'dashboard'
                    ? 'bg-emerald-50 text-emerald-700 font-bold'
                    : 'hover:text-emerald-600 hover:bg-gray-50'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => onSelectTab('pets')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  currentTab === 'pets'
                    ? 'bg-emerald-50 text-emerald-700 font-bold'
                    : 'hover:text-emerald-600 hover:bg-gray-50'
                }`}
              >
                Pets
              </button>
              <button
                onClick={() => onSelectTab('appointments')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  currentTab === 'appointments'
                    ? 'bg-emerald-50 text-emerald-700 font-bold'
                    : 'hover:text-emerald-600 hover:bg-gray-50'
                }`}
              >
                Appointments
              </button>
              <button
                onClick={() => onSelectTab('health')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  currentTab === 'health'
                    ? 'bg-emerald-50 text-emerald-700 font-bold'
                    : 'hover:text-emerald-600 hover:bg-gray-50'
                }`}
              >
                Health Records
              </button>
              <button
                onClick={() => onSelectTab('ai')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                  currentTab === 'ai'
                    ? 'bg-emerald-50 text-emerald-700 font-bold'
                    : 'hover:text-emerald-600 hover:bg-gray-50'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                AI Assistant
              </button>
              <button
                onClick={() => onSelectTab('adoption')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  currentTab === 'adoption'
                    ? 'bg-emerald-50 text-emerald-700 font-bold'
                    : 'hover:text-emerald-600 hover:bg-gray-50'
                }`}
              >
                Adoption
              </button>
              <button
                onClick={() => onSelectTab('lost-found')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  currentTab === 'lost-found'
                    ? 'bg-emerald-50 text-emerald-700 font-bold'
                    : 'hover:text-emerald-600 hover:bg-gray-50'
                }`}
              >
                Lost & Found
              </button>
              <button
                onClick={() => onSelectTab('articles')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  currentTab === 'articles'
                    ? 'bg-emerald-50 text-emerald-700 font-bold'
                    : 'hover:text-emerald-600 hover:bg-gray-50'
                }`}
              >
                Articles
              </button>
            </nav>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2.5">
            {/* Academic Project Guide Button */}
            <button
              onClick={onOpenProjectGuide}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-50 to-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold hover:shadow-xs transition-all"
              title="Open MERN Architecture, Viva Script & PowerShell Setup Guide"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
              <span className="hidden sm:inline">Project Guide & Viva</span>
              <span className="sm:hidden">Guide</span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 text-gray-500 hover:text-emerald-700 hover:bg-gray-100 rounded-xl transition-colors"
              title="Scheduled Reminders"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Quick Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowRoleMenu(!showRoleMenu);
                  setShowUserMenu(false);
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all ${badge.bg}`}
                title="Switch role for demonstration"
              >
                <BadgeIcon className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{badge.label}</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-fade-in text-xs">
                  <div className="px-3 py-1.5 font-bold text-gray-400 uppercase tracking-wider text-[10px]">
                    Switch Role for Academic Demo
                  </div>
                  <button
                    onClick={() => {
                      switchRole('owner');
                      setShowRoleMenu(false);
                      onSelectTab('dashboard');
                    }}
                    className={`w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-emerald-50 transition-colors ${
                      role === 'owner' ? 'font-bold text-emerald-700 bg-emerald-50/50' : 'text-gray-700'
                    }`}
                  >
                    <PawPrint className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div>Pet Owner (Emily Watson)</div>
                      <div className="text-[10px] text-gray-400">Manage pets, book visits, expenses</div>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      switchRole('vet');
                      setShowRoleMenu(false);
                      onSelectTab('dashboard');
                    }}
                    className={`w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-teal-50 transition-colors ${
                      role === 'vet' ? 'font-bold text-teal-700 bg-teal-50/50' : 'text-gray-700'
                    }`}
                  >
                    <Stethoscope className="w-4 h-4 text-teal-600" />
                    <div>
                      <div>Veterinarian (Dr. Sarah Jenkins)</div>
                      <div className="text-[10px] text-gray-400">Schedule, consults, clinical records</div>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      switchRole('admin');
                      setShowRoleMenu(false);
                      onSelectTab('dashboard');
                    }}
                    className={`w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-purple-50 transition-colors ${
                      role === 'admin' ? 'font-bold text-purple-700 bg-purple-50/50' : 'text-gray-700'
                    }`}
                  >
                    <Shield className="w-4 h-4 text-purple-600" />
                    <div>
                      <div>Admin (Mark Foster)</div>
                      <div className="text-[10px] text-gray-400">Platform stats, approvals, moderation</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* User Avatar & Menu */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowRoleMenu(false);
                }}
                className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-emerald-400 transition-all"
              >
                <img
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80'}
                  alt={currentUser?.name || 'User'}
                  className="w-8 h-8 rounded-full object-cover border border-emerald-200"
                />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-fade-in text-xs">
                  <div className="px-3.5 py-2 border-b border-gray-100">
                    <div className="font-bold text-gray-900 truncate">{currentUser?.name}</div>
                    <div className="text-[11px] text-gray-500 truncate">{currentUser?.email}</div>
                  </div>
                  <button
                    onClick={() => {
                      onOpenAuth();
                      setShowUserMenu(false);
                    }}
                    className="w-full px-3.5 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-gray-400" /> Sign In with another account
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                    className="w-full px-3.5 py-2 text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Reset to Default Owner
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

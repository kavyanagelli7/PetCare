import React, { useState } from 'react';
import { X, LogIn, UserPlus, Shield, Stethoscope, PawPrint, AlertCircle } from 'lucide-react';
import { UserRole } from '../../types/index.ts';
import { useAuth, DEMO_PROFILES } from '../../context/AuthContext.tsx';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('owner');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login, register, switchRole } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, role, phone);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = (demoRole: UserRole) => {
    switchRole(demoRole);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-emerald-100 overflow-hidden my-6">
        <div className="flex items-center justify-between px-6 py-4 bg-emerald-50 border-b border-emerald-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-600 text-white">
              {mode === 'login' ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg font-display">
                {mode === 'login' ? 'Sign In to PetCare' : 'Create PetCare Account'}
              </h3>
              <p className="text-xs text-gray-600">
                {mode === 'login' ? 'Access your pets, appointments & health passport' : 'Join our caring pet healthcare community'}
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

        {/* Quick Demo Switcher Strip */}
        <div className="px-6 py-2.5 bg-gray-50 border-b border-gray-100">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
            Quick 1-Click Academic Demo Login:
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('owner')}
              className="py-1 px-2 text-[11px] font-semibold rounded-lg bg-white border border-emerald-200 text-emerald-800 hover:bg-emerald-50 flex items-center justify-center gap-1 shadow-xs"
            >
              <PawPrint className="w-3 h-3 text-emerald-600" /> Emily (Owner)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('vet')}
              className="py-1 px-2 text-[11px] font-semibold rounded-lg bg-white border border-teal-200 text-teal-800 hover:bg-teal-50 flex items-center justify-center gap-1 shadow-xs"
            >
              <Stethoscope className="w-3 h-3 text-teal-600" /> Dr. Sarah (Vet)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('admin')}
              className="py-1 px-2 text-[11px] font-semibold rounded-lg bg-white border border-purple-200 text-purple-800 hover:bg-purple-50 flex items-center justify-center gap-1 shadow-xs"
            >
              <Shield className="w-3 h-3 text-purple-600" /> Mark (Admin)
            </button>
          </div>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Emily Watson"
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. emily@example.com"
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Password *</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number (Optional)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Select Role *</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'owner', label: 'Pet Owner', icon: PawPrint },
                    { id: 'vet', label: 'Veterinarian', icon: Stethoscope },
                    { id: 'admin', label: 'Admin', icon: Shield },
                  ].map((r) => {
                    const Icon = r.icon;
                    const isSelected = role === r.id;
                    return (
                      <button
                        type="button"
                        key={r.id}
                        onClick={() => setRole(r.id as UserRole)}
                        className={`p-2 rounded-xl border text-center text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {r.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : mode === 'login' ? 'Sign In' : 'Create Free Account'}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setError(null);
              }}
              className="text-xs text-emerald-700 hover:underline font-semibold"
            >
              {mode === 'login'
                ? "Don't have an account? Sign up here"
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

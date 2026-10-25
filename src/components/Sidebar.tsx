import React from 'react';
import {
  LayoutDashboard,
  PawPrint,
  Calendar,
  FileText,
  Shield,
  Sparkles,
  Heart,
  Search,
  Receipt,
  BookOpen,
  Clock,
  Users,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenProjectGuide: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab, onOpenProjectGuide }) => {
  const { role } = useAuth();

  const ownerNav = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'pets', label: 'My Pets', icon: PawPrint },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'health', label: 'Health Records', icon: FileText },
    { id: 'expenses', label: 'Expense Tracker', icon: Receipt },
    { id: 'ai', label: 'AI Pet Assistant', icon: Sparkles, badge: 'Gemini' },
    { id: 'adoption', label: 'Pet Adoption', icon: Heart },
    { id: 'lost-found', label: 'Lost & Found', icon: Search },
    { id: 'articles', label: 'Knowledge Base', icon: BookOpen },
  ];

  const vetNav = [
    { id: 'dashboard', label: 'Clinical Dashboard', icon: LayoutDashboard },
    { id: 'appointments', label: 'Appointment Schedule', icon: Calendar },
    { id: 'health', label: 'Patient Medical History', icon: FileText },
    { id: 'pets', label: 'All Registered Pets', icon: PawPrint },
    { id: 'ai', label: 'AI Clinical Assistant', icon: Sparkles, badge: 'Gemini' },
    { id: 'articles', label: 'Knowledge Base', icon: BookOpen },
  ];

  const adminNav = [
    { id: 'dashboard', label: 'Platform Analytics', icon: LayoutDashboard },
    { id: 'appointments', label: 'Manage Appointments', icon: Calendar },
    { id: 'pets', label: 'Registered Pets', icon: PawPrint },
    { id: 'adoption', label: 'Adoption Approvals', icon: Heart },
    { id: 'lost-found', label: 'Lost & Found Reports', icon: Search },
    { id: 'articles', label: 'Manage Articles', icon: BookOpen },
    { id: 'ai', label: 'AI Assistant', icon: Sparkles, badge: 'Gemini' },
  ];

  const navItems = role === 'admin' ? adminNav : role === 'vet' ? vetNav : ownerNav;

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col justify-between p-4 shrink-0 hidden md:flex">
      <div className="space-y-6">
        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2 block">
            {role === 'admin' ? 'Administrator Hub' : role === 'vet' ? 'Veterinary Practice' : 'Pet Care Management'}
          </span>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-emerald-50/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Academic Project Card in Sidebar */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 text-left">
        <div className="flex items-center gap-1.5 text-emerald-900 text-xs font-bold mb-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          FSD Academic Demo
        </div>
        <p className="text-[11px] text-gray-600 mb-2.5 leading-snug">
          MERN stack full-stack design with REST endpoints, RBAC & Gemini 3.8 Flash.
        </p>
        <button
          onClick={onOpenProjectGuide}
          className="w-full py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg shadow-xs transition-colors"
        >
          View Viva Guide & Architecture
        </button>
      </div>
    </aside>
  );
};

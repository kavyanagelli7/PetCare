import React, { useState } from 'react';
import { X, Bell, CheckCircle2, Clock, Calendar, Plus, Trash2, AlertTriangle } from 'lucide-react';
import { Reminder, Pet } from '../../types/index.ts';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  reminders: Reminder[];
  pets: Pet[];
  onToggleReminder: (id: string) => Promise<void>;
  onDeleteReminder: (id: string) => Promise<void>;
  onCreateReminder: (reminder: Partial<Reminder>) => Promise<void>;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  reminders,
  pets,
  onToggleReminder,
  onDeleteReminder,
  onCreateReminder,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState(pets[0]?.id || '');
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [dueTime, setDueTime] = useState('09:00 AM');
  const [type, setType] = useState<'vaccination' | 'appointment' | 'medication' | 'deworming' | 'grooming' | 'custom'>('custom');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !selectedPetId) return;

    setLoading(true);
    try {
      await onCreateReminder({
        petId: selectedPetId,
        title: title.trim(),
        dueDate,
        dueTime,
        type,
        priority,
        notes: notes.trim(),
      });
      setTitle('');
      setNotes('');
      setShowAddForm(false);
    } finally {
      setLoading(false);
    }
  };

  const pendingReminders = reminders.filter((r) => !r.isCompleted);
  const completedReminders = reminders.filter((r) => r.isCompleted);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-emerald-100 overflow-hidden my-6 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-emerald-50 border-b border-emerald-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-600 text-white">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg font-display">
                Pet Care Reminders & Alerts
              </h3>
              <p className="text-xs text-gray-600">
                {pendingReminders.length} pending task{pendingReminders.length === 1 ? '' : 's'} scheduled
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

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Scheduled Care Tasks
            </span>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> {showAddForm ? 'Cancel' : 'Add Custom Reminder'}
            </button>
          </div>

          {/* Quick Add Form */}
          {showAddForm && (
            <form onSubmit={handleAddSubmit} className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Pet</label>
                  <select
                    value={selectedPetId}
                    onChange={(e) => setSelectedPetId(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 bg-white"
                  >
                    {pets.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 bg-white"
                  >
                    <option value="vaccination">Vaccination</option>
                    <option value="appointment">Appointment</option>
                    <option value="medication">Medication</option>
                    <option value="deworming">Deworming</option>
                    <option value="grooming">Grooming</option>
                    <option value="custom">Custom Task</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">Reminder Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Give Heartworm chewable tablet"
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 bg-white"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors"
                >
                  Save Reminder
                </button>
              </div>
            </form>
          )}

          {/* List of Reminders */}
          {reminders.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-xs">
              No reminders scheduled. Enjoy your peaceful day with your pets!
            </div>
          ) : (
            <div className="space-y-2.5">
              {pendingReminders.map((r) => {
                const isOverdue = new Date(r.dueDate) < new Date(new Date().toDateString());
                return (
                  <div
                    key={r.id}
                    className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                      isOverdue
                        ? 'bg-rose-50/70 border-rose-200'
                        : 'bg-white border-gray-200 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onToggleReminder(r.id)}
                        className="text-gray-400 hover:text-emerald-600 transition-colors"
                        title="Mark as completed"
                      >
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300 hover:border-emerald-600 flex items-center justify-center" />
                      </button>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-gray-900">{r.title}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                            {r.petName}
                          </span>
                          {isOverdue && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> Overdue
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-gray-500 flex items-center gap-3 mt-0.5">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {r.dueDate}
                          </span>
                          {r.dueTime && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {r.dueTime}
                            </span>
                          )}
                          {r.notes && <span>• {r.notes}</span>}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteReminder(r.id)}
                      className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}

              {completedReminders.length > 0 && (
                <div className="pt-3 border-t border-gray-100">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                    Completed Tasks
                  </span>
                  <div className="space-y-1.5 opacity-60">
                    {completedReminders.map((r) => (
                      <div
                        key={r.id}
                        className="p-2.5 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2 line-through text-gray-500">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>
                            {r.title} ({r.petName})
                          </span>
                        </div>
                        <button
                          onClick={() => onToggleReminder(r.id)}
                          className="text-[11px] text-gray-400 hover:text-gray-600 underline"
                        >
                          Reopen
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>In-app notifications enabled</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Code2,
  Terminal,
  Database,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Award,
  Copy,
  Check,
} from 'lucide-react';

interface ProjectGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectGuideModal: React.FC<ProjectGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'architecture' | 'apis' | 'setup' | 'viva' | 'resume'>('overview');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-emerald-100 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-emerald-50 via-teal-50 to-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 font-display">
                PetCare Academic Project & Demonstration Kit
              </h2>
              <p className="text-xs text-gray-600">
                Full-Stack (MERN) Architecture, REST APIs, College Viva Script & Setup Guide
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-100 px-6 bg-gray-50/70 overflow-x-auto gap-2">
          {[
            { id: 'overview', label: '1. Project Abstract', icon: BookOpen },
            { id: 'architecture', label: '2. MERN & Schemas', icon: Database },
            { id: 'apis', label: '3. REST Endpoints', icon: Code2 },
            { id: 'setup', label: '4. Local Setup Commands', icon: Terminal },
            { id: 'viva', label: '5. Viva Demo Script', icon: Award },
            { id: 'resume', label: '6. Resume Description', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-3.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${
                  isActive
                    ? 'border-emerald-600 text-emerald-700 bg-white shadow-xs rounded-t-lg'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-gray-700 leading-relaxed">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-100 text-emerald-900">
                <h3 className="font-bold text-base mb-1 text-emerald-950">Project Title: PetCare – Smart Pet Appointment & Care Management System</h3>
                <p className="text-xs text-emerald-800">
                  Domain: Full Stack Web Development (MERN Architecture) • AI-Augmented Healthcare Systems • Cloud APIs
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-2">Problem Statement:</h4>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Pet parents frequently struggle with fragmented veterinary healthcare: misplacing physical vaccination cards, double-booking consultation slots, lacking proactive medical reminders, and falling prey to dangerous online misinformation regarding pet toxicity. PetCare solves this by consolidating electronic health records (EHR), verified veterinary appointments, smart booster reminders, an AI clinical assistant, and community rescue services in a centralized, secure platform.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-xl border border-gray-200 bg-white shadow-xs">
                  <span className="text-xs font-bold text-emerald-600 block mb-1">Role 1: Pet Owner</span>
                  <p className="text-xs text-gray-600">Register pets, view digital vaccination passports, book vetted doctors, log health expenses, and receive booster alerts.</p>
                </div>
                <div className="p-3.5 rounded-xl border border-gray-200 bg-white shadow-xs">
                  <span className="text-xs font-bold text-teal-600 block mb-1">Role 2: Veterinarian</span>
                  <p className="text-xs text-gray-600">Manage time slots, accept appointments, record diagnoses, write digital prescriptions, and view patient clinical history.</p>
                </div>
                <div className="p-3.5 rounded-xl border border-gray-200 bg-white shadow-xs">
                  <span className="text-xs font-bold text-purple-600 block mb-1">Role 3: Administrator</span>
                  <p className="text-xs text-gray-600">Monitor system analytics, approve adoption applications, moderate lost & found reports, and publish vetted care guides.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-4">
              <h3 className="font-bold text-base text-gray-900">Database Models & MongoDB Mongoose Schema Architecture</h3>
              <p className="text-xs text-gray-600">
                Designed with standard relational foreign-key references for clean query normalization:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3.5 bg-gray-900 text-gray-200 rounded-xl overflow-x-auto">
                  <div className="text-emerald-400 font-bold mb-1">// Pet Schema</div>
                  <pre>{`const PetSchema = new mongoose.Schema({
  owner: { type: ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  species: { type: String, enum: ['Dog','Cat','Rabbit','Bird','Other'] },
  breed: String,
  ageYears: Number,
  gender: { type: String, enum: ['Male', 'Female'] },
  weightKg: Number,
  allergies: [String],
  medicalNotes: String,
  microchipId: String
}, { timestamps: true });`}</pre>
                </div>

                <div className="p-3.5 bg-gray-900 text-gray-200 rounded-xl overflow-x-auto">
                  <div className="text-teal-400 font-bold mb-1">// Appointment Schema (No Double-Booking)</div>
                  <pre>{`const AppointmentSchema = new mongoose.Schema({
  pet: { type: ObjectId, ref: 'Pet', required: true },
  vet: { type: ObjectId, ref: 'Veterinarian', required: true },
  owner: { type: ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  timeSlot: { type: String, required: true },
  status: { type: String, enum: ['pending','confirmed','completed','cancelled'] },
  reason: String,
  fee: Number
}, { timestamps: true });
// Compound index ensures slot uniqueness
AppointmentSchema.index({ vet: 1, date: 1, timeSlot: 1 }, { unique: true });`}</pre>
                </div>
              </div>

              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                <strong>Engineering Highlight:</strong> Double-booking protection is enforced on the server using an atomic slot availability query before persisting the record, preventing race conditions during concurrent bookings.
              </div>
            </div>
          )}

          {activeTab === 'apis' && (
            <div className="space-y-4">
              <h3 className="font-bold text-base text-gray-900">Documented REST API Endpoints</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-gray-200 rounded-xl overflow-hidden">
                  <thead className="bg-gray-100 text-gray-700 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="p-2.5">Method</th>
                      <th className="p-2.5">Endpoint</th>
                      <th className="p-2.5">Access Role</th>
                      <th className="p-2.5">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    <tr>
                      <td className="p-2.5"><span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-bold">POST</span></td>
                      <td className="p-2.5 font-mono text-gray-800">/api/auth/register</td>
                      <td className="p-2.5 text-gray-600">Public</td>
                      <td className="p-2.5">User sign-up with password hash and role assignment</td>
                    </tr>
                    <tr>
                      <td className="p-2.5"><span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-bold">POST</span></td>
                      <td className="p-2.5 font-mono text-gray-800">/api/auth/login</td>
                      <td className="p-2.5 text-gray-600">Public</td>
                      <td className="p-2.5">Returns JWT token and user profile</td>
                    </tr>
                    <tr>
                      <td className="p-2.5"><span className="px-2 py-0.5 rounded bg-green-100 text-green-700 font-bold">GET</span></td>
                      <td className="p-2.5 font-mono text-gray-800">/api/pets</td>
                      <td className="p-2.5 text-gray-600">Owner, Vet, Admin</td>
                      <td className="p-2.5">Fetch user pets with health vitals</td>
                    </tr>
                    <tr>
                      <td className="p-2.5"><span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-bold">POST</span></td>
                      <td className="p-2.5 font-mono text-gray-800">/api/appointments</td>
                      <td className="p-2.5 text-gray-600">Pet Owner</td>
                      <td className="p-2.5">Books consultation slot with conflict check</td>
                    </tr>
                    <tr>
                      <td className="p-2.5"><span className="px-2 py-0.5 rounded bg-yellow-100 text-yellow-800 font-bold">PUT</span></td>
                      <td className="p-2.5 font-mono text-gray-800">/api/appointments/:id/status</td>
                      <td className="p-2.5 text-gray-600">Vet, Admin</td>
                      <td className="p-2.5">Update status (Pending, Confirmed, Completed, Cancelled)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5"><span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-bold">POST</span></td>
                      <td className="p-2.5 font-mono text-gray-800">/api/health-records</td>
                      <td className="p-2.5 text-gray-600">Veterinarian</td>
                      <td className="p-2.5">Logs physical examination, diagnosis & prescription</td>
                    </tr>
                    <tr>
                      <td className="p-2.5"><span className="px-2 py-0.5 rounded bg-purple-100 text-purple-700 font-bold">POST</span></td>
                      <td className="p-2.5 font-mono text-gray-800">/api/ai/chat</td>
                      <td className="p-2.5 text-gray-600">Authenticated</td>
                      <td className="p-2.5">Context-aware veterinary guidance via Gemini 3.8 Flash</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'setup' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-gray-900">Step-by-Step Windows PowerShell Execution Guide</h3>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `# 1. Clone repository\ngit clone https://github.com/your-username/petcare.git\ncd petcare\n\n# 2. Install dependencies\nnpm install\n\n# 3. Create .env file\nCopy-Item .env.example .env\n\n# 4. Start Full-Stack Server\nnpm run dev`,
                      'ps-code'
                    )
                  }
                  className="flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-800 font-medium"
                >
                  {copiedSection === 'ps-code' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedSection === 'ps-code' ? 'Copied!' : 'Copy Script'}
                </button>
              </div>

              <div className="p-4 bg-gray-900 text-gray-100 rounded-xl font-mono text-xs space-y-2">
                <p className="text-gray-400"># Step 1: Open Windows PowerShell in your project folder</p>
                <p className="text-emerald-300">cd C:\Users\YourName\Desktop\PetCare</p>
                <p className="text-gray-400"># Step 2: Ensure Node.js 18+ is installed</p>
                <p className="text-emerald-300">node -v</p>
                <p className="text-gray-400"># Step 3: Install all dependencies</p>
                <p className="text-emerald-300">npm install</p>
                <p className="text-gray-400"># Step 4: Run the unified full-stack server</p>
                <p className="text-emerald-300">npm run dev</p>
                <p className="text-gray-400"># Application will start at: http://localhost:3000</p>
              </div>
            </div>
          )}

          {activeTab === 'viva' && (
            <div className="space-y-4">
              <h3 className="font-bold text-base text-gray-900">College Viva Voice & Demonstration Script</h3>
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50">
                  <strong className="text-emerald-950 text-xs block mb-1">
                    Q1. What makes PetCare different from a simple CRUD appointment system?
                  </strong>
                  <p className="text-xs text-gray-700">
                    "PetCare implements true end-to-end veterinary workflows: preventing doctor double-booking, offering a digital health timeline for pets, tracking weight trajectories over time, maintaining vaccine booster schedules with automated reminders, and embedding a secure server-side Gemini 3.8 Flash AI assistant that advises on wellness while detecting life-threatening toxin emergencies."
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-teal-200 bg-teal-50/50">
                  <strong className="text-teal-950 text-xs block mb-1">
                    Q2. How do you protect user privacy and enforce Role-Based Access Control (RBAC)?
                  </strong>
                  <p className="text-xs text-gray-700">
                    "Every request is authenticated via Bearer tokens on the server. Pet owners can only query and mutate their own pets and expenses. Veterinarians are granted permissions to write consultation diagnoses and medical records. Administrators have privileged rights to review community adoption requests and moderate lost-and-found notices."
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/50">
                  <strong className="text-purple-950 text-xs block mb-1">
                    Q3. How is the AI assistant safeguarded against medical malpractice?
                  </strong>
                  <p className="text-xs text-gray-700">
                    "The system prompt strictly forbids prescribing medication dosages or claiming definitive diagnoses. It automatically scans user prompts for dangerous keywords (e.g., chocolate ingestion, seizures, severe bleeding) and triggers a high-priority emergency banner advising immediate transport to an emergency clinic."
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'resume' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-gray-900">Resume-Ready Project Bullet Points</h3>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `• Developed PetCare, a full-stack pet healthcare & clinic management web application using React 19, TypeScript, Express, and Node.js.\n• Architected role-based authorization for Pet Owners, Veterinarians, and Administrators, securing medical records and patient history.\n• Engineered real-time appointment booking algorithm with double-booking prevention and automated booster reminder triggers.\n• Integrated Google Gemini 3.8 Flash API server-side with emergency triage detection for pet poison and critical symptom queries.`,
                      'resume-text'
                    )
                  }
                  className="flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-800 font-medium"
                >
                  {copiedSection === 'resume-text' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedSection === 'resume-text' ? 'Copied!' : 'Copy Bullets'}
                </button>
              </div>

              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/70 text-xs space-y-2 text-gray-700">
                <p>
                  <strong>PetCare – Smart Pet Appointment & Care Management System</strong> | <em>React, TypeScript, Express, Node.js, Tailwind CSS, Gemini API</em>
                </p>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li>
                    Engineered full-stack pet healthcare platform enabling appointment scheduling, digital vaccination passports, expense tracking, and pet adoption listings.
                  </li>
                  <li>
                    Designed 3-tier Role-Based Access Control (RBAC) separating Pet Owners, Veterinarians, and Platform Administrators.
                  </li>
                  <li>
                    Implemented conflict-free appointment scheduling preventing overlapping veterinarian consultation slots.
                  </li>
                  <li>
                    Embedded Google Gemini 3.8 Flash model via secure server-side proxy to deliver context-aware pet wellness guidance with real-time toxic emergency alerts.
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <span className="text-xs text-gray-500">PetCare FSD Academic Project 2026</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};

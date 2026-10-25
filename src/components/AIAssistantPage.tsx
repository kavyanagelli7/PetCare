import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  AlertTriangle,
  PawPrint,
  ShieldCheck,
  Bot,
  User as UserIcon,
  HelpCircle,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { Pet, ChatMessage } from '../types/index.ts';
import { api } from '../services/api.ts';

interface AIAssistantPageProps {
  pets: Pet[];
  onOpenBookAppointment: () => void;
}

export const AIAssistantPage: React.FC<AIAssistantPageProps> = ({ pets, onOpenBookAppointment }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello! I am your PetCare AI Assistant, powered by Google Gemini. 🐾
      
I can provide evidence-based guidance on:
• Canine & feline nutrition, portion sizing, and toxic food safety
• Grooming schedules, dental hygiene, and shedding control
• Common symptoms, behavioral changes, and routine wellness
• Puppy, kitten, and senior pet lifecycle care

Which pet would you like to discuss today? You can select a companion above or ask any general question!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [selectedPet, setSelectedPet] = useState<Pet | null>(pets[0] || null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const prompt = (textToSend || inputPrompt).trim();
    if (!prompt || loading) return;

    const userMessage: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      petContext: selectedPet
        ? {
            species: selectedPet.species,
            age: `${selectedPet.ageYears}y ${selectedPet.ageMonths}m`,
            name: selectedPet.name,
          }
        : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputPrompt('');
    setLoading(true);

    try {
      const res = await api.askAI(prompt, userMessage.petContext);
      const assistantMessage: ChatMessage = {
        id: `ast_${Date.now()}`,
        sender: 'assistant',
        text: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUrgentAlert: res.isUrgentAlert,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'assistant',
          text: `⚠️ I encountered a temporary connection issue. Please consult your local licensed veterinarian for urgent health concerns.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    'My dog ate milk chocolate about 30 mins ago. What should I check?',
    'What is the core vaccination schedule for a 3-month-old kitten?',
    'How do I brush my dog’s teeth without causing distress?',
    'What are early warning signs of GI stasis in domestic rabbits?',
    'How much water should an adult cat drink daily?',
  ];

  return (
    <div className="space-y-4 text-left max-w-5xl mx-auto flex flex-col h-[calc(100vh-140px)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 font-display flex items-center gap-2">
              <span>PetCare AI Assistant</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase tracking-wider">
                Gemini 3.8 Flash
              </span>
            </h1>
            <p className="text-xs text-gray-500">
              Evidence-based pet health & wellness advice. Confidential and context-aware.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenBookAppointment}
          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          Book In-Person Vet Visit
        </button>
      </div>

      {/* Safety & Emergency Disclaimer Notice */}
      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-900 shrink-0">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Veterinary Medical Disclaimer:</strong> PetCare AI provides educational guidance and does not replace in-person veterinary examination or emergency diagnostic care. For urgent emergencies (suspected poisoning, seizures, difficulty breathing, trauma), proceed immediately to an emergency veterinary clinic.
        </div>
      </div>

      {/* Pet Context Selector Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0">
        <span className="text-xs font-semibold text-gray-500 shrink-0">Pet Context:</span>
        <button
          onClick={() => setSelectedPet(null)}
          className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
            selectedPet === null
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          General Animal Care
        </button>
        {pets.map((pet) => {
          const isSelected = selectedPet?.id === pet.id;
          return (
            <button
              key={pet.id}
              onClick={() => setSelectedPet(pet)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span>{pet.species === 'Dog' ? '🐕' : pet.species === 'Cat' ? '🐈' : '🐾'}</span>
              <span>
                {pet.name} ({pet.breed}, {pet.ageYears}y)
              </span>
            </button>
          );
        })}
      </div>

      {/* Chat Messages Box */}
      <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-xs p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 text-xs leading-relaxed ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 space-y-2 ${
                  isUser
                    ? 'bg-emerald-600 text-white rounded-tr-none'
                    : msg.isUrgentAlert
                    ? 'bg-rose-50 border-2 border-rose-300 text-gray-900 rounded-tl-none shadow-xs'
                    : 'bg-gray-50/90 border border-gray-100 text-gray-800 rounded-tl-none'
                }`}
              >
                {msg.isUrgentAlert && (
                  <div className="flex items-center gap-1.5 p-2 bg-rose-100 text-rose-900 rounded-lg font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Potential Toxin / Urgent Symptom Alert</span>
                  </div>
                )}

                {msg.petContext && (
                  <div
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-md inline-block ${
                      isUser ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Context: {msg.petContext.name} ({msg.petContext.species}, {msg.petContext.age})
                  </div>
                )}

                <div className="whitespace-pre-line leading-relaxed">{msg.text}</div>

                <div
                  className={`text-[10px] text-right font-medium ${
                    isUser ? 'text-emerald-100' : 'text-gray-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold shrink-0 mt-0.5">
                  <UserIcon className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 text-xs justify-start animate-pulse">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-3.5 text-gray-500 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
              <span>Analyzing veterinary protocols and pet context...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Carousel */}
      <div className="flex gap-2 overflow-x-auto pb-1 shrink-0">
        {samplePrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            className="px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-200 text-gray-700 hover:text-emerald-800 text-[11px] font-medium whitespace-nowrap transition-colors"
          >
            "{prompt}"
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="relative shrink-0">
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={
            selectedPet
              ? `Ask a wellness question about ${selectedPet.name} (${selectedPet.species})...`
              : 'Ask any question about pet health, nutrition, or behavior...'
          }
          className="w-full px-4 py-3.5 pr-12 text-xs sm:text-sm rounded-2xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputPrompt.trim() || loading}
          className="absolute right-2 top-2 p-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl shadow-xs transition-colors"
          title="Send Question"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

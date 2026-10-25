import {
  User,
  Pet,
  Veterinarian,
  Appointment,
  HealthRecord,
  Vaccination,
  Reminder,
  Expense,
  AdoptionListing,
  AdoptionRequest,
  LostFoundReport,
  CareArticle,
  AdminStats,
} from '../types/index.ts';

const BASE_URL = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('petcare_token') || 'usr_owner_1';
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || data.message || `Request failed with status ${res.status}`);
  }
  return data as T;
}

export const api = {
  // Auth
  async login(email: string, password?: string) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse<{ token: string; user: User; message: string }>(res);
  },

  async register(data: { name: string; email: string; password?: string; role?: string; phone?: string }) {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<{ token: string; user: User; message: string }>(res);
  },

  async getMe() {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<{ user: User }>(res);
  },

  async updateProfile(data: Partial<User>) {
    const res = await fetch(`${BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<{ user: User; message: string }>(res);
  },

  // Pets
  async getPets(all = false) {
    const res = await fetch(`${BASE_URL}/pets${all ? '?all=true' : ''}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<Pet[]>(res);
  },

  async getPet(id: string) {
    const res = await fetch(`${BASE_URL}/pets/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<Pet>(res);
  },

  async createPet(data: Partial<Pet>) {
    const res = await fetch(`${BASE_URL}/pets`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Pet>(res);
  },

  async updatePet(id: string, data: Partial<Pet>) {
    const res = await fetch(`${BASE_URL}/pets/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Pet>(res);
  },

  async deletePet(id: string) {
    const res = await fetch(`${BASE_URL}/pets/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<{ message: string; pet: Pet }>(res);
  },

  // Vets
  async getVets() {
    const res = await fetch(`${BASE_URL}/vets`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<Veterinarian[]>(res);
  },

  async updateVetAvailability(id: string, data: any) {
    const res = await fetch(`${BASE_URL}/vets/${id}/availability`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<{ vet: Veterinarian; message: string }>(res);
  },

  // Appointments
  async getAppointments() {
    const res = await fetch(`${BASE_URL}/appointments`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<Appointment[]>(res);
  },

  async bookAppointment(data: {
    petId: string;
    vetId: string;
    date: string;
    timeSlot: string;
    reason: string;
    symptoms?: string;
  }) {
    const res = await fetch(`${BASE_URL}/appointments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<{ appointment: Appointment; message: string }>(res);
  },

  async updateAppointmentStatus(id: string, status: string, notes?: string, cancellationReason?: string) {
    const res = await fetch(`${BASE_URL}/appointments/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, notes, cancellationReason }),
    });
    return handleResponse<{ appointment: Appointment; message: string }>(res);
  },

  // Health Records
  async getHealthRecords(petId?: string) {
    const url = petId ? `${BASE_URL}/health-records?petId=${petId}` : `${BASE_URL}/health-records`;
    const res = await fetch(url, {
      headers: getAuthHeaders(),
    });
    return handleResponse<HealthRecord[]>(res);
  },

  async createHealthRecord(data: Partial<HealthRecord>) {
    const res = await fetch(`${BASE_URL}/health-records`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<HealthRecord>(res);
  },

  // Vaccinations
  async getVaccinations(petId?: string) {
    const url = petId ? `${BASE_URL}/vaccinations?petId=${petId}` : `${BASE_URL}/vaccinations`;
    const res = await fetch(url, {
      headers: getAuthHeaders(),
    });
    return handleResponse<Vaccination[]>(res);
  },

  async createVaccination(data: Partial<Vaccination>) {
    const res = await fetch(`${BASE_URL}/vaccinations`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Vaccination>(res);
  },

  // Reminders
  async getReminders() {
    const res = await fetch(`${BASE_URL}/reminders`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<Reminder[]>(res);
  },

  async createReminder(data: Partial<Reminder>) {
    const res = await fetch(`${BASE_URL}/reminders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Reminder>(res);
  },

  async toggleReminder(id: string) {
    const res = await fetch(`${BASE_URL}/reminders/${id}/toggle`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    return handleResponse<Reminder>(res);
  },

  async deleteReminder(id: string) {
    const res = await fetch(`${BASE_URL}/reminders/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<{ message: string }>(res);
  },

  // Expenses
  async getExpenses(petId?: string, category?: string) {
    const params = new URLSearchParams();
    if (petId) params.append('petId', petId);
    if (category) params.append('category', category);
    const query = params.toString() ? `?${params.toString()}` : '';

    const res = await fetch(`${BASE_URL}/expenses${query}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<{ expenses: Expense[]; totalSpent: number; categoryTotals: Record<string, number> }>(res);
  },

  async createExpense(data: Partial<Expense>) {
    const res = await fetch(`${BASE_URL}/expenses`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Expense>(res);
  },

  async deleteExpense(id: string) {
    const res = await fetch(`${BASE_URL}/expenses/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<{ message: string }>(res);
  },

  // Adoption
  async getAdoptionListings(species?: string) {
    const url = species && species !== 'all' ? `${BASE_URL}/adoption?species=${species}` : `${BASE_URL}/adoption`;
    const res = await fetch(url, {
      headers: getAuthHeaders(),
    });
    return handleResponse<AdoptionListing[]>(res);
  },

  async createAdoptionListing(data: Partial<AdoptionListing>) {
    const res = await fetch(`${BASE_URL}/adoption`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<AdoptionListing>(res);
  },

  async submitAdoptionRequest(listingId: string, data: any) {
    const res = await fetch(`${BASE_URL}/adoption/${listingId}/request`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<{ request: AdoptionRequest; message: string }>(res);
  },

  async getAdoptionRequests() {
    const res = await fetch(`${BASE_URL}/adoption/requests`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<AdoptionRequest[]>(res);
  },

  async updateAdoptionRequest(id: string, status: string, adminNotes?: string) {
    const res = await fetch(`${BASE_URL}/adoption/requests/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, adminNotes }),
    });
    return handleResponse<AdoptionRequest>(res);
  },

  // Lost & Found
  async getLostFoundReports(type?: string, species?: string) {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (species && species !== 'all') params.append('species', species);
    const query = params.toString() ? `?${params.toString()}` : '';

    const res = await fetch(`${BASE_URL}/lost-found${query}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<LostFoundReport[]>(res);
  },

  async createLostFoundReport(data: Partial<LostFoundReport>) {
    const res = await fetch(`${BASE_URL}/lost-found`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<LostFoundReport>(res);
  },

  async resolveLostFoundReport(id: string) {
    const res = await fetch(`${BASE_URL}/lost-found/${id}/resolve`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    return handleResponse<{ report: LostFoundReport; message: string }>(res);
  },

  // Knowledge Center Articles
  async getArticles(category?: string, search?: string) {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (search) params.append('search', search);
    const query = params.toString() ? `?${params.toString()}` : '';

    const res = await fetch(`${BASE_URL}/articles${query}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<CareArticle[]>(res);
  },

  async createArticle(data: Partial<CareArticle>) {
    const res = await fetch(`${BASE_URL}/articles`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<CareArticle>(res);
  },

  // Admin
  async getAdminStats() {
    const res = await fetch(`${BASE_URL}/admin/stats`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<AdminStats>(res);
  },

  async getAdminUsers() {
    const res = await fetch(`${BASE_URL}/admin/users`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<User[]>(res);
  },

  async updateUserRole(id: string, role: string) {
    const res = await fetch(`${BASE_URL}/admin/users/${id}/role`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ role }),
    });
    return handleResponse<User>(res);
  },

  // AI Pet Care Assistant
  async askAI(message: string, petContext?: { species?: string; age?: string; name?: string }) {
    const res = await fetch(`${BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ message, petContext }),
    });
    return handleResponse<{ reply: string; isUrgentAlert?: boolean; timestamp: string }>(res);
  },
};

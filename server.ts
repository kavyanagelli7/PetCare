import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { initialData, DatabaseState } from './src/server/mockDb.ts';
import {
  User,
  Pet,
  Appointment,
  HealthRecord,
  Vaccination,
  Reminder,
  Expense,
  AdoptionListing,
  AdoptionRequest,
  LostFoundReport,
  CareArticle,
} from './src/types/index.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory persistent state (seeded with comprehensive real-world pet records)
const db: DatabaseState = JSON.parse(JSON.stringify(initialData));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper for simulated authentication header
const getAuthUser = (req: Request): User | null => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    // Default to first user (Emily Watson) if no auth header for seamless exploration
    return db.users[0];
  }
  const token = authHeader.replace('Bearer ', '').trim();
  const found = db.users.find((u) => u.id === token || u.email === token);
  return found || db.users[0];
};

// ==========================================
// 1. AUTHENTICATION & USERS
// ==========================================
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Find user in database
  let user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  // If not found, provide demo quick account or default
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // Return simulated JWT token (user.id as token) and user info
  return res.json({
    token: user.id,
    user,
    message: `Welcome back, ${user.name}!`,
  });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, password, role = 'owner', phone } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }

  const newUser: User = {
    id: `usr_${Date.now()}`,
    name,
    email,
    role: role === 'vet' ? 'vet' : role === 'admin' ? 'admin' : 'owner',
    phone: phone || '',
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);

  // If registering as a vet, also add to veterinarians directory
  if (newUser.role === 'vet') {
    db.vets.push({
      id: `vet_${Date.now()}`,
      userId: newUser.id,
      name: `Dr. ${newUser.name}`,
      email: newUser.email,
      phone: newUser.phone || '+1 (555) 000-0000',
      avatar: newUser.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=256&q=80',
      specialization: 'General Veterinary Care',
      clinicName: 'PetCare Partner Clinic',
      clinicAddress: '100 Medical Center Parkway',
      experienceYears: 3,
      consultationFee: 600,
      rating: 5.0,
      reviewCount: 1,
      bio: 'Dedicated veterinary practitioner providing compassionate animal care.',
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      timeSlots: ['09:00 AM', '10:30 AM', '02:00 PM', '03:30 PM'],
      isAcceptingPatients: true,
    });
  }

  return res.status(201).json({
    token: newUser.id,
    user: newUser,
    message: 'Registration successful! Welcome to PetCare.',
  });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });
  return res.json({ user });
});

app.put('/api/auth/profile', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });

  const { name, phone, bio, avatar, clinicName, specialization } = req.body;
  if (name) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (bio !== undefined) user.bio = bio;
  if (avatar) user.avatar = avatar;
  if (clinicName) user.clinicName = clinicName;
  if (specialization) user.specialization = specialization;

  return res.json({ user, message: 'Profile updated successfully' });
});

// ==========================================
// 2. PET MANAGEMENT
// ==========================================
app.get('/api/pets', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const { all } = req.query;

  // Admin or Vet with 'all=true' can see all pets, owner sees only their pets
  if (user && (user.role === 'admin' || user.role === 'vet') && all === 'true') {
    return res.json(db.pets);
  }

  if (user && user.role === 'owner') {
    const ownerPets = db.pets.filter((p) => p.ownerId === user.id);
    return res.json(ownerPets);
  }

  return res.json(db.pets);
});

app.get('/api/pets/:id', (req: Request, res: Response) => {
  const pet = db.pets.find((p) => p.id === req.params.id);
  if (!pet) return res.status(404).json({ error: 'Pet not found' });
  return res.json(pet);
});

app.post('/api/pets', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Authentication required' });

  const { name, species, breed, ageYears, ageMonths, dateOfBirth, gender, weightKg, photoUrl, allergies, medicalNotes, microchipId } = req.body;

  if (!name || !species) {
    return res.status(400).json({ error: 'Pet name and species are required' });
  }

  // Fallback photo based on species if none provided
  const fallbackPhotos: Record<string, string> = {
    Dog: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
    Cat: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
    Rabbit: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=600&q=80',
    Bird: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=600&q=80',
    Other: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&w=600&q=80',
  };

  const newPet: Pet = {
    id: `pet_${Date.now()}`,
    ownerId: user.id,
    ownerName: user.name,
    name,
    species: species || 'Dog',
    breed: breed || 'Mixed Breed',
    ageYears: Number(ageYears) || 0,
    ageMonths: Number(ageMonths) || 0,
    dateOfBirth: dateOfBirth || '',
    gender: gender === 'Female' ? 'Female' : 'Male',
    weightKg: Number(weightKg) || 5.0,
    photoUrl: photoUrl || fallbackPhotos[species] || fallbackPhotos.Dog,
    allergies: Array.isArray(allergies) ? allergies : typeof allergies === 'string' && allergies ? allergies.split(',').map((a: string) => a.trim()) : [],
    medicalNotes: medicalNotes || '',
    microchipId: microchipId || '',
    createdAt: new Date().toISOString(),
  };

  db.pets.unshift(newPet);
  return res.status(201).json(newPet);
});

app.put('/api/pets/:id', (req: Request, res: Response) => {
  const petIndex = db.pets.findIndex((p) => p.id === req.params.id);
  if (petIndex === -1) return res.status(404).json({ error: 'Pet not found' });

  const current = db.pets[petIndex];
  const updated: Pet = {
    ...current,
    ...req.body,
    allergies: Array.isArray(req.body.allergies)
      ? req.body.allergies
      : typeof req.body.allergies === 'string'
      ? req.body.allergies.split(',').map((s: string) => s.trim())
      : current.allergies,
  };

  db.pets[petIndex] = updated;
  return res.json(updated);
});

app.delete('/api/pets/:id', (req: Request, res: Response) => {
  const petIndex = db.pets.findIndex((p) => p.id === req.params.id);
  if (petIndex === -1) return res.status(404).json({ error: 'Pet not found' });

  const deleted = db.pets.splice(petIndex, 1)[0];
  // Cleanup related appointments and records
  db.appointments = db.appointments.filter((a) => a.petId !== deleted.id);
  db.reminders = db.reminders.filter((r) => r.petId !== deleted.id);
  db.vaccinations = db.vaccinations.filter((v) => v.petId !== deleted.id);

  return res.json({ message: 'Pet profile removed successfully', pet: deleted });
});

// ==========================================
// 3. VETERINARIANS & AVAILABILITY
// ==========================================
app.get('/api/vets', (req: Request, res: Response) => {
  return res.json(db.vets);
});

app.get('/api/vets/:id', (req: Request, res: Response) => {
  const vet = db.vets.find((v) => v.id === req.params.id || v.userId === req.params.id);
  if (!vet) return res.status(404).json({ error: 'Veterinarian not found' });
  return res.json(vet);
});

app.put('/api/vets/:id/availability', (req: Request, res: Response) => {
  const vet = db.vets.find((v) => v.id === req.params.id || v.userId === req.params.id);
  if (!vet) return res.status(404).json({ error: 'Veterinarian not found' });

  const { availableDays, timeSlots, isAcceptingPatients, consultationFee } = req.body;
  if (availableDays) vet.availableDays = availableDays;
  if (timeSlots) vet.timeSlots = timeSlots;
  if (isAcceptingPatients !== undefined) vet.isAcceptingPatients = isAcceptingPatients;
  if (consultationFee !== undefined) vet.consultationFee = Number(consultationFee);

  return res.json({ vet, message: 'Availability schedule updated successfully' });
});

// ==========================================
// 4. APPOINTMENT BOOKING & STATUS
// ==========================================
app.get('/api/appointments', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Authentication required' });

  if (user.role === 'admin') {
    return res.json(db.appointments);
  }

  if (user.role === 'vet') {
    const vet = db.vets.find((v) => v.userId === user.id || v.email === user.email);
    const vetAppointments = db.appointments.filter((a) => a.vetId === vet?.id || a.vetName.includes(user.name));
    return res.json(vetAppointments);
  }

  // Owner
  const ownerAppointments = db.appointments.filter((a) => a.ownerId === user.id || a.ownerEmail === user.email);
  return res.json(ownerAppointments);
});

app.post('/api/appointments', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Authentication required' });

  const { petId, vetId, date, timeSlot, reason, symptoms } = req.body;
  if (!petId || !vetId || !date || !timeSlot || !reason) {
    return res.status(400).json({ error: 'Pet, veterinarian, date, time slot, and reason are required' });
  }

  const pet = db.pets.find((p) => p.id === petId);
  if (!pet) return res.status(404).json({ error: 'Pet not found' });

  const vet = db.vets.find((v) => v.id === vetId);
  if (!vet) return res.status(404).json({ error: 'Veterinarian not found' });

  // DOUBLE BOOKING PREVENTION
  const existingConflict = db.appointments.find(
    (a) => a.vetId === vetId && a.date === date && a.timeSlot === timeSlot && a.status !== 'cancelled'
  );

  if (existingConflict) {
    return res.status(409).json({
      error: `Dr. ${vet.name} is already booked on ${date} at ${timeSlot}. Please choose an alternative time slot.`,
    });
  }

  const newAppointment: Appointment = {
    id: `apt_${Date.now()}`,
    petId: pet.id,
    petName: pet.name,
    petSpecies: pet.species,
    ownerId: user.id,
    ownerName: user.name,
    ownerEmail: user.email,
    ownerPhone: user.phone || '',
    vetId: vet.id,
    vetName: vet.name,
    vetSpecialization: vet.specialization,
    clinicName: vet.clinicName,
    date,
    timeSlot,
    reason,
    symptoms: symptoms || '',
    status: 'pending',
    fee: vet.consultationFee,
    createdAt: new Date().toISOString(),
  };

  db.appointments.unshift(newAppointment);

  // Auto-create a reminder for the owner
  const reminder: Reminder = {
    id: `rem_${Date.now()}`,
    petId: pet.id,
    petName: pet.name,
    ownerId: user.id,
    title: `Vet Appointment with ${vet.name} (${reason})`,
    type: 'appointment',
    dueDate: date,
    dueTime: timeSlot,
    isCompleted: false,
    priority: 'high',
    notes: `Clinic: ${vet.clinicName}. Contact: ${vet.phone}`,
  };
  db.reminders.unshift(reminder);

  return res.status(201).json({
    appointment: newAppointment,
    message: 'Appointment request submitted successfully! Pending veterinarian confirmation.',
  });
});

app.put('/api/appointments/:id/status', (req: Request, res: Response) => {
  const { status, notes, cancellationReason } = req.body;
  const apt = db.appointments.find((a) => a.id === req.params.id);

  if (!apt) return res.status(404).json({ error: 'Appointment not found' });

  if (['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
    apt.status = status;
  }
  if (notes) apt.notes = notes;
  if (cancellationReason) apt.cancellationReason = cancellationReason;

  return res.json({ appointment: apt, message: `Appointment status updated to ${status}.` });
});

// ==========================================
// 5. HEALTH RECORDS & VACCINATIONS
// ==========================================
app.get('/api/health-records', (req: Request, res: Response) => {
  const { petId } = req.query;
  if (petId) {
    const filtered = db.healthRecords.filter((r) => r.petId === petId);
    return res.json(filtered);
  }
  return res.json(db.healthRecords);
});

app.post('/api/health-records', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const { petId, diagnosis, treatment, prescription, notes, followUpDate, weightKg, temperatureC } = req.body;

  if (!petId || !diagnosis || !treatment) {
    return res.status(400).json({ error: 'Pet, diagnosis, and treatment are required' });
  }

  const pet = db.pets.find((p) => p.id === petId);
  if (!pet) return res.status(404).json({ error: 'Pet not found' });

  const newRecord: HealthRecord = {
    id: `rec_${Date.now()}`,
    petId: pet.id,
    petName: pet.name,
    vetId: user?.id || 'vet_1',
    vetName: user?.name ? (user.name.startsWith('Dr.') ? user.name : `Dr. ${user.name}`) : 'Dr. Sarah Jenkins',
    date: new Date().toISOString().split('T')[0],
    diagnosis,
    treatment,
    prescription: Array.isArray(prescription) ? prescription : [],
    notes: notes || '',
    followUpDate: followUpDate || '',
    weightKg: weightKg ? Number(weightKg) : pet.weightKg,
    temperatureC: temperatureC ? Number(temperatureC) : 38.5,
  };

  db.healthRecords.unshift(newRecord);

  // Update pet weight if provided
  if (weightKg) {
    pet.weightKg = Number(weightKg);
  }

  return res.status(201).json(newRecord);
});

app.get('/api/vaccinations', (req: Request, res: Response) => {
  const { petId } = req.query;
  if (petId) {
    return res.json(db.vaccinations.filter((v) => v.petId === petId));
  }
  return res.json(db.vaccinations);
});

app.post('/api/vaccinations', (req: Request, res: Response) => {
  const { petId, vaccineName, administeredDate, nextDueDate, veterinarianName, batchNumber, notes } = req.body;
  if (!petId || !vaccineName || !administeredDate || !nextDueDate) {
    return res.status(400).json({ error: 'Pet, vaccine name, administered date, and next due date are required' });
  }

  const pet = db.pets.find((p) => p.id === petId);
  if (!pet) return res.status(404).json({ error: 'Pet not found' });

  const now = new Date();
  const due = new Date(nextDueDate);
  const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  let status: 'up_to_date' | 'due_soon' | 'overdue' = 'up_to_date';
  if (diffDays < 0) status = 'overdue';
  else if (diffDays <= 30) status = 'due_soon';

  const newVac: Vaccination = {
    id: `vac_${Date.now()}`,
    petId: pet.id,
    petName: pet.name,
    vaccineName,
    administeredDate,
    nextDueDate,
    veterinarianName: veterinarianName || 'Clinic Veterinarian',
    batchNumber: batchNumber || 'VAC-BATCH-GEN',
    status,
    notes: notes || '',
  };

  db.vaccinations.unshift(newVac);

  // Also create a reminder for the next booster
  db.reminders.unshift({
    id: `rem_vac_${Date.now()}`,
    petId: pet.id,
    petName: pet.name,
    ownerId: pet.ownerId,
    title: `${vaccineName} Booster Due for ${pet.name}`,
    type: 'vaccination',
    dueDate: nextDueDate,
    dueTime: '09:00 AM',
    isCompleted: false,
    priority: status === 'overdue' ? 'high' : 'medium',
    notes: `Previous administered on ${administeredDate}.`,
  });

  return res.status(201).json(newVac);
});

// ==========================================
// 6. SMART REMINDERS
// ==========================================
app.get('/api/reminders', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Authentication required' });

  if (user.role === 'admin') {
    return res.json(db.reminders);
  }

  const userReminders = db.reminders.filter((r) => r.ownerId === user.id);
  return res.json(userReminders);
});

app.post('/api/reminders', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Authentication required' });

  const { petId, title, type, dueDate, dueTime, priority, notes } = req.body;
  if (!petId || !title || !dueDate) {
    return res.status(400).json({ error: 'Pet, title, and due date are required' });
  }

  const pet = db.pets.find((p) => p.id === petId);
  if (!pet) return res.status(404).json({ error: 'Pet not found' });

  const newReminder: Reminder = {
    id: `rem_${Date.now()}`,
    petId: pet.id,
    petName: pet.name,
    ownerId: user.id,
    title,
    type: type || 'custom',
    dueDate,
    dueTime: dueTime || '10:00 AM',
    isCompleted: false,
    priority: priority || 'medium',
    notes: notes || '',
  };

  db.reminders.unshift(newReminder);
  return res.status(201).json(newReminder);
});

app.put('/api/reminders/:id/toggle', (req: Request, res: Response) => {
  const reminder = db.reminders.find((r) => r.id === req.params.id);
  if (!reminder) return res.status(404).json({ error: 'Reminder not found' });

  reminder.isCompleted = !reminder.isCompleted;
  return res.json(reminder);
});

app.delete('/api/reminders/:id', (req: Request, res: Response) => {
  const index = db.reminders.findIndex((r) => r.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Reminder not found' });

  const removed = db.reminders.splice(index, 1)[0];
  return res.json({ message: 'Reminder deleted', reminder: removed });
});

// ==========================================
// 7. PET EXPENSE TRACKER
// ==========================================
app.get('/api/expenses', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const { petId, category } = req.query;

  let filtered = db.expenses;
  if (user && user.role !== 'admin') {
    filtered = filtered.filter((e) => e.ownerId === user.id);
  }
  if (petId) {
    filtered = filtered.filter((e) => e.petId === petId);
  }
  if (category) {
    filtered = filtered.filter((e) => e.category === category);
  }

  const total = filtered.reduce((acc, curr) => acc + curr.amount, 0);

  // Category breakdown
  const categoryTotals: Record<string, number> = {};
  filtered.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  return res.json({
    expenses: filtered,
    totalSpent: Math.round(total * 100) / 100,
    categoryTotals,
  });
});

app.post('/api/expenses', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Authentication required' });

  const { petId, category, amount, date, description } = req.body;
  if (!petId || !category || !amount || !description) {
    return res.status(400).json({ error: 'Pet, category, amount, and description are required' });
  }

  const pet = db.pets.find((p) => p.id === petId);
  if (!pet) return res.status(404).json({ error: 'Pet not found' });

  const newExpense: Expense = {
    id: `exp_${Date.now()}`,
    petId: pet.id,
    petName: pet.name,
    ownerId: user.id,
    category,
    amount: Number(amount),
    date: date || new Date().toISOString().split('T')[0],
    description,
  };

  db.expenses.unshift(newExpense);
  return res.status(201).json(newExpense);
});

app.delete('/api/expenses/:id', (req: Request, res: Response) => {
  const index = db.expenses.findIndex((e) => e.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Expense not found' });

  const removed = db.expenses.splice(index, 1)[0];
  return res.json({ message: 'Expense deleted', expense: removed });
});

// ==========================================
// 8. PET ADOPTION & RESCUE
// ==========================================
app.get('/api/adoption', (req: Request, res: Response) => {
  const { species, status } = req.query;
  let results = db.adoptionListings;

  if (species && species !== 'all') {
    results = results.filter((a) => a.species.toLowerCase() === (species as string).toLowerCase());
  }
  if (status) {
    results = results.filter((a) => a.status === status);
  }

  return res.json(results);
});

app.post('/api/adoption', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Authentication required' });

  const { title, petName, species, breed, age, gender, location, description, photoUrl, healthStatus, isVaccinated, isNeutered } = req.body;
  if (!title || !petName || !species || !description) {
    return res.status(400).json({ error: 'Title, pet name, species, and description are required' });
  }

  const newListing: AdoptionListing = {
    id: `adp_${Date.now()}`,
    title,
    petName,
    species: species || 'Dog',
    breed: breed || 'Rescue Breed',
    age: age || '1 Year',
    gender: gender === 'Female' ? 'Female' : 'Male',
    location: location || 'Local Sanctuary',
    description,
    photoUrl: photoUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
    healthStatus: healthStatus || 'Health checked, vaccinated & microchipped',
    isVaccinated: Boolean(isVaccinated),
    isNeutered: Boolean(isNeutered),
    postedBy: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    status: 'available',
    createdAt: new Date().toISOString(),
  };

  db.adoptionListings.unshift(newListing);
  return res.status(201).json(newListing);
});

app.post('/api/adoption/:id/request', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const listing = db.adoptionListings.find((a) => a.id === req.params.id);
  if (!listing) return res.status(404).json({ error: 'Listing not found' });

  const { housingType, hasFencedYard, existingPets, experienceDescription } = req.body;

  const newRequest: AdoptionRequest = {
    id: `req_${Date.now()}`,
    listingId: listing.id,
    petName: listing.petName,
    applicantId: user?.id || `anon_${Date.now()}`,
    applicantName: user?.name || req.body.applicantName || 'Pet Lover',
    applicantEmail: user?.email || req.body.applicantEmail || 'applicant@example.com',
    applicantPhone: req.body.applicantPhone || user?.phone || '+1 (555) 234-5678',
    housingType: housingType || 'Apartment / House',
    hasFencedYard: Boolean(hasFencedYard),
    existingPets: existingPets || 'None',
    experienceDescription: experienceDescription || 'Experienced pet owner ready for a loving addition.',
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  db.adoptionRequests.unshift(newRequest);
  return res.status(201).json({
    request: newRequest,
    message: 'Adoption inquiry submitted! The rescue team will review your application promptly.',
  });
});

app.get('/api/adoption/requests', (req: Request, res: Response) => {
  return res.json(db.adoptionRequests);
});

app.put('/api/adoption/requests/:id', (req: Request, res: Response) => {
  const request = db.adoptionRequests.find((r) => r.id === req.params.id);
  if (!request) return res.status(404).json({ error: 'Request not found' });

  const { status, adminNotes } = req.body;
  if (['pending', 'approved', 'rejected', 'completed'].includes(status)) {
    request.status = status;
  }
  if (adminNotes !== undefined) request.adminNotes = adminNotes;

  // If approved, update listing status to pending/adopted
  if (status === 'approved') {
    const listing = db.adoptionListings.find((l) => l.id === request.listingId);
    if (listing) listing.status = 'pending';
  } else if (status === 'completed') {
    const listing = db.adoptionListings.find((l) => l.id === request.listingId);
    if (listing) listing.status = 'adopted';
  }

  return res.json(request);
});

// ==========================================
// 9. LOST & FOUND PET FINDER
// ==========================================
app.get('/api/lost-found', (req: Request, res: Response) => {
  const { type, species, city } = req.query;
  let results = db.lostFoundReports;

  if (type) {
    results = results.filter((r) => r.type === type);
  }
  if (species && species !== 'all') {
    results = results.filter((r) => r.species.toLowerCase() === (species as string).toLowerCase());
  }
  if (city) {
    results = results.filter((r) => r.city.toLowerCase().includes((city as string).toLowerCase()));
  }

  return res.json(results);
});

app.post('/api/lost-found', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const { type, petName, species, breed, primaryColor, lastSeenDate, location, city, description, photoUrl, contactName, contactPhone, contactEmail } = req.body;

  if (!type || !species || !location || !city || !description) {
    return res.status(400).json({ error: 'Type, species, location, city, and description are required' });
  }

  const newReport: LostFoundReport = {
    id: `lf_${Date.now()}`,
    type: type === 'found' ? 'found' : 'lost',
    petName: petName || (type === 'found' ? 'Unknown (Found Pet)' : 'Beloved Pet'),
    species: species || 'Dog',
    breed: breed || 'Unknown Breed',
    primaryColor: primaryColor || 'Mixed',
    lastSeenDate: lastSeenDate || new Date().toISOString().split('T')[0],
    location,
    city,
    description,
    photoUrl: photoUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
    contactName: contactName || user?.name || 'PetCare Community Volunteer',
    contactPhone: contactPhone || user?.phone || '+1 (555) 000-0000',
    contactEmail: contactEmail || user?.email || 'rescue@petcare.com',
    isResolved: false,
    createdAt: new Date().toISOString(),
  };

  db.lostFoundReports.unshift(newReport);
  return res.status(201).json(newReport);
});

app.put('/api/lost-found/:id/resolve', (req: Request, res: Response) => {
  const report = db.lostFoundReports.find((r) => r.id === req.params.id);
  if (!report) return res.status(404).json({ error: 'Report not found' });

  report.isResolved = true;
  report.resolvedDate = new Date().toISOString().split('T')[0];
  return res.json({ report, message: 'Report marked as reunited/resolved! Thank you for helping our community.' });
});

// ==========================================
// 10. KNOWLEDGE CENTER ARTICLES
// ==========================================
app.get('/api/articles', (req: Request, res: Response) => {
  const { category, search } = req.query;
  let results = db.careArticles;

  if (category && category !== 'All') {
    results = results.filter((a) => a.category === category);
  }
  if (search) {
    const s = (search as string).toLowerCase();
    results = results.filter(
      (a) => a.title.toLowerCase().includes(s) || a.excerpt.toLowerCase().includes(s) || a.content.toLowerCase().includes(s)
    );
  }

  return res.json(results);
});

app.post('/api/articles', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const { title, excerpt, content, category, readTime, imageUrl, tags } = req.body;

  if (!title || !content || !category) {
    return res.status(400).json({ error: 'Title, category, and content are required' });
  }

  const slug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');

  const newArticle: CareArticle = {
    id: `art_${Date.now()}`,
    title,
    slug,
    excerpt: excerpt || content.substring(0, 140) + '...',
    content,
    category,
    readTime: readTime || '4 min read',
    authorName: user?.name || 'PetCare Veterinary Staff',
    authorRole: user?.role === 'vet' ? 'Veterinary Surgeon' : 'Editorial Staff',
    publishedDate: new Date().toISOString().split('T')[0],
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80',
    tags: Array.isArray(tags) ? tags : typeof tags === 'string' && tags ? tags.split(',').map((t: string) => t.trim()) : ['Pet Care', category],
  };

  db.careArticles.unshift(newArticle);
  return res.status(201).json(newArticle);
});

// ==========================================
// 11. ADMIN DASHBOARD & STATS
// ==========================================
app.get('/api/admin/stats', (req: Request, res: Response) => {
  const statusBreakdown = {
    pending: db.appointments.filter((a) => a.status === 'pending').length,
    confirmed: db.appointments.filter((a) => a.status === 'confirmed').length,
    completed: db.appointments.filter((a) => a.status === 'completed').length,
    cancelled: db.appointments.filter((a) => a.status === 'cancelled').length,
  };

  const totalRevenue = db.appointments
    .filter((a) => a.status === 'completed' || a.status === 'confirmed')
    .reduce((sum, a) => sum + (a.fee || 750), 0);

  return res.json({
    totalUsers: db.users.length,
    totalPets: db.pets.length,
    totalVets: db.vets.length,
    totalAppointments: db.appointments.length,
    totalAdoptions: db.adoptionListings.length,
    totalLostFound: db.lostFoundReports.length,
    totalExpensesTracked: db.expenses.length,
    statusBreakdown,
    monthlyRevenue: totalRevenue,
  });
});

app.get('/api/admin/users', (req: Request, res: Response) => {
  return res.json(db.users);
});

app.put('/api/admin/users/:id/role', (req: Request, res: Response) => {
  const user = db.users.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const { role } = req.body;
  if (['owner', 'vet', 'admin'].includes(role)) {
    user.role = role;
  }
  return res.json(user);
});

// ==========================================
// 12. AI PET CARE ASSISTANT (Powered by Gemini)
// ==========================================
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  const { message, petContext } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'A message prompt is required' });
  }

  const speciesInfo = petContext?.species ? `Pet Species: ${petContext.species}.` : '';
  const ageInfo = petContext?.age ? `Pet Age: ${petContext.age}.` : '';
  const nameInfo = petContext?.name ? `Pet Name: ${petContext.name}.` : '';

  const systemInstruction = `You are the official PetCare AI Clinical and Wellness Assistant.
Your goal is to assist pet parents with questions regarding dog, cat, rabbit, bird, and exotic animal care, nutrition, grooming, behavior, exercise, preventive care, and understanding common symptoms.

Key Guidelines:
1. Speak with warmth, clinical accuracy, and empathy.
2. Context provided: ${nameInfo} ${speciesInfo} ${ageInfo}. Tailor your advice specifically to this animal's anatomy, metabolic rate, and lifecycle stage.
3. Safety & Emergency Protocols:
   - If symptoms indicate an acute medical emergency (such as severe respiratory distress, collapse, seizures, severe bloat/retching in dogs, inability to urinate in male cats, ingestion of deadly toxins like chocolate, xylitol, lilies, rat poison, grapes, antifreeze, or severe bleeding), immediately flag this in bold and urge the owner to contact an emergency veterinary hospital or ASPCA Poison Control without delay.
   - Do NOT give unverified prescription drug dosages or suggest human OTC medications like Tylenol/Advil (which are lethal to cats/dogs).
4. Always distinguish routine home support (like ice packs for minor swelling or gentle chicken/rice bland diet for mild upset) from medical conditions requiring an in-clinic examination.
5. Conclude with a courteous reminder that PetCare AI offers educational guidance and does not replace an in-person physical examination by a licensed veterinarian.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: message,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'I am currently unable to analyze your query. Please consult a licensed veterinarian for immediate pet care guidance.';

    // Check if reply warns of urgent emergency
    const lower = message.toLowerCase();
    const isUrgent =
      lower.includes('chocolate') ||
      lower.includes('poison') ||
      lower.includes('seizure') ||
      lower.includes('bleeding') ||
      lower.includes('breathing') ||
      lower.includes('collapse') ||
      lower.includes('lily') ||
      lower.includes('grape') ||
      lower.includes('xylitol');

    return res.json({
      reply,
      isUrgentAlert: isUrgent,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Gemini API Error:', err);

    // High quality intelligent fallback if API key is not configured or rate limited
    const lower = message.toLowerCase();
    let fallbackText = `Hello! Based on pet care best practices for ${petContext?.species || 'pets'}:
    
• Hydration & Monitoring: Ensure access to clean, fresh water and observe your pet's energy level, appetite, and bathroom habits.
• When to Contact a Vet: If you notice reduced appetite for more than 24 hours, persistent lethargy, vomiting, or signs of pain, please schedule an appointment with a licensed veterinarian.
• Diet & Safety: Keep toxic foods (chocolate, onions, garlic, grapes, xylitol) strictly away from your pets.

*Medical Disclaimer: PetCare AI provides informational guidance for daily wellness and preventive care. For any acute health symptoms, please consult your veterinarian immediately.*`;

    if (lower.includes('food') || lower.includes('eat') || lower.includes('diet') || lower.includes('nutrition')) {
      fallbackText = `Here are general nutritional guidelines for your ${petContext?.species || 'pet'}:

1. Complete & Balanced Diet: Choose animal-appropriate diets formulated to meet AAFCO standards for their life stage (puppy/kitten, adult maintenance, or senior).
2. Portion Control: Feed measured portions twice a day rather than free-feeding to prevent obesity.
3. Hydration: Provide clean, cool water at all times. Cats often benefit from wet food or water fountains to promote kidney health.
4. Strictly Forbidden: Never feed chocolate, grapes, raisins, onions, garlic, macadamia nuts, or artificial sweeteners (xylitol).

Always consult your veterinarian before transitioning diets or introducing new supplements.`;
    } else if (lower.includes('vaccin') || lower.includes('shot')) {
      fallbackText = `Core vaccination schedule overview:

• Dogs: Rabies (legally mandated in most regions), DHPP (Distemper, Hepatitis, Parvovirus, Parainfluenza). Non-core vaccines include Bordetella (kennel cough), Lyme disease, and Leptospirosis.
• Cats: Rabies, FVRCP (Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia), and FeLV (Feline Leukemia).
• Timing: Puppies and kittens receive initial series every 3-4 weeks until 16 weeks old, followed by a booster at 1 year, and then every 1 to 3 years.

You can view and log your pet's vaccination record directly in the "Health Records" tab!`;
    }

    return res.json({
      reply: fallbackText,
      isUrgentAlert: false,
      timestamp: new Date().toISOString(),
      note: 'Offline wellness guidance mode active.',
    });
  }
});

// ==========================================
// 13. VITE MIDDLEWARE / STATIC ASSETS
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT) || 3000, '0.0.0.0', () => {
    console.log(`🐾 PetCare Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

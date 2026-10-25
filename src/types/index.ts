export type UserRole = 'owner' | 'vet' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  bio?: string;
  clinicName?: string;
  specialization?: string;
  createdAt: string;
}

export type PetSpecies = 'Dog' | 'Cat' | 'Rabbit' | 'Bird' | 'Other';
export type PetGender = 'Male' | 'Female';

export interface Pet {
  id: string;
  ownerId: string;
  ownerName: string;
  name: string;
  species: PetSpecies;
  breed: string;
  ageYears: number;
  ageMonths: number;
  dateOfBirth?: string;
  gender: PetGender;
  weightKg: number;
  photoUrl: string;
  allergies: string[];
  medicalNotes?: string;
  microchipId?: string;
  createdAt: string;
}

export interface Veterinarian {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  specialization: string;
  clinicName: string;
  clinicAddress: string;
  experienceYears: number;
  consultationFee: number;
  rating: number;
  reviewCount: number;
  bio: string;
  availableDays: string[]; // e.g. ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  timeSlots: string[]; // e.g. ['09:00 AM', '10:00 AM', ...]
  isAcceptingPatients: boolean;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  petId: string;
  petName: string;
  petSpecies: PetSpecies;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone?: string;
  vetId: string;
  vetName: string;
  vetSpecialization: string;
  clinicName?: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // "10:00 AM"
  reason: string;
  symptoms?: string;
  status: AppointmentStatus;
  cancellationReason?: string;
  notes?: string;
  fee: number;
  createdAt: string;
}

export interface PrescriptionItem {
  medicine: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface HealthRecord {
  id: string;
  petId: string;
  petName: string;
  vetId: string;
  vetName: string;
  date: string;
  diagnosis: string;
  treatment: string;
  prescription: PrescriptionItem[];
  notes?: string;
  followUpDate?: string;
  weightKg?: number;
  temperatureC?: number;
}

export type VaccinationStatus = 'up_to_date' | 'due_soon' | 'overdue';

export interface Vaccination {
  id: string;
  petId: string;
  petName: string;
  vaccineName: string;
  administeredDate: string;
  nextDueDate: string;
  veterinarianName: string;
  batchNumber?: string;
  status: VaccinationStatus;
  notes?: string;
}

export type ReminderType = 'vaccination' | 'appointment' | 'medication' | 'deworming' | 'grooming' | 'custom';
export type ReminderPriority = 'low' | 'medium' | 'high';

export interface Reminder {
  id: string;
  petId: string;
  petName: string;
  ownerId: string;
  title: string;
  type: ReminderType;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string;
  isCompleted: boolean;
  priority: ReminderPriority;
  notes?: string;
}

export type ExpenseCategory = 'Food' | 'Medical' | 'Grooming' | 'Medicine' | 'Toys & Accessories' | 'Boarding' | 'Other';

export interface Expense {
  id: string;
  petId: string;
  petName: string;
  ownerId: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  description: string;
}

export type AdoptionStatus = 'available' | 'pending' | 'adopted';

export interface AdoptionListing {
  id: string;
  title: string;
  petName: string;
  species: PetSpecies;
  breed: string;
  age: string;
  gender: PetGender;
  location: string;
  description: string;
  photoUrl: string;
  healthStatus: string;
  isVaccinated: boolean;
  isNeutered: boolean;
  postedBy: {
    id: string;
    name: string;
    email: string;
  };
  status: AdoptionStatus;
  createdAt: string;
}

export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'completed';

export interface AdoptionRequest {
  id: string;
  listingId: string;
  petName: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  housingType: string;
  hasFencedYard: boolean;
  existingPets: string;
  experienceDescription: string;
  status: RequestStatus;
  adminNotes?: string;
  createdAt: string;
}

export type ReportType = 'lost' | 'found';

export interface LostFoundReport {
  id: string;
  type: ReportType;
  petName?: string;
  species: PetSpecies;
  breed?: string;
  primaryColor: string;
  lastSeenDate: string;
  location: string;
  city: string;
  description: string;
  photoUrl: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  isResolved: boolean;
  resolvedDate?: string;
  createdAt: string;
}

export interface CareArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: 'Nutrition' | 'Grooming' | 'Preventative Care' | 'Training & Behavior' | 'First Aid' | 'Puppy & Kitten';
  readTime: string;
  authorName: string;
  authorRole: string;
  publishedDate: string;
  imageUrl: string;
  tags: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  petContext?: {
    species?: string;
    age?: string;
    name?: string;
  };
  isUrgentAlert?: boolean;
}

export interface AdminStats {
  totalUsers: number;
  totalPets: number;
  totalVets: number;
  totalAppointments: number;
  totalAdoptions: number;
  totalLostFound: number;
  totalExpensesTracked: number;
  statusBreakdown: {
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
  monthlyRevenue: number;
}

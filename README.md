# PetCare – Smart Pet Appointment & Care Management System

PetCare is a centralized full-stack healthcare operating system and appointment scheduling platform for pet owners, board-certified veterinarians, and animal adoption sanctuaries.

---

## 🌟 Key Features

1. **Role-Based Access Control (RBAC)**:
   - **Pet Owner (e.g., Emily Watson)**: Register multiple companions, view digital vaccination passports, book vetted doctors, track pet expenses, and receive booster alerts.
   - **Veterinarian (e.g., Dr. Sarah Jenkins)**: Manage available time slots and fees, accept/decline consultations, issue digital prescriptions, and record physical examination vitals.
   - **Administrator (e.g., Admin Mark Foster)**: Real-time multi-tenant monitoring, review adoption inquiries, moderate lost & found community alerts, and manage user roles.

2. **Smart Conflict-Free Appointment Booking**:
   - Double-booking prevention algorithm that validates conflicting date and time slots on the server before persisting.
   - Status transitions: `Pending` ➔ `Confirmed` ➔ `Completed` or `Cancelled`.

3. **Digital Health Records & Vaccination Passports**:
   - Chronic allergy and microchip tracking.
   - Comprehensive vaccination status calculation: `Up to Date`, `Due Soon`, or `Overdue`.
   - Treatment notes, vital signs (weight, temperature), and prescription medication logs.

4. **Context-Aware AI Pet Care Assistant**:
   - Powered by Google Gemini 3.8 Flash.
   - Accepts pet species, breed, and age as contextual anchors.
   - Automated safety protocol: flags acute toxic emergencies (chocolate, lilies, rat poison, seizures) with urgent warnings.

5. **Pet Care Expense Tracker**:
   - Categorized by Food, Medical, Grooming, Medicine, Toys & Accessories, Boarding, and Other.
   - Visual KPI summaries and monthly expenditure breakdowns.

6. **Community Adoption & Lost/Found Finder**:
   - Verified rescue listings with microchip and spay/neuter verification.
   - Neighborhood lost & found community noticeboard with reunion resolution tracking.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Canvas Confetti
- **Backend**: Node.js, Express.js REST API
- **AI Integration**: Google Gemini 3.8 Flash (`@google/genai` TypeScript SDK)
- **Architecture**: Modular RESTful micro-routes with unified full-stack middleware

---

## 🚀 Step-by-Step Local Execution (Windows PowerShell)

```powershell
# 1. Clone repository
git clone https://github.com/your-username/petcare.git
cd petcare

# 2. Install dependencies
npm install

# 3. Configure environment variables
Copy-Item .env.example .env

# 4. Start Full-Stack Server
npm run dev

# 5. Open browser
http://localhost:3000
```

---

## 📋 REST API Endpoints

| Method | Route | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Authenticates user & returns token |
| `POST` | `/api/auth/register` | Public | Registers user with selected role |
| `GET` | `/api/pets` | Owner/Vet/Admin | Returns registered pets |
| `POST` | `/api/pets` | Owner | Registers new pet profile |
| `GET` | `/api/vets` | Public | Returns available veterinarians |
| `POST` | `/api/appointments` | Owner | Books appointment with slot conflict check |
| `PUT` | `/api/appointments/:id/status` | Vet/Admin | Updates status to Confirmed, Completed, Cancelled |
| `POST` | `/api/health-records` | Vet | Records clinical diagnosis & prescription |
| `POST` | `/api/vaccinations` | Vet/Owner | Logs vaccination booster & triggers reminder |
| `POST` | `/api/expenses` | Owner | Records pet-related financial expense |
| `POST` | `/api/ai/chat` | Authenticated | Server-side Gemini 3.8 Flash consultation |
| `POST` | `/api/adoption/:id/request` | Public/Owner | Submits adoption application |
| `POST` | `/api/lost-found` | Public/Owner | Files community lost or found report |
| `GET` | `/api/admin/stats` | Admin | Returns system metrics & revenue data |

---

## 🎓 College Viva Demonstration Script

1. **Architecture Explanation**: "PetCare is built on a full-stack REST architecture with strict Role-Based Access Control dividing Pet Owners, Veterinarians, and Administrators."
2. **Double-Booking Prevention**: "The appointment booking endpoint runs an atomic slot verification query on the server before committing, eliminating double-booking."
3. **Medical Safety in AI**: "The Gemini 3.8 Flash assistant runs server-side with system instructions guarding against prescribing dosages and automatically detecting toxic emergency symptoms like chocolate ingestion."

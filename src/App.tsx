/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { api } from './services/api.ts';
import {
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
  AppointmentStatus,
} from './types/index.ts';

// Modals
import { AddPetModal } from './components/modals/AddPetModal.tsx';
import { BookAppointmentModal } from './components/modals/BookAppointmentModal.tsx';
import { AddRecordModal } from './components/modals/AddRecordModal.tsx';
import { AddVaccineModal } from './components/modals/AddVaccineModal.tsx';
import { AddExpenseModal } from './components/modals/AddExpenseModal.tsx';
import { AdoptionRequestModal } from './components/modals/AdoptionRequestModal.tsx';
import { ReportLostFoundModal } from './components/modals/ReportLostFoundModal.tsx';
import { ArticleReaderModal } from './components/modals/ArticleReaderModal.tsx';
import { NotificationCenterModal } from './components/modals/NotificationCenterModal.tsx';
import { ProjectGuideModal } from './components/modals/ProjectGuideModal.tsx';
import { AuthModal } from './components/modals/AuthModal.tsx';

// Components & Views
import { Navbar } from './components/Navbar.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { LandingPage } from './components/LandingPage.tsx';
import { OwnerDashboard } from './components/OwnerDashboard.tsx';
import { VetDashboard } from './components/VetDashboard.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { PetsPage } from './components/PetsPage.tsx';
import { AppointmentsPage } from './components/AppointmentsPage.tsx';
import { HealthRecordsPage } from './components/HealthRecordsPage.tsx';
import { ExpensesPage } from './components/ExpensesPage.tsx';
import { AIAssistantPage } from './components/AIAssistantPage.tsx';
import { AdoptionPage } from './components/AdoptionPage.tsx';
import { LostFoundPage } from './components/LostFoundPage.tsx';
import { ArticlesPage } from './components/ArticlesPage.tsx';

function MainApplication() {
  const { currentUser, role, token } = useAuth();

  // Navigation tab
  const [currentTab, setCurrentTab] = useState<string>('landing');

  // Application Data States
  const [pets, setPets] = useState<Pet[]>([]);
  const [vets, setVets] = useState<Veterinarian[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [adoptionListings, setAdoptionListings] = useState<AdoptionListing[]>([]);
  const [adoptionRequests, setAdoptionRequests] = useState<AdoptionRequest[]>([]);
  const [lostFoundReports, setLostFoundReports] = useState<LostFoundReport[]>([]);
  const [careArticles, setCareArticles] = useState<CareArticle[]>([]);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [allUsers, setAllUsers] = useState<any[]>([]);

  // Modals visibility
  const [isAddPetOpen, setIsAddPetOpen] = useState(false);
  const [isBookAppointmentOpen, setIsBookAppointmentOpen] = useState(false);
  const [preselectedVetId, setPreselectedVetId] = useState<string | undefined>();
  const [preselectedPetId, setPreselectedPetId] = useState<string | undefined>();
  const [isAddRecordOpen, setIsAddRecordOpen] = useState(false);
  const [isAddVaccineOpen, setIsAddVaccineOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAdoptionRequestOpen, setIsAdoptionRequestOpen] = useState(false);
  const [selectedAdoptionListing, setSelectedAdoptionListing] = useState<AdoptionListing | null>(null);
  const [isReportLostFoundOpen, setIsReportLostFoundOpen] = useState(false);
  const [isArticleReaderOpen, setIsArticleReaderOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<CareArticle | null>(null);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [isProjectGuideOpen, setIsProjectGuideOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Toast / notification banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch all data
  const refreshData = async () => {
    try {
      const [
        pList,
        vList,
        aList,
        hrList,
        vacList,
        remList,
        expData,
        adpList,
        reqList,
        lfList,
        artList,
      ] = await Promise.all([
        api.getPets(role === 'admin' || role === 'vet'),
        api.getVets(),
        api.getAppointments(),
        api.getHealthRecords(),
        api.getVaccinations(),
        api.getReminders(),
        api.getExpenses(),
        api.getAdoptionListings(),
        api.getAdoptionRequests(),
        api.getLostFoundReports(),
        api.getArticles(),
      ]);

      setPets(pList);
      setVets(vList);
      setAppointments(aList);
      setHealthRecords(hrList);
      setVaccinations(vacList);
      setReminders(remList);
      setExpenses(expData.expenses);
      setAdoptionListings(adpList);
      setAdoptionRequests(reqList);
      setLostFoundReports(lfList);
      setCareArticles(artList);

      if (role === 'admin') {
        const [stats, uList] = await Promise.all([api.getAdminStats(), api.getAdminUsers()]);
        setAdminStats(stats);
        setAllUsers(uList);
      }
    } catch (err) {
      console.warn('Error fetching PetCare data:', err);
    }
  };

  useEffect(() => {
    refreshData();
  }, [role, token]);

  // Pet Handlers
  const handleCreatePet = async (petData: Partial<Pet>) => {
    await api.createPet(petData);
    showToast(`Registered pet "${petData.name}" successfully! Digital health passport initialized.`);
    refreshData();
  };

  const handleDeletePet = async (id: string) => {
    await api.deletePet(id);
    showToast('Pet profile and associated records removed.');
    refreshData();
  };

  // Appointment Handlers
  const handleBookAppointment = async (data: any) => {
    const res = await api.bookAppointment(data);
    showToast(res.message);
    refreshData();
  };

  const handleUpdateAppointmentStatus = async (
    id: string,
    status: AppointmentStatus,
    notes?: string
  ) => {
    await api.updateAppointmentStatus(id, status, notes);
    showToast(`Appointment status updated to ${status}.`);
    refreshData();
  };

  // Health Record & Vaccine Handlers
  const handleCreateHealthRecord = async (data: Partial<HealthRecord>) => {
    await api.createHealthRecord(data);
    showToast('Clinical consultation and prescription recorded.');
    refreshData();
  };

  const handleCreateVaccination = async (data: Partial<Vaccination>) => {
    await api.createVaccination(data);
    showToast('Vaccination logged. Automated reminder scheduled.');
    refreshData();
  };

  // Reminder Handlers
  const handleToggleReminder = async (id: string) => {
    await api.toggleReminder(id);
    refreshData();
  };

  const handleDeleteReminder = async (id: string) => {
    await api.deleteReminder(id);
    refreshData();
  };

  const handleCreateReminder = async (data: Partial<Reminder>) => {
    await api.createReminder(data);
    showToast('Scheduled care reminder added.');
    refreshData();
  };

  // Expense Handlers
  const handleCreateExpense = async (data: Partial<Expense>) => {
    await api.createExpense(data);
    showToast('Expense recorded successfully.');
    refreshData();
  };

  const handleDeleteExpense = async (id: string) => {
    await api.deleteExpense(id);
    showToast('Expense record removed.');
    refreshData();
  };

  // Adoption Handlers
  const handleSubmitAdoptionRequest = async (listingId: string, data: any) => {
    const res = await api.submitAdoptionRequest(listingId, data);
    showToast(res.message);
    refreshData();
  };

  const handleUpdateAdoptionRequest = async (id: string, status: string, notes?: string) => {
    await api.updateAdoptionRequest(id, status, notes);
    showToast(`Adoption inquiry marked as ${status}.`);
    refreshData();
  };

  // Lost & Found Handlers
  const handleCreateLostFound = async (data: Partial<LostFoundReport>) => {
    await api.createLostFoundReport(data);
    showToast('Community alert published successfully!');
    refreshData();
  };

  const handleResolveLostFound = async (id: string) => {
    await api.resolveLostFoundReport(id);
    showToast('Alert marked as reunited/resolved!');
    refreshData();
  };

  // Admin Handlers
  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    await api.updateUserRole(userId, newRole);
    showToast(`User role updated to ${newRole}.`);
    refreshData();
  };

  // Current Vet profile if role is vet
  const activeVet = vets.find((v) => v.email === currentUser?.email) || vets[0] || null;

  const pendingRemindersCount = reminders.filter((r) => !r.isCompleted).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#f8faf8] text-gray-900 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-emerald-800 text-white rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold border border-emerald-600 animate-slide-up">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Primary Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        unreadCount={pendingRemindersCount}
        onOpenNotifications={() => setIsNotificationCenterOpen(true)}
        onOpenProjectGuide={() => setIsProjectGuideOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Main Body */}
      {currentTab === 'landing' ? (
        <main className="flex-1">
          <LandingPage
            onGetStarted={() => setCurrentTab('dashboard')}
            onExploreServices={() => setCurrentTab('appointments')}
            vets={vets}
            articles={careArticles}
            adoptions={adoptionListings}
            onOpenProjectGuide={() => setIsProjectGuideOpen(true)}
            onSelectTab={setCurrentTab}
          />
        </main>
      ) : (
        <div className="flex-1 flex max-w-7xl w-full mx-auto">
          {/* Left Sidebar */}
          <Sidebar
            currentTab={currentTab}
            onSelectTab={setCurrentTab}
            onOpenProjectGuide={() => setIsProjectGuideOpen(true)}
          />

          {/* Center Dynamic Content Area */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {currentTab === 'dashboard' && role === 'owner' && (
              <OwnerDashboard
                pets={pets}
                appointments={appointments}
                vaccinations={vaccinations}
                reminders={reminders}
                expenses={expenses}
                healthRecords={healthRecords}
                onOpenAddPet={() => setIsAddPetOpen(true)}
                onOpenBookAppointment={() => {
                  setPreselectedPetId(undefined);
                  setPreselectedVetId(undefined);
                  setIsBookAppointmentOpen(true);
                }}
                onOpenAddExpense={() => setIsAddExpenseOpen(true)}
                onSelectTab={setCurrentTab}
                onSelectPet={(p) => {
                  setPreselectedPetId(p.id);
                  setCurrentTab('pets');
                }}
                onToggleReminder={handleToggleReminder}
              />
            )}

            {currentTab === 'dashboard' && role === 'vet' && (
              <VetDashboard
                vet={activeVet}
                appointments={appointments}
                pets={pets}
                onOpenAddRecord={(petId) => {
                  setPreselectedPetId(petId);
                  setIsAddRecordOpen(true);
                }}
                onUpdateStatus={handleUpdateAppointmentStatus}
                onUpdateAvailability={async (id, data) => {
                  await api.updateVetAvailability(id, data);
                  showToast('Availability settings updated.');
                  refreshData();
                }}
                onSelectTab={setCurrentTab}
              />
            )}

            {currentTab === 'dashboard' && role === 'admin' && (
              <AdminDashboard
                stats={adminStats}
                users={allUsers}
                adoptionRequests={adoptionRequests}
                appointments={appointments}
                lostFoundReports={lostFoundReports}
                onUpdateUserRole={handleUpdateUserRole}
                onUpdateAdoptionRequest={handleUpdateAdoptionRequest}
                onSelectTab={setCurrentTab}
              />
            )}

            {currentTab === 'pets' && (
              <PetsPage
                pets={pets}
                vaccinations={vaccinations}
                healthRecords={healthRecords}
                onOpenAddPet={() => setIsAddPetOpen(true)}
                onDeletePet={handleDeletePet}
                onBookForPet={(petId) => {
                  setPreselectedPetId(petId);
                  setIsBookAppointmentOpen(true);
                }}
              />
            )}

            {currentTab === 'appointments' && (
              <AppointmentsPage
                appointments={appointments}
                onOpenBookAppointment={() => {
                  setPreselectedPetId(undefined);
                  setPreselectedVetId(undefined);
                  setIsBookAppointmentOpen(true);
                }}
                onUpdateStatus={handleUpdateAppointmentStatus}
              />
            )}

            {currentTab === 'health' && (
              <HealthRecordsPage
                pets={pets}
                healthRecords={healthRecords}
                vaccinations={vaccinations}
                onOpenAddRecord={() => setIsAddRecordOpen(true)}
                onOpenAddVaccine={() => setIsAddVaccineOpen(true)}
              />
            )}

            {currentTab === 'expenses' && (
              <ExpensesPage
                expenses={expenses}
                pets={pets}
                onOpenAddExpense={() => setIsAddExpenseOpen(true)}
                onDeleteExpense={handleDeleteExpense}
              />
            )}

            {currentTab === 'ai' && (
              <AIAssistantPage
                pets={pets}
                onOpenBookAppointment={() => {
                  setPreselectedPetId(undefined);
                  setIsBookAppointmentOpen(true);
                }}
              />
            )}

            {currentTab === 'adoption' && (
              <AdoptionPage
                listings={adoptionListings}
                onOpenApply={(listing) => {
                  setSelectedAdoptionListing(listing);
                  setIsAdoptionRequestOpen(true);
                }}
                onOpenCreateListing={() => {
                  showToast('Authorized shelter/admin listing creation opened.');
                  setSelectedAdoptionListing(null);
                  setIsAdoptionRequestOpen(true);
                }}
              />
            )}

            {currentTab === 'lost-found' && (
              <LostFoundPage
                reports={lostFoundReports}
                onOpenReportModal={() => setIsReportLostFoundOpen(true)}
                onResolveReport={handleResolveLostFound}
              />
            )}

            {currentTab === 'articles' && (
              <ArticlesPage
                articles={careArticles}
                onReadArticle={(art) => {
                  setSelectedArticle(art);
                  setIsArticleReaderOpen(true);
                }}
                canCreate={role === 'admin' || role === 'vet'}
                onOpenCreateArticle={() => {
                  showToast('Article authoring system active.');
                }}
              />
            )}
          </main>
        </div>
      )}

      {/* Application Modals */}
      <AddPetModal
        isOpen={isAddPetOpen}
        onClose={() => setIsAddPetOpen(false)}
        onSave={handleCreatePet}
      />

      <BookAppointmentModal
        isOpen={isBookAppointmentOpen}
        onClose={() => setIsBookAppointmentOpen(false)}
        pets={pets}
        vets={vets}
        preselectedVetId={preselectedVetId}
        preselectedPetId={preselectedPetId}
        onBook={handleBookAppointment}
      />

      <AddRecordModal
        isOpen={isAddRecordOpen}
        onClose={() => setIsAddRecordOpen(false)}
        pets={pets}
        preselectedPetId={preselectedPetId}
        onSave={handleCreateHealthRecord}
      />

      <AddVaccineModal
        isOpen={isAddVaccineOpen}
        onClose={() => setIsAddVaccineOpen(false)}
        pets={pets}
        preselectedPetId={preselectedPetId}
        onSave={handleCreateVaccination}
      />

      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        pets={pets}
        onSave={handleCreateExpense}
      />

      <AdoptionRequestModal
        isOpen={isAdoptionRequestOpen}
        onClose={() => {
          setIsAdoptionRequestOpen(false);
          setSelectedAdoptionListing(null);
        }}
        listing={selectedAdoptionListing}
        onSubmit={handleSubmitAdoptionRequest}
      />

      <ReportLostFoundModal
        isOpen={isReportLostFoundOpen}
        onClose={() => setIsReportLostFoundOpen(false)}
        onSave={handleCreateLostFound}
      />

      <ArticleReaderModal
        isOpen={isArticleReaderOpen}
        onClose={() => {
          setIsArticleReaderOpen(false);
          setSelectedArticle(null);
        }}
        article={selectedArticle}
      />

      <NotificationCenterModal
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
        reminders={reminders}
        pets={pets}
        onToggleReminder={handleToggleReminder}
        onDeleteReminder={handleDeleteReminder}
        onCreateReminder={handleCreateReminder}
      />

      <ProjectGuideModal
        isOpen={isProjectGuideOpen}
        onClose={() => setIsProjectGuideOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApplication />
    </AuthProvider>
  );
}

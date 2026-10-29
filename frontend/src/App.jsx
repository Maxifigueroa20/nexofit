import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Skeleton } from 'boneyard-js/react';
import Container from 'react-bootstrap/Container';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import OwnerDashboard from './components/admin/OwnerDashboard';
import ClientCatalog from './components/catalog/ClientCatalog';
import LoginView from './components/auth/LoginView';
import RegisterView from './components/auth/RegisterView';
import Toast from './components/common/Toast';
import AdSidebar from './components/layout/AdSidebar';
import PremiumModal from './components/admin/PremiumModal';
import useSSE from './hooks/useSSE';
import { useAppStore } from './store/useAppStore';
import { getApiUrl } from './config/api';

export default function App() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    currentUser,
    currentInstitution,
    setAuth,
    setCurrentInstitution,
    logout,
    liveToast,
    showToast,
    clearToast,
    isManualModalOpen,
    setManualModalOpen,
    isPremiumModalOpen,
    setPremiumModalOpen,
    members,
    setMembers,
    addMember,
    updateMember,
    institutions,
    setInstitutions,
    clientMemberships,
    setClientMemberships
  } = useAppStore();

  const [newlyAddedId, setNewlyAddedId] = useState(null);

  const [ownerSearch, setOwnerSearch] = useState('');
  const [ownerStatusFilter, setOwnerStatusFilter] = useState('ALL');
  const [ownerSourceFilter, setOwnerSourceFilter] = useState('ALL');

  const [clientCategory, setClientCategory] = useState('ALL');
  const [clientSearch, setClientSearch] = useState('');
  const [clientNeighborhood, setClientNeighborhood] = useState('ALL');
  const [clientShift, setClientShift] = useState('ALL');

  const { data: institutionsData, isLoading: isLoadingInstitutions } = useQuery({
    queryKey: ['institutions'],
    queryFn: async () => {
      const res = await fetch(getApiUrl('/api/institutions'));
      if (!res.ok) throw new Error('Error al cargar instituciones');
      return res.json();
    },
    enabled: Boolean(currentUser)
  });

  const { data: ownerMembersData, isLoading: isLoadingOwnerMembers } = useQuery({
    queryKey: ['ownerMembers', currentUser?.institutionId],
    queryFn: async () => {
      const res = await fetch(getApiUrl(`/api/institutions/${currentUser.institutionId}/members`));
      if (!res.ok) throw new Error('Error al cargar socios');
      return res.json();
    },
    enabled: Boolean(currentUser?.role === 'OWNER' && currentUser?.institutionId)
  });

  const { data: clientMembershipsData, isLoading: isLoadingMemberships } = useQuery({
    queryKey: ['clientMemberships', currentUser?.dni],
    queryFn: async () => {
      const res = await fetch(getApiUrl(`/api/members/by-dni/${currentUser.dni}`));
      if (!res.ok) throw new Error('Error al cargar membresías');
      return res.json();
    },
    enabled: Boolean(currentUser?.role === 'CLIENT' && currentUser?.dni)
  });

  const { data: currentInstData } = useQuery({
    queryKey: ['currentInstitution', currentUser?.institutionId],
    queryFn: async () => {
      const res = await fetch(getApiUrl(`/api/institutions/${currentUser.institutionId}`));
      if (!res.ok) throw new Error('Error al cargar institución');
      return res.json();
    },
    enabled: Boolean(currentUser?.role === 'OWNER' && currentUser?.institutionId)
  });

  useEffect(() => {
    if (institutionsData) {
      setInstitutions(institutionsData);
    }
  }, [institutionsData, setInstitutions]);

  useEffect(() => {
    if (ownerMembersData) {
      setMembers(ownerMembersData);
    }
  }, [ownerMembersData, setMembers]);

  useEffect(() => {
    if (clientMembershipsData) {
      setClientMemberships(clientMembershipsData);
    }
  }, [clientMembershipsData, setClientMemberships]);

  useEffect(() => {
    if (currentInstData) {
      setCurrentInstitution(currentInstData);
    }
  }, [currentInstData, setCurrentInstitution]);

  const handleServerEvent = useCallback(
    (event) => {
      if (event.type === 'NEW_MEMBER') {
        const { institutionId, institutionName, member } = event.payload;

        if (currentUser?.role === 'OWNER' && currentUser?.institutionId === institutionId) {
          addMember(member);
          setNewlyAddedId(member.id);
          setTimeout(() => setNewlyAddedId(null), 4000);
          showToast(
            `Nuevo Socio en ${institutionName}`,
            `${member.fullName} (${member.dni}) contratado: ${member.planName}`
          );
        }

        queryClient.invalidateQueries({ queryKey: ['institutions'] });
        queryClient.invalidateQueries({ queryKey: ['ownerMembers'] });
        queryClient.invalidateQueries({ queryKey: ['clientMemberships'] });
      }

      if (event.type === 'PAYMENT_STATUS_CHANGED') {
        const { member } = event.payload;
        if (currentUser?.role === 'OWNER' && currentUser?.institutionId === member.institutionId) {
          updateMember(member);
        }
        queryClient.invalidateQueries({ queryKey: ['ownerMembers'] });
        queryClient.invalidateQueries({ queryKey: ['clientMemberships'] });
      }

      if (event.type === 'ATTENDANCE_RECORDED') {
        const { member } = event.payload;
        if (currentUser?.role === 'OWNER' && currentUser?.institutionId === member.institutionId) {
          updateMember(member);
        }
        queryClient.invalidateQueries({ queryKey: ['ownerMembers'] });
      }

      if (event.type === 'INSTITUTION_UPDATED') {
        queryClient.invalidateQueries({ queryKey: ['institutions'] });
        queryClient.invalidateQueries({ queryKey: ['currentInstitution'] });
      }

      if (event.type === 'DB_RESET') {
        queryClient.invalidateQueries({ queryKey: ['institutions'] });
        queryClient.invalidateQueries({ queryKey: ['ownerMembers'] });
        queryClient.invalidateQueries({ queryKey: ['clientMemberships'] });
        queryClient.invalidateQueries({ queryKey: ['currentInstitution'] });
        showToast('Base Restablecida', 'Los datos volvieron a las semillas iniciales de Jujuy.');
      }
    },
    [currentUser, addMember, updateMember, showToast, queryClient]
  );

  useSSE(handleServerEvent);

  const handleLoginSuccess = (user, institution) => {
    setAuth(user, institution);
    queryClient.invalidateQueries();
  };

  const handleRegisterSuccess = (user, institution) => {
    setAuth(user, institution);
    queryClient.invalidateQueries();
    showToast('¡Registro Exitoso!', `Bienvenido a NexoFit, ${user.name}. Tu cuenta ya se encuentra activa.`);
  };

  const handleLogout = () => {
    logout();
    queryClient.clear();
    navigate('/login');
  };

  const handleResetSeeds = async () => {
    try {
      await fetch(getApiUrl('/api/reset-seeds'), { method: 'POST' });
      queryClient.invalidateQueries();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEnrollSuccess = useCallback(
    (_newMember, _instId, instName) => {
      queryClient.invalidateQueries({ queryKey: ['institutions'] });
      queryClient.invalidateQueries({ queryKey: ['clientMemberships'] });
      showToast(
        '¡Solicitud Registrada!',
        `Te has asociado exitosamente a ${instName}. Tu inscripción ya figura en la sede.`
      );
    },
    [queryClient, showToast]
  );

  const handlePremiumActivated = (updatedInstitution) => {
    setCurrentInstitution(updatedInstitution);
    queryClient.invalidateQueries({ queryKey: ['institutions'] });
    queryClient.invalidateQueries({ queryKey: ['currentInstitution'] });
    showToast(
      updatedInstitution.isPremium ? '¡Modo Premium Activado!' : 'Modo Premium Desactivado',
      updatedInstitution.isPremium
        ? `${updatedInstitution.name} ahora figura en el Catálogo con distintivo de Sede Destacada.`
        : `${updatedInstitution.name} volvió a la modalidad regular.`
    );
  };

  const filteredOwnerMembers = members.filter((m) => {
    const q = ownerSearch.toLowerCase();
    const matchesSearch =
      m.fullName.toLowerCase().includes(q) ||
      m.dni.toLowerCase().includes(q) ||
      m.id.toLowerCase().includes(q) ||
      (m.email && m.email.toLowerCase().includes(q));

    const matchesStatus = ownerStatusFilter === 'ALL' || m.paymentStatus === ownerStatusFilter;
    const matchesSource = ownerSourceFilter === 'ALL' || m.source === ownerSourceFilter;

    return matchesSearch && matchesStatus && matchesSource;
  });

  const filteredInstitutions = institutions
    .filter((inst) => {
      const matchesCat =
        clientCategory === 'ALL' ||
        inst.category === clientCategory;

      const matchesNeighborhood =
        clientNeighborhood === 'ALL' ||
        inst.neighborhood === clientNeighborhood;

      const matchesShift =
        clientShift === 'ALL' ||
        (Array.isArray(inst.shifts) && inst.shifts.includes(clientShift));

      const q = clientSearch.toLowerCase();
      const matchesSearch =
        inst.name.toLowerCase().includes(q) ||
        inst.address.toLowerCase().includes(q) ||
        (inst.neighborhood && inst.neighborhood.toLowerCase().includes(q)) ||
        inst.tagline.toLowerCase().includes(q);

      return matchesCat && matchesNeighborhood && matchesShift && matchesSearch;
    })
    .sort((a, b) => {
      if (currentUser?.role === 'CLIENT') {
        const aMatchBarrio = Boolean(currentUser.neighborhood && a.neighborhood === currentUser.neighborhood);
        const bMatchBarrio = Boolean(currentUser.neighborhood && b.neighborhood === currentUser.neighborhood);

        const aMatchTurno = Boolean(currentUser.preferredShift && Array.isArray(a.shifts) && a.shifts.includes(currentUser.preferredShift));
        const bMatchTurno = Boolean(currentUser.preferredShift && Array.isArray(b.shifts) && b.shifts.includes(currentUser.preferredShift));

        const aHasMatch = aMatchBarrio || aMatchTurno;
        const bHasMatch = bMatchBarrio || bMatchTurno;

        let aScore = (aMatchBarrio ? 3 : 0) + (aMatchTurno ? 2 : 0);
        let bScore = (bMatchBarrio ? 3 : 0) + (bMatchTurno ? 2 : 0);

        if (aHasMatch && a.isPremium) aScore += 1.5;
        if (bHasMatch && b.isPremium) bScore += 1.5;

        if (bScore !== aScore) {
          return bScore - aScore;
        }

        if (a.isPremium && !b.isPremium) return -1;
        if (!a.isPremium && b.isPremium) return 1;

        return a.name.localeCompare(b.name);
      }

      if (a.isPremium && !b.isPremium) return -1;
      if (!a.isPremium && b.isPremium) return 1;
      return a.name.localeCompare(b.name);
    });

  const ownerFiltersProp = {
    searchTerm: ownerSearch,
    setSearchTerm: setOwnerSearch,
    statusFilter: ownerStatusFilter,
    setStatusFilter: setOwnerStatusFilter,
    sourceFilter: ownerSourceFilter,
    setSourceFilter: setOwnerSourceFilter
  };

  const clientFiltersProp = {
    selectedCategory: clientCategory,
    setSelectedCategory: setClientCategory,
    selectedNeighborhood: clientNeighborhood,
    setSelectedNeighborhood: setClientNeighborhood,
    selectedShift: clientShift,
    setSelectedShift: setClientShift,
    searchTerm: clientSearch,
    setSearchTerm: setClientSearch,
    filteredCount: filteredInstitutions.length,
    totalCount: institutions.length
  };

  if (!currentUser) {
    return (
      <Routes>
        <Route
          path="/login"
          element={
            <LoginView
              onLoginSuccess={handleLoginSuccess}
              onNavigateToRegister={() => navigate('/register')}
            />
          }
        />
        <Route
          path="/register"
          element={
            <RegisterView
              onRegisterSuccess={handleRegisterSuccess}
              onNavigateToLogin={() => navigate('/login')}
            />
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Container className="py-4">
      <div className="app-window">
        <Header currentUser={currentUser} currentInstitution={currentInstitution} />

        <div className="app-window-body">
          <Sidebar
            role={currentUser.role}
            institution={currentInstitution}
            members={members}
            onOpenManualModal={() => setManualModalOpen(true)}
            onOpenPremiumModal={() => setPremiumModalOpen(true)}
            onResetSeeds={handleResetSeeds}
            onLogout={handleLogout}
            ownerFilters={ownerFiltersProp}
            clientFilters={clientFiltersProp}
          />

          <main className="app-main">
            <Routes>
              {currentUser.role === 'OWNER' ? (
                <>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route
                    path="/dashboard"
                    element={
                      <Skeleton name="owner-dashboard" loading={isLoadingOwnerMembers || !currentInstitution}>
                        {currentInstitution ? (
                          <OwnerDashboard
                            institution={currentInstitution}
                            filteredMembers={filteredOwnerMembers}
                            totalMembersCount={members.length}
                            activeTab="audit-table"
                            newlyAddedId={newlyAddedId}
                            isManualModalOpen={isManualModalOpen}
                            setIsManualModalOpen={setManualModalOpen}
                            onMemberUpdate={updateMember}
                            onMemberCreated={addMember}
                          />
                        ) : (
                          <div className="p-4 text-center text-muted">
                            Conectando con el servidor...
                          </div>
                        )}
                      </Skeleton>
                    }
                  />
                  <Route
                    path="/dashboard/terms"
                    element={
                      <Skeleton name="owner-terms" loading={!currentInstitution}>
                        {currentInstitution ? (
                          <OwnerDashboard
                            institution={currentInstitution}
                            filteredMembers={filteredOwnerMembers}
                            totalMembersCount={members.length}
                            activeTab="terms-and-conditions"
                            newlyAddedId={newlyAddedId}
                            isManualModalOpen={isManualModalOpen}
                            setIsManualModalOpen={setManualModalOpen}
                            onMemberUpdate={updateMember}
                            onMemberCreated={addMember}
                          />
                        ) : (
                          <div className="p-4 text-center text-muted">
                            Conectando con el servidor...
                          </div>
                        )}
                      </Skeleton>
                    }
                  />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </>
              ) : (
                <>
                  <Route path="/" element={<Navigate to="/catalog" replace />} />
                  <Route
                    path="/catalog"
                    element={
                      <Skeleton name="client-catalog" loading={isLoadingInstitutions}>
                        <ClientCatalog
                          currentUser={currentUser}
                          institutions={institutions}
                          filteredInstitutions={filteredInstitutions}
                          clientMemberships={clientMemberships}
                          activeTab="catalog"
                          onEnrollSuccess={handleEnrollSuccess}
                        />
                      </Skeleton>
                    }
                  />
                  <Route
                    path="/my-memberships"
                    element={
                      <Skeleton name="client-memberships" loading={isLoadingMemberships}>
                        <ClientCatalog
                          currentUser={currentUser}
                          institutions={institutions}
                          filteredInstitutions={filteredInstitutions}
                          clientMemberships={clientMemberships}
                          activeTab="my-memberships"
                          onEnrollSuccess={handleEnrollSuccess}
                        />
                      </Skeleton>
                    }
                  />
                  <Route
                    path="/terms"
                    element={
                      <ClientCatalog
                        currentUser={currentUser}
                        institutions={institutions}
                        filteredInstitutions={filteredInstitutions}
                        clientMemberships={clientMemberships}
                        activeTab="terms-and-conditions"
                        onEnrollSuccess={handleEnrollSuccess}
                      />
                    }
                  />
                  <Route path="*" element={<Navigate to="/catalog" replace />} />
                </>
              )}
            </Routes>
          </main>

          {currentUser.role === 'CLIENT' && <AdSidebar />}
        </div>
      </div>

      {currentUser.role === 'OWNER' && currentInstitution && (
        <PremiumModal
          isOpen={isPremiumModalOpen}
          onClose={() => setPremiumModalOpen(false)}
          institution={currentInstitution}
          onPremiumActivated={handlePremiumActivated}
        />
      )}

      <Toast notification={liveToast} onClose={clearToast} />
    </Container>
  );
}

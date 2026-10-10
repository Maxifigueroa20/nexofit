import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import OwnerDashboard from './components/admin/OwnerDashboard';
import ClientCatalog from './components/catalog/ClientCatalog';
import LoginView from './components/auth/LoginView';
import Toast from './components/common/Toast';
import useSSE from './hooks/useSSE';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('nexofit_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [currentInstitution, setCurrentInstitution] = useState(() => {
    try {
      const saved = localStorage.getItem('nexofit_institution');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState(() => {
    try {
      const savedUser = localStorage.getItem('nexofit_user');
      if (savedUser) {
        const u = JSON.parse(savedUser);
        return u.role === 'OWNER' ? 'audit-table' : 'catalog';
      }
    } catch {}
    return 'audit-table';
  });

  const [currentMembers, setCurrentMembers] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [clientMemberships, setClientMemberships] = useState([]);
  const [liveToast, setLiveToast] = useState(null);
  const [newlyAddedId, setNewlyAddedId] = useState(null);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  const [ownerSearch, setOwnerSearch] = useState('');
  const [ownerStatusFilter, setOwnerStatusFilter] = useState('ALL');
  const [ownerSourceFilter, setOwnerSourceFilter] = useState('ALL');

  const [clientCategory, setClientCategory] = useState('ALL');
  const [clientSearch, setClientSearch] = useState('');

  const loadOwnerMembers = useCallback(async (instId) => {
    if (!instId) return;
    try {
      const res = await fetch(`/api/institutions/${instId}/members`);
      if (res.ok) {
        const data = await res.json();
        setCurrentMembers(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const loadInstitutions = useCallback(async () => {
    try {
      const res = await fetch('/api/institutions');
      if (res.ok) {
        const data = await res.json();
        setInstitutions(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const loadClientMemberships = useCallback(async (dni) => {
    if (!dni) return;
    try {
      const res = await fetch(`/api/members/by-dni/${dni}`);
      if (res.ok) {
        const data = await res.json();
        setClientMemberships(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (currentUser?.role === 'OWNER' && currentUser?.institutionId) {
      loadOwnerMembers(currentUser.institutionId);
      fetch(`/api/institutions/${currentUser.institutionId}`)
        .then((r) => r.json())
        .then((data) => {
          if (!data.error) {
            setCurrentInstitution(data);
            localStorage.setItem('nexofit_institution', JSON.stringify(data));
          }
        })
        .catch(console.error);
    } else if (currentUser?.role === 'CLIENT') {
      loadInstitutions();
      if (currentUser?.dni) {
        loadClientMemberships(currentUser.dni);
      }
    }
  }, [currentUser, loadOwnerMembers, loadInstitutions, loadClientMemberships]);

  const handleServerEvent = useCallback(
    (event) => {
      if (event.type === 'NEW_MEMBER') {
        const { institutionId, institutionName, member } = event.payload;

        if (currentUser?.role === 'OWNER' && currentUser?.institutionId === institutionId) {
          setCurrentMembers((prev) =>
            prev.some((m) => m.id === member.id) ? prev : [member, ...prev]
          );
          setNewlyAddedId(member.id);
          setTimeout(() => setNewlyAddedId(null), 4000);

          setLiveToast({
            title: `Nuevo Socio en ${institutionName}`,
            body: `${member.fullName} (${member.dni}) contratado: ${member.planName}`
          });
          setTimeout(() => setLiveToast(null), 6000);
        }

        if (currentUser?.role === 'CLIENT') {
          loadInstitutions();
          if (currentUser?.dni) {
            loadClientMemberships(currentUser.dni);
          }
        }
      }

      if (event.type === 'PAYMENT_STATUS_CHANGED') {
        const { member } = event.payload;
        if (currentUser?.role === 'OWNER' && currentUser?.institutionId === member.institutionId) {
          setCurrentMembers((prev) =>
            prev.map((m) => (m.id === member.id ? member : m))
          );
        }
        if (currentUser?.role === 'CLIENT' && currentUser?.dni) {
          loadClientMemberships(currentUser.dni);
        }
      }

      if (event.type === 'ATTENDANCE_RECORDED') {
        const { member } = event.payload;
        if (currentUser?.role === 'OWNER' && currentUser?.institutionId === member.institutionId) {
          setCurrentMembers((prev) =>
            prev.map((m) => (m.id === member.id ? member : m))
          );
        }
      }

      if (event.type === 'DB_RESET') {
        if (currentUser?.role === 'OWNER' && currentUser?.institutionId) {
          loadOwnerMembers(currentUser.institutionId);
        }
        if (currentUser?.role === 'CLIENT') {
          loadInstitutions();
          if (currentUser?.dni) {
            loadClientMemberships(currentUser.dni);
          }
        }
        setLiveToast({
          title: 'Datos Restablecidos',
          body: 'Se recargaron los seeds originales.'
        });
        setTimeout(() => setLiveToast(null), 4000);
      }
    },
    [currentUser, loadOwnerMembers, loadInstitutions, loadClientMemberships]
  );

  useSSE(handleServerEvent);

  const handleLoginSuccess = (user, institution) => {
    setCurrentUser(user);
    setCurrentInstitution(institution);
    localStorage.setItem('nexofit_user', JSON.stringify(user));
    if (institution) {
      localStorage.setItem('nexofit_institution', JSON.stringify(institution));
    } else {
      localStorage.removeItem('nexofit_institution');
    }
    setActiveTab(user.role === 'OWNER' ? 'audit-table' : 'catalog');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentInstitution(null);
    localStorage.removeItem('nexofit_user');
    localStorage.removeItem('nexofit_institution');
  };

  const handleResetSeeds = async () => {
    try {
      await fetch('/api/reset-seeds', { method: 'POST' });
    } catch (err) {
      console.error(err);
    }
  };

  if (!currentUser) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  const filteredOwnerMembers = currentMembers.filter((m) => {
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

  const filteredInstitutions = institutions.filter((inst) => {
    const matchesCat =
      clientCategory === 'ALL' ||
      inst.category === clientCategory;

    const q = clientSearch.toLowerCase();
    const matchesSearch =
      inst.name.toLowerCase().includes(q) ||
      inst.address.toLowerCase().includes(q) ||
      inst.tagline.toLowerCase().includes(q);

    return matchesCat && matchesSearch;
  });

  const ownerFiltersProp = {
    searchTerm: ownerSearch,
    setSearchTerm: setOwnerSearch,
    statusFilter: ownerStatusFilter,
    setStatusFilter: setOwnerStatusFilter,
    sourceFilter: ownerSourceFilter,
    setSourceFilter: setOwnerSourceFilter,
    totalCount: currentMembers.length,
    filteredCount: filteredOwnerMembers.length
  };

  const clientFiltersProp = {
    category: clientCategory,
    setCategory: setClientCategory,
    search: clientSearch,
    setSearch: setClientSearch,
    totalCount: institutions.length,
    filteredCount: filteredInstitutions.length
  };

  return (
    <div className="container py-4">
      <div className="aero-window">
        <Header
          currentUser={currentUser}
          currentInstitution={currentInstitution}
        />

        <div className="aero-window-body">
          <Sidebar
            role={currentUser.role}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            institution={currentInstitution}
            members={currentMembers}
            onOpenManualModal={() => setIsManualModalOpen(true)}
            onResetSeeds={handleResetSeeds}
            onLogout={handleLogout}
            ownerFilters={ownerFiltersProp}
            clientFilters={clientFiltersProp}
          />

          <main className="aero-main">
            {currentUser.role === 'OWNER' && currentInstitution ? (
              <OwnerDashboard
                institution={currentInstitution}
                filteredMembers={filteredOwnerMembers}
                activeTab={activeTab}
                newlyAddedId={newlyAddedId}
                isManualModalOpen={isManualModalOpen}
                setIsManualModalOpen={setIsManualModalOpen}
                onMemberUpdate={(updated) => {
                  setCurrentMembers((prev) =>
                    prev.map((m) => (m.id === updated.id ? updated : m))
                  );
                }}
                onMemberCreated={(created) => {
                  setCurrentMembers((prev) =>
                    prev.some((m) => m.id === created.id) ? prev : [created, ...prev]
                  );
                }}
              />
            ) : currentUser.role === 'CLIENT' ? (
              <ClientCatalog
                currentUser={currentUser}
                institutions={institutions}
                filteredInstitutions={filteredInstitutions}
                clientMemberships={clientMemberships}
                activeTab={activeTab}
                onEnrollSuccess={(newMember, instId, instName) => {
                  loadInstitutions();
                  if (currentUser?.dni) {
                    loadClientMemberships(currentUser.dni);
                  }
                  setLiveToast({
                    title: 'Inscripción Confirmada',
                    body: `Te has afiliado a ${instName}. Tu alta ya se reflejó en tiempo real en el padrón del dueño.`
                  });
                  setTimeout(() => setLiveToast(null), 6000);
                }}
              />
            ) : (
              <div className="p-4 text-center text-muted">
                Cargando perfil...
              </div>
            )}
          </main>
        </div>
      </div>

      <Toast notification={liveToast} onClose={() => setLiveToast(null)} />
    </div>
  );
}

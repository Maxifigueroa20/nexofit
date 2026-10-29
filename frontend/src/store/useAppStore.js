import { create } from 'zustand';

const getStoredUser = () => {
  try {
    const saved = localStorage.getItem('nexofit_user');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const getStoredInstitution = () => {
  try {
    const saved = localStorage.getItem('nexofit_institution');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

export const useAppStore = create((set) => ({
  currentUser: getStoredUser(),
  currentInstitution: getStoredInstitution(),

  setAuth: (user, institution) => {
    set({ currentUser: user, currentInstitution: institution });
    if (user) {
      localStorage.setItem('nexofit_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('nexofit_user');
    }
    if (institution) {
      localStorage.setItem('nexofit_institution', JSON.stringify(institution));
    } else {
      localStorage.removeItem('nexofit_institution');
    }
  },

  setCurrentInstitution: (institution) => {
    set({ currentInstitution: institution });
    if (institution) {
      localStorage.setItem('nexofit_institution', JSON.stringify(institution));
    } else {
      localStorage.removeItem('nexofit_institution');
    }
  },

  logout: () => {
    localStorage.removeItem('nexofit_user');
    localStorage.removeItem('nexofit_institution');
    set({ currentUser: null, currentInstitution: null });
  },

  liveToast: null,
  showToast: (title, body) => set({ liveToast: { title, body } }),
  clearToast: () => set({ liveToast: null }),

  isManualModalOpen: false,
  setManualModalOpen: (isOpen) => set({ isManualModalOpen: isOpen }),

  isPremiumModalOpen: false,
  setPremiumModalOpen: (isOpen) => set({ isPremiumModalOpen: isOpen }),

  members: [],
  setMembers: (members) => set({ members }),
  addMember: (member) =>
    set((state) => ({
      members: state.members.some((m) => m.id === member.id)
        ? state.members
        : [member, ...state.members]
    })),
  updateMember: (member) =>
    set((state) => ({
      members: state.members.map((m) => (m.id === member.id ? member : m))
    })),

  institutions: [],
  setInstitutions: (institutions) => set({ institutions }),

  clientMemberships: [],
  setClientMemberships: (clientMemberships) => set({ clientMemberships })
}));


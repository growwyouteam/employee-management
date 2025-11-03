import { create } from 'zustand';

const useUIStore = create((set) => ({
  sidebarOpen: true,
  mobileMenuOpen: false,
  theme: 'light',
  notifications: [],

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  
  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
  
  closeMobileMenu: () => set({ mobileMenuOpen: false }),
  
  setTheme: (theme) => set({ theme }),
  
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        { id: Date.now(), ...notification },
      ],
    })),
  
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  
  clearNotifications: () => set({ notifications: [] }),
}));

export default useUIStore;

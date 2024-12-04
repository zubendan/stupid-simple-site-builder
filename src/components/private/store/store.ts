import deepmerge from 'deepmerge';
import { type User } from 'next-auth';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export type TDashboardStoreValues = {
  isSidebarCollapsed: boolean;
  isImpersonating: boolean;
  user: User | null;
};

export type TDashboardStoreActions = {
  setIsSidebarCollapsed: (isSidebarCollapsed: boolean) => void;
  toggleSidebarCollapsed: () => void;
  setIsImpersonating: (isImpersonating: boolean) => void;
  setUser: (user: TDashboardStoreValues['user']) => void;
};

export type TDashboardStore = TDashboardStoreValues & TDashboardStoreActions;

export const defaultInitState: TDashboardStoreValues = {
  isSidebarCollapsed: false,
  isImpersonating: false,
  user: null,
};

export const createDashboardStore = (
  initState?: Partial<TDashboardStoreValues>,
) => {
  return create<TDashboardStore>()(
    persist(
      immer(
        devtools(
          (set) => ({
            ...defaultInitState,
            ...initState,
            setIsSidebarCollapsed: (isSidebarCollapsed) =>
              set(
                (state) => {
                  state.isSidebarCollapsed = isSidebarCollapsed;
                },
                true,
                'setIsSidebarCollapsed',
              ),
            toggleSidebarCollapsed: () =>
              set(
                (state) => {
                  state.isSidebarCollapsed = !state.isSidebarCollapsed;
                },
                true,
                'toggleSidebarCollapsed',
              ),
            setIsImpersonating: (isImpersonating) =>
              set(
                (state) => {
                  state.isImpersonating = isImpersonating;
                },
                true,
                'setIsImpersonating',
              ),
            setUser: (user) =>
              set(
                (state) => {
                  state.user = user;
                },
                true,
                'setUser',
              ),
          }),
          {
            name: 'DashboardStore',
            enabled: process.env.NODE_ENV === 'development',
          },
        ),
      ),
      {
        name: 'dashboardSession',
        storage: createJSONStorage(() => sessionStorage),
        merge: (persistedState, currentState) =>
          deepmerge(currentState, persistedState as Partial<TDashboardStore>),
        partialize: (state) =>
          ({
            isSidebarCollapsed: state.isSidebarCollapsed,
          }) as Partial<TDashboardStore>,
      },
    ),
  );
};

'use client';

import { type ReactNode, createContext, useContext, useRef } from 'react';
import { type StoreApi, useStore } from 'zustand';

import {
  type TDashboardStore,
  type TDashboardStoreValues,
  createDashboardStore,
} from './store';

export const DashboardStoreContext =
  createContext<StoreApi<TDashboardStore> | null>(null);

export interface DashboardStoreProviderProps {
  children: ReactNode;
  initState?: Partial<TDashboardStoreValues>;
}

export const DashboardStoreProvider = ({
  children,
  initState,
}: DashboardStoreProviderProps) => {
  const storeRef = useRef<StoreApi<TDashboardStore>>();
  if (!storeRef.current) {
    storeRef.current = createDashboardStore(initState);
  }

  return (
    <DashboardStoreContext.Provider value={storeRef.current}>
      {children}
    </DashboardStoreContext.Provider>
  );
};

export const useDashboardStore = <T,>(
  selector: (store: TDashboardStore) => T,
): T => {
  const dashboardStoreContext = useContext(DashboardStoreContext);

  if (!dashboardStoreContext) {
    throw new Error(
      `useDashboardStore must be use within DashboardStoreProvider`,
    );
  }

  return useStore(dashboardStoreContext, selector);
};

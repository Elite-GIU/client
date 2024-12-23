import React, {useState, createContext, useContext, ReactNode } from 'react';

const SidebarContext = createContext({
  triggerUpdate: () => {},
  resetUpdate: () => {},
  updated: false,
});

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [updated, setUpdated] = useState(false);

  const triggerUpdate = () => {
    setUpdated(true);
  };

  const resetUpdate = () => {
    setUpdated(false);
  };


  return (
    <SidebarContext.Provider value={{ triggerUpdate, resetUpdate, updated }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebarUpdate = () => useContext(SidebarContext);

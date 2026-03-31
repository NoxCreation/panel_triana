import React, { createContext, ReactNode, useState } from "react";

type VoypatiProviderContextType = {
  collapseMenu: boolean,
  setCollapseMenu: (collapse: boolean) => void,
};

export const VoypatiContext = createContext<VoypatiProviderContextType | null>(null);

export default function VoypatiProviderProvider({ children }: { children: ReactNode | ReactNode[]; }) {
  const [collapseMenu, setCollapseMenu] = useState(true)

  return (
    <VoypatiContext.Provider
      value={{
        collapseMenu,
        setCollapseMenu
      }}
    >
      {children}
    </VoypatiContext.Provider>
  );
}

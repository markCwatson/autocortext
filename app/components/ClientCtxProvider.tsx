'use client';

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

const IsClientCtx = createContext(false);

interface ProvidersProps {
  children: ReactNode;
}

/**
 *
 * @description See https://stackoverflow.com/questions/75692116/next-js-13-window-is-not-defined
 *              This was causing errors with using dom document (kanban) and PDFDownloadLink (ai header)
 *              because they were being rendered on the server side.
 */
export const ClientCtxProvider = ({ children }: ProvidersProps) => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  return (
    <IsClientCtx.Provider value={isClient}>{children}</IsClientCtx.Provider>
  );
};

export function isClientCtx() {
  return useContext(IsClientCtx);
}

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
 *              Was seeing errors with using dom document (kanban) and PDFDownloadLink (ai header)
 *              because they were being rendered on the server side. This component will wrap
 *              the entire app and only render the children if the app is being rendered on the
 *              client side.
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

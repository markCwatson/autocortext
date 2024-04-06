'use client';

import { AiMessage } from '@/types';
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface QueryContextValue {
  messages: AiMessage[];
  setMessages: React.Dispatch<React.SetStateAction<AiMessage[]>>;
}

interface AiQueryProviderProps {
  children: ReactNode;
}

const QueryContext = createContext<QueryContextValue | null>(null);

export const useQueryContext = () => {
  const context = useContext(QueryContext);
  if (!context) {
    throw new Error('useQueryContext must be used within a AiMessagesProvider');
  }
  return context;
};

export const AiMessagesProvider: React.FC<AiQueryProviderProps> = ({
  children,
}) => {
  const [messages, setMessages] = useState<AiMessage[]>([]);

  return (
    <QueryContext.Provider value={{ messages, setMessages }}>
      {children}
    </QueryContext.Provider>
  );
};

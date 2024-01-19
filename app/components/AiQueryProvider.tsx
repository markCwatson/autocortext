'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface InteractionState {
  question: string;
  answer: string;
  loading: boolean;
}

interface QueryContextValue {
  interaction: InteractionState;
  setInteraction: React.Dispatch<React.SetStateAction<InteractionState>>;
}

interface AiQueryProviderProps {
  children: ReactNode;
}

const QueryContext = createContext<QueryContextValue | null>(null);

export const useQueryContext = () => {
  const context = useContext(QueryContext);
  if (!context) {
    throw new Error('useQueryContext must be used within a AiQueryProvider');
  }
  return context;
};

export const AiQueryProvider: React.FC<AiQueryProviderProps> = ({
  children,
}) => {
  const [interaction, setInteraction] = useState<InteractionState>({
    question: '',
    answer: '',
    loading: false,
  });

  return (
    <QueryContext.Provider value={{ interaction, setInteraction }}>
      {children}
    </QueryContext.Provider>
  );
};

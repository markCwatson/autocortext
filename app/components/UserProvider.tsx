'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface User {
  name: string | null | undefined;
  image: string | null | undefined;
}

interface UserValue {
  user: User;
}

interface UserProviderProps {
  value: User;
  children: ReactNode;
}

const UserContext = createContext<UserValue | null>(null);

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<UserProviderProps> = ({
  value,
  children,
}) => {
  const [user] = useState<User>(value);

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
};

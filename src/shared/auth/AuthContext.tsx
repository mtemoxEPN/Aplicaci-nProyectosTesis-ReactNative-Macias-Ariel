import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../api/supabase';

// =====================================================================
// 🚨 [AUTH-01] DEFINICIÓN DE TIPOS PARA EL CONTEXTO DE AUTENTICACIÓN
// =====================================================================
type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isLoading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // =====================================================================
    // 🚨 [AUTH-02] OBTENCIÓN DE SESIÓN INICIAL AL ABRIR LA APP
    // =====================================================================
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // =====================================================================
    // 🚨 [AUTH-03] SUSCRIPCIÓN A CAMBIOS DE ESTADO (LOGIN/LOGOUT)
    // =====================================================================
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session, user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
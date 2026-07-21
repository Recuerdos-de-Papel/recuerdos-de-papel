import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  name: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  loginWithGoogle: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Verificar sesión existente al cargar
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const supaUser = session.user;
        const userData: User = {
          id: supaUser.id,
          name: supaUser.user_metadata?.full_name?.split(' ')[0] || '',
          lastName: supaUser.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
          email: supaUser.email || '',
          phone: supaUser.user_metadata?.phone,
          avatar: supaUser.user_metadata?.avatar_url,
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      }
    };

    getInitialSession();

    // Escuchar cambios de autenticación de Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const supaUser = session.user;
        const userData: User = {
          id: supaUser.id,
          name: supaUser.user_metadata?.full_name?.split(' ')[0] || '',
          lastName: supaUser.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
          email: supaUser.email || '',
          phone: supaUser.user_metadata?.phone,
          avatar: supaUser.user_metadata?.avatar_url,
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        setUser(null);
        localStorage.removeItem('user');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/mi-cuenta`,
      },
    });
    if (error) throw error;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loginWithGoogle,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
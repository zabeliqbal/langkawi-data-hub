
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any | null }>;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Get session on component mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        fetchUserRole(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          fetchUserRole(session.user.id);
        } else {
          setIsAdmin(false);
          setLoading(false);
        }
      }
    );

    // Cleanup on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function fetchUserRole(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        setIsAdmin(false);
      } else {
        setIsAdmin(data?.role === 'admin');
      }
    } catch (error) {
      console.error('Error in fetchUserRole:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        toast({
          title: 'Sign up failed',
          description: error.message,
          variant: 'destructive',
        });
        return { error };
      }

      toast({
        title: 'Sign up successful',
        description: 'Please check your email for the confirmation link.',
      });
      return { error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      toast({
        title: 'Sign up failed',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: 'Sign in failed',
          description: error.message,
          variant: 'destructive',
        });
        return { error };
      }

      toast({
        title: 'Sign in successful',
        description: `Welcome back${data.user?.user_metadata?.full_name ? ', ' + data.user.user_metadata.full_name : ''}!`,
      });
      navigate('/');
      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      toast({
        title: 'Sign in failed',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out.',
      });
      navigate('/auth');
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: 'Sign out failed',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signUp,
        signIn,
        signOut,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

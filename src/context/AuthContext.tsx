import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, StoredUserRecord, AuthSession, UserRole, FamilyElderLink } from '../types';
import { hashPassword, verifyPassword, generateSessionToken } from '../utils/crypto';
import { supabaseAuth, supabaseApi } from '../utils/supabase';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'signup';
  openAuthModal: (mode?: 'login' | 'signup') => void;
  closeAuthModal: () => void;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  signup: (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    role?: UserRole;
    linkedFamilyCode?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  linkFamilyCode: (code: string) => Promise<{ success: boolean; message: string }>;
  unlinkFamilyCode: () => Promise<{ success: boolean; message: string }>;
  linkElderAccount: (elder: { name: string; code?: string; phone?: string; address?: string }) => Promise<{ success: boolean; message: string }>;
  unlinkElderAccount: () => Promise<{ success: boolean; message: string }>;
}

export const USERS_STORAGE_KEY = 'kincare_registered_users_v1';
export const SESSION_STORAGE_KEY = 'kincare_auth_session_v1';
export const FAMILY_LINKS_MAP_KEY = 'kincare_family_elder_links_v1';

// Shared bidirectional family-elder linkage repository
export const getStoredFamilyLinks = (): Record<string, FamilyElderLink> => {
  try {
    const raw = localStorage.getItem(FAMILY_LINKS_MAP_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export const saveStoredFamilyLinks = (links: Record<string, FamilyElderLink>) => {
  try {
    localStorage.setItem(FAMILY_LINKS_MAP_KEY, JSON.stringify(links));
    window.dispatchEvent(new CustomEvent('kincare_family_links_updated'));
  } catch (e) {
    console.warn('Failed to save family links map', e);
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  // Load registered fallback users from localStorage
  const getStoredUsers = (): StoredUserRecord[] => {
    try {
      const data = localStorage.getItem(USERS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  };

  // Save registered users to localStorage
  const saveStoredUsers = (users: StoredUserRecord[]) => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (err) {
      console.error('Failed to save users securely to storage', err);
    }
  };

  // Initialize Supabase session & seed demo fallbacks
  useEffect(() => {
    const initAuth = async () => {
      try {
        let users = getStoredUsers();
        const storedLinks = getStoredFamilyLinks();

        // Ensure default demo 2-way linkage is pre-seeded
        if (!storedLinks['KIN-9241']) {
          storedLinks['KIN-9241'] = {
            familyCode: 'KIN-9241',
            elderName: 'Ramesh Sharma (Father)',
            elderCode: 'ELD-4021',
            elderPhone: '+91 98111 22334',
            elderAddress: 'Flat 402, Eldeco Greens, Sector 44, Noida',
            linkedAt: new Date().toISOString(),
          };
          saveStoredFamilyLinks(storedLinks);
        }

        // Pre-seed demo fallback accounts if empty
        if (users.length === 0) {
          const demoCredentials = await hashPassword('Password@123');
          const demoUser: StoredUserRecord = {
            id: 'usr_demo_8821',
            name: 'Ananya Sharma',
            email: 'demo@kincare.in',
            phone: '+91 98765 43210',
            role: 'family',
            preferredCity: 'Delhi NCR',
            emergencyContactName: 'Dr. Ramesh Sharma (Father)',
            emergencyContactPhone: '+91 98111 22334',
            address: 'B-402, Green Park Avenue, South Delhi',
            createdAt: new Date().toISOString(),
            saltHex: demoCredentials.saltHex,
            passwordHashHex: demoCredentials.hashHex,
            familyCode: 'KIN-9241',
            linkedElderName: 'Ramesh Sharma (Father)',
            linkedElderCode: 'ELD-4021',
            linkedElderPhone: '+91 98111 22334',
            linkedElderAddress: 'Flat 402, Eldeco Greens, Sector 44, Noida',
          };
          const demoElder: StoredUserRecord = {
            id: 'usr_demo_elder_101',
            name: 'Ramesh Sharma',
            email: 'elder@kincare.in',
            phone: '+91 98111 22334',
            role: 'senior_individual',
            preferredCity: 'Delhi NCR',
            emergencyContactName: 'Ananya Sharma (Daughter)',
            emergencyContactPhone: '+91 98765 43210',
            address: 'Flat 402, Eldeco Greens, Sector 44, Noida',
            createdAt: new Date().toISOString(),
            saltHex: demoCredentials.saltHex,
            passwordHashHex: demoCredentials.hashHex,
            elderCode: 'ELD-4021',
            linkedFamilyCode: 'KIN-9241',
          };
          const demoHelper: StoredUserRecord = {
            id: 'usr_demo_helper_901',
            name: 'Sister Sunita Devi (RN)',
            email: 'helper@kincare.in',
            phone: '+91 98711 00213',
            role: 'helper',
            preferredCity: 'Delhi NCR Hub',
            address: 'Sector 44, Noida Care Hub',
            createdAt: new Date().toISOString(),
            saltHex: demoCredentials.saltHex,
            passwordHashHex: demoCredentials.hashHex,
            specialization: 'Verified Nursing Attendant (ICU & Geriatric RN)',
            badgeNumber: 'DL-4481',
            upiId: 'sunita@okhdfcbank',
            avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80',
          };
          users = [demoUser, demoElder, demoHelper];
          saveStoredUsers(users);
        }

        // 1. Check Supabase Auth Session first
        const supaSession = await supabaseAuth.getSession();
        if (supaSession?.user) {
          const profile = await supabaseApi.getProfile(supaSession.user.id);
          if (profile) {
            setUser(profile);
            localStorage.setItem(
              SESSION_STORAGE_KEY,
              JSON.stringify({
                user: profile,
                token: supaSession.access_token,
                expiresAt: (supaSession.expires_at || 0) * 1000,
              })
            );
            return;
          } else {
            // Profile does not yet exist in profiles table; auto-provision it
            const newProfile: UserProfile = {
              id: supaSession.user.id,
              name: supaSession.user.user_metadata?.name || supaSession.user.email?.split('@')[0] || 'User',
              email: supaSession.user.email || '',
              phone: supaSession.user.user_metadata?.phone || '',
              role: (supaSession.user.user_metadata?.role as UserRole) || 'senior_individual',
              createdAt: new Date().toISOString(),
              familyCode: supaSession.user.user_metadata?.linkedFamilyCode,
            };
            await supabaseApi.upsertProfile({
              id: newProfile.id,
              name: newProfile.name,
              email: newProfile.email,
              phone: newProfile.phone,
              role: newProfile.role,
              family_code: newProfile.familyCode,
            });
            setUser(newProfile);
            return;
          }
        }

        // 2. Fallback to stored session if no active Supabase Auth session
        const sessionRaw = localStorage.getItem(SESSION_STORAGE_KEY);
        if (sessionRaw) {
          const session: AuthSession = JSON.parse(sessionRaw);
          if (session.expiresAt > Date.now()) {
            setUser(session.user);
          } else {
            localStorage.removeItem(SESSION_STORAGE_KEY);
          }
        }
      } catch (err) {
        console.error('Error initializing authentication:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen to Supabase Auth state changes
    const subscription = supabaseAuth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await supabaseApi.getProfile(session.user.id);
        if (profile) {
          setUser(profile);
          localStorage.setItem(
            SESSION_STORAGE_KEY,
            JSON.stringify({
              user: profile,
              token: session.access_token,
              expiresAt: (session.expires_at || 0) * 1000,
            })
          );
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const openAuthModal = (mode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // Login via Supabase Auth with fallback for pre-seeded demo accounts
  const login = async (
    email: string,
    password: string,
    rememberMe = true
  ): Promise<{ success: boolean; error?: string }> => {
    const normalizedEmail = email.trim().toLowerCase();

    // 1. Attempt Supabase Auth signIn
    const supaRes = await supabaseAuth.signIn(normalizedEmail, password);
    if (supaRes.session && supaRes.user) {
      let profile = await supabaseApi.getProfile(supaRes.user.id);
      if (!profile) {
        profile = {
          id: supaRes.user.id,
          name: supaRes.user.user_metadata?.name || normalizedEmail.split('@')[0],
          email: normalizedEmail,
          phone: supaRes.user.user_metadata?.phone || '',
          role: (supaRes.user.user_metadata?.role as UserRole) || 'senior_individual',
          createdAt: new Date().toISOString(),
          familyCode: supaRes.user.user_metadata?.linkedFamilyCode,
        };
        await supabaseApi.upsertProfile({
          id: profile.id,
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          role: profile.role,
          family_code: profile.familyCode,
        });
      }

      // Check for linked elder if this is a family account
      if (profile.role === 'family') {
        const linkedSeniors = await supabaseApi.getLinkedSeniors();
        if (linkedSeniors.length > 0) {
          profile.linkedElderName = linkedSeniors[0].name;
          profile.linkedElderPhone = linkedSeniors[0].phone;
          profile.linkedElderAddress = linkedSeniors[0].address;
          profile.linkedElderCode = linkedSeniors[0].family_code;
        }
      }

      setUser(profile);
      const sessionDuration = rememberMe ? 14 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
      const session: AuthSession = {
        user: profile,
        token: supaRes.session.access_token,
        expiresAt: Date.now() + sessionDuration,
      };
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      setIsAuthModalOpen(false);
      return { success: true };
    }

    // 2. Fallback: Demo accounts or offline mode
    const users = getStoredUsers();
    const foundUser = users.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (foundUser) {
      try {
        const isMatch = await verifyPassword(password, foundUser.saltHex, foundUser.passwordHashHex);
        if (isMatch) {
          const { saltHex: _s, passwordHashHex: _p, ...sanitizedUser } = foundUser;
          if (sanitizedUser.familyCode) {
            const storedLinks = getStoredFamilyLinks();
            if (storedLinks[sanitizedUser.familyCode]) {
              const link = storedLinks[sanitizedUser.familyCode];
              sanitizedUser.linkedElderName = sanitizedUser.linkedElderName || link.elderName;
              sanitizedUser.linkedElderCode = sanitizedUser.linkedElderCode || link.elderCode;
              sanitizedUser.linkedElderPhone = sanitizedUser.linkedElderPhone || link.elderPhone;
              sanitizedUser.linkedElderAddress = sanitizedUser.linkedElderAddress || link.elderAddress;
            }
          }
          setUser(sanitizedUser);
          const sessionDuration = rememberMe ? 14 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
          const session: AuthSession = {
            user: sanitizedUser,
            token: generateSessionToken(),
            expiresAt: Date.now() + sessionDuration,
          };
          localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
          setIsAuthModalOpen(false);
          return { success: true };
        }
      } catch {
        // Continue to error
      }
    }

    return {
      success: false,
      error: supaRes.error || 'Invalid email or password. Please verify your credentials.',
    };
  };

  // Sign up via Supabase Auth
  const signup = async ({
    name,
    email,
    password,
    phone,
    role = 'family',
    linkedFamilyCode,
  }: {
    name: string;
    email: string;
    password: string;
    phone: string;
    role?: UserRole;
    linkedFamilyCode?: string;
  }) => {
    const normalizedEmail = email.trim().toLowerCase();

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    // 1. Supabase Auth Signup (Passwords stored exclusively in Supabase Auth, not app tables)
    const supaRes = await supabaseAuth.signUp({
      email: normalizedEmail,
      password,
      name: name.trim(),
      phone: phone.trim(),
      role,
      linkedFamilyCode: linkedFamilyCode?.trim().toUpperCase(),
    });

    if (supaRes.user) {
      const generatedFamilyCode =
        role === 'family' || role === 'family_caregiver'
          ? `KIN-${Math.floor(1000 + Math.random() * 9000)}`
          : undefined;

      const userProfile: UserProfile = {
        id: supaRes.user.id,
        name: name.trim(),
        email: normalizedEmail,
        phone: phone.trim(),
        role,
        createdAt: new Date().toISOString(),
        familyCode: generatedFamilyCode,
        linkedFamilyCode: linkedFamilyCode?.trim().toUpperCase(),
      };

      // 2. Persist profile in public.profiles table
      await supabaseApi.upsertProfile({
        id: supaRes.user.id,
        name: userProfile.name,
        email: userProfile.email,
        phone: userProfile.phone,
        role: userProfile.role,
        family_code: userProfile.familyCode,
        linkedFamilyCode: userProfile.linkedFamilyCode,
      });

      // 3. Associate senior record with owner_id for senior account
      if (role === 'senior_individual' || role === 'elder') {
        await supabaseApi.upsertSenior({
          owner_id: supaRes.user.id,
          name: name.trim(),
          phone: phone.trim(),
          family_code: linkedFamilyCode?.trim().toUpperCase() || 'KIN-9241',
        });
      }

      // 4. If family account with linked code, establish relationship in family_links
      if (linkedFamilyCode && (role === 'family' || role === 'family_caregiver')) {
        await supabaseApi.linkFamilyToSenior(linkedFamilyCode.trim().toUpperCase());
      }

      setUser(userProfile);

      const session: AuthSession = {
        user: userProfile,
        token: supaRes.session?.access_token || generateSessionToken(),
        expiresAt: Date.now() + 14 * 24 * 60 * 60 * 1000,
      };
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));

      setIsAuthModalOpen(false);
      return { success: true };
    }

    // Fallback if Supabase Auth had an issue or is unreachable
    if (supaRes.error && !supaRes.error.includes('already registered')) {
      // Local fallback for offline testing
      const { saltHex, hashHex } = await hashPassword(password);
      const fallbackUser: StoredUserRecord = {
        id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        name: name.trim(),
        email: normalizedEmail,
        phone: phone.trim(),
        role,
        createdAt: new Date().toISOString(),
        saltHex,
        passwordHashHex: hashHex,
        familyCode: `KIN-${Math.floor(1000 + Math.random() * 9000)}`,
        linkedFamilyCode: linkedFamilyCode?.trim().toUpperCase(),
      };
      const users = getStoredUsers();
      saveStoredUsers([...users, fallbackUser]);

      const { saltHex: _s, passwordHashHex: _p, ...sanitized } = fallbackUser;
      setUser(sanitized);
      const session: AuthSession = {
        user: sanitized,
        token: generateSessionToken(),
        expiresAt: Date.now() + 14 * 24 * 60 * 60 * 1000,
      };
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      setIsAuthModalOpen(false);
      return { success: true };
    }

    return {
      success: false,
      error: supaRes.error || 'Failed to create account. Please try again.',
    };
  };

  const logout = async () => {
    await supabaseAuth.signOut();
    setUser(null);
    localStorage.removeItem(SESSION_STORAGE_KEY);
  };

  const updateProfile = async (
    updates: Partial<UserProfile>
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Not authenticated' };

    const updatedProfile: UserProfile = {
      ...user,
      ...updates,
      id: user.id,
      email: user.email,
    };

    // 1. Update in Supabase profiles table
    try {
      await supabaseApi.upsertProfile({
        id: user.id,
        name: updatedProfile.name,
        email: updatedProfile.email,
        phone: updatedProfile.phone,
        role: updatedProfile.role,
        preferred_city: updatedProfile.preferredCity,
        emergency_contact_name: updatedProfile.emergencyContactName,
        emergency_contact_phone: updatedProfile.emergencyContactPhone,
        address: updatedProfile.address,
        family_code: updatedProfile.familyCode,
        elder_code: updatedProfile.elderCode,
        specialization: updatedProfile.specialization,
        badge_number: updatedProfile.badgeNumber,
        upi_id: updatedProfile.upiId,
        avatar_url: updatedProfile.avatarUrl,
      });
    } catch (e) {
      console.warn('Supabase updateProfile note:', e);
    }

    // 2. Update local state & session
    setUser(updatedProfile);
    const sessionRaw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (sessionRaw) {
      const session: AuthSession = JSON.parse(sessionRaw);
      session.user = updatedProfile;
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    }

    return { success: true };
  };

  const linkFamilyCode = async (code: string): Promise<{ success: boolean; message: string }> => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      return { success: false, message: 'Please enter a valid family code.' };
    }

    // 1. Establish family relationship in Supabase
    try {
      await supabaseApi.linkFamilyToSenior(cleanCode);
    } catch (e) {
      console.warn('Supabase linkFamilyToSenior note:', e);
    }

    // 2. Update profile
    const seniorElderCode = user?.elderCode || 'ELD-4021';
    await updateProfile({ linkedFamilyCode: cleanCode, elderCode: seniorElderCode });

    // 3. Notify backend with Bearer auth
    try {
      const sessionRaw = localStorage.getItem(SESSION_STORAGE_KEY);
      const token = sessionRaw ? JSON.parse(sessionRaw).token : '';
      await fetch('/api/family/link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          familyCode: cleanCode,
          elderName: user?.name || 'Ramesh Sharma (Father)',
          elderCode: seniorElderCode,
          elderPhone: user?.phone || '+91 98111 22334',
          elderAddress: user?.address || 'Flat 402, Eldeco Greens, Sector 44, Noida',
        }),
      });
    } catch (e) {
      console.warn('Backend link fallback', e);
    }

    // 4. Update bidirectional cache
    const storedLinks = getStoredFamilyLinks();
    storedLinks[cleanCode] = {
      familyCode: cleanCode,
      elderName: user?.name || 'Ramesh Sharma (Father)',
      elderCode: seniorElderCode,
      elderPhone: user?.phone || '+91 98111 22334',
      elderAddress: user?.address || 'Flat 402, Eldeco Greens, Sector 44, Noida',
      linkedAt: new Date().toISOString(),
    };
    saveStoredFamilyLinks(storedLinks);

    return {
      success: true,
      message: `Successfully linked with Family Code (${cleanCode})! The family portal is now synchronized with authorized senior data.`,
    };
  };

  const unlinkFamilyCode = async (): Promise<{ success: boolean; message: string }> => {
    const currentCode = user?.linkedFamilyCode;
    const res = await updateProfile({ linkedFamilyCode: undefined });
    if (res.success && currentCode) {
      const storedLinks = getStoredFamilyLinks();
      delete storedLinks[currentCode];
      saveStoredFamilyLinks(storedLinks);

      try {
        const sessionRaw = localStorage.getItem(SESSION_STORAGE_KEY);
        const token = sessionRaw ? JSON.parse(sessionRaw).token : '';
        await fetch(`/api/family/link/${currentCode}`, {
          method: 'DELETE',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
      } catch (e) {
        console.warn('Backend unlink fallback', e);
      }
      return { success: true, message: 'Disconnected from Family Account.' };
    }
    return { success: false, message: res.error || 'Failed to disconnect account.' };
  };

  const linkElderAccount = async (elder: {
    name: string;
    code?: string;
    phone?: string;
    address?: string;
  }): Promise<{ success: boolean; message: string }> => {
    const cleanName = elder.name.trim();
    if (!cleanName) {
      return { success: false, message: "Please provide the elder's name or code." };
    }
    const cleanCode = elder.code?.trim().toUpperCase() || `ELD-${Math.floor(1000 + Math.random() * 9000)}`;
    const familyCode = user?.familyCode || 'KIN-9241';
    const elderPhone = elder.phone?.trim() || '+91 98111 22334';
    const elderAddress = elder.address?.trim() || 'Flat 402, Eldeco Greens, Sector 44, Noida';

    const res = await updateProfile({
      linkedElderName: cleanName,
      linkedElderCode: cleanCode,
      linkedElderPhone: elderPhone,
      linkedElderAddress: elderAddress,
    });

    if (res.success) {
      try {
        await supabaseApi.linkFamilyToSenior(cleanCode);
      } catch (e) {
        console.warn('Supabase linkElder note:', e);
      }

      const storedLinks = getStoredFamilyLinks();
      storedLinks[familyCode] = {
        familyCode,
        elderName: cleanName,
        elderCode: cleanCode,
        elderPhone,
        elderAddress,
        linkedAt: new Date().toISOString(),
      };
      saveStoredFamilyLinks(storedLinks);

      try {
        const sessionRaw = localStorage.getItem(SESSION_STORAGE_KEY);
        const token = sessionRaw ? JSON.parse(sessionRaw).token : '';
        await fetch('/api/family/link', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            familyCode,
            elderName: cleanName,
            elderCode: cleanCode,
            elderPhone,
            elderAddress,
          }),
        });
      } catch (e) {
        console.warn('Backend link fallback', e);
      }

      return {
        success: true,
        message: `Successfully linked ${cleanName} (${cleanCode}) to your Family Guardian account.`,
      };
    }
    return { success: false, message: res.error || 'Failed to link elder account.' };
  };

  const unlinkElderAccount = async (): Promise<{ success: boolean; message: string }> => {
    const familyCode = user?.familyCode || 'KIN-9241';
    const res = await updateProfile({
      linkedElderName: undefined,
      linkedElderCode: undefined,
      linkedElderPhone: undefined,
      linkedElderAddress: undefined,
    });
    if (res.success) {
      const storedLinks = getStoredFamilyLinks();
      delete storedLinks[familyCode];
      saveStoredFamilyLinks(storedLinks);

      try {
        const sessionRaw = localStorage.getItem(SESSION_STORAGE_KEY);
        const token = sessionRaw ? JSON.parse(sessionRaw).token : '';
        await fetch(`/api/family/link/${familyCode}`, {
          method: 'DELETE',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
      } catch (e) {
        console.warn('Backend unlink fallback', e);
      }

      return { success: true, message: 'Elder account unlinked successfully.' };
    }
    return { success: false, message: res.error || 'Failed to unlink elder account.' };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        login,
        signup,
        logout,
        updateProfile,
        linkFamilyCode,
        unlinkFamilyCode,
        linkElderAccount,
        unlinkElderAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

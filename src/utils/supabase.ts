import { createClient, SupabaseClient, User as SupabaseUser, Session as SupabaseSession } from '@supabase/supabase-js';
import { Medicine, Booking, VitalRecord, HelperChore, UserProfile, UserRole, SeniorRecord, FamilyLinkRecord, FamilyUpdateRecord } from '../types';

// Read Supabase environment variables safely
const getEnvUrl = (): string => {
  return (
    import.meta.env.VITE_SUPABASE_URL ||
    'https://cppvbvhmedkhbizzyiqq.supabase.co'
  );
};

const getEnvKey = (): string => {
  return (
    import.meta.env.VITE_SUPABASE_ANON_KEY ||
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    'sb_publishable_2Ho2YebFSZfwPwxm16HzBw_zAl7BGSN'
  );
};

let supabaseInstance: SupabaseClient | null = null;
let isConfigFetched = false;

export function getSupabase(): SupabaseClient | null {
  if (supabaseInstance) return supabaseInstance;

  const url = getEnvUrl() || (typeof window !== 'undefined' ? (window as any).__SUPABASE_URL__ : '');
  const key = getEnvKey() || (typeof window !== 'undefined' ? (window as any).__SUPABASE_ANON_KEY__ : '');

  if (url && key) {
    try {
      supabaseInstance = createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });
    } catch (e) {
      console.warn('Failed to initialize Supabase client:', e);
    }
  }
  return supabaseInstance;
}

export async function initSupabaseFromConfig(): Promise<SupabaseClient | null> {
  if (supabaseInstance) return supabaseInstance;
  if (isConfigFetched) return null;
  isConfigFetched = true;

  try {
    const res = await fetch('/api/config/supabase');
    if (res.ok) {
      const { supabaseUrl, supabaseAnonKey } = await res.json();
      if (supabaseUrl && supabaseAnonKey) {
        if (typeof window !== 'undefined') {
          (window as any).__SUPABASE_URL__ = supabaseUrl;
          (window as any).__SUPABASE_ANON_KEY__ = supabaseAnonKey;
        }
        supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
          },
        });
        return supabaseInstance;
      }
    }
  } catch {
    // Graceful fallback
  }
  return getSupabase();
}

// 1. SUPABASE AUTH API
export const supabaseAuth = {
  getClient: async (): Promise<SupabaseClient | null> => {
    return getSupabase() || (await initSupabaseFromConfig());
  },

  getSession: async (): Promise<SupabaseSession | null> => {
    const client = await supabaseAuth.getClient();
    if (!client) return null;
    try {
      const { data } = await client.auth.getSession();
      return data.session;
    } catch {
      return null;
    }
  },

  getCurrentUser: async (): Promise<SupabaseUser | null> => {
    const client = await supabaseAuth.getClient();
    if (!client) return null;
    try {
      const { data } = await client.auth.getUser();
      return data.user;
    } catch {
      return null;
    }
  },

  onAuthStateChange: (callback: (event: string, session: SupabaseSession | null) => void) => {
    const client = getSupabase();
    if (!client) return { unsubscribe: () => {} };
    const { data: { subscription } } = client.auth.onAuthStateChange(callback);
    return subscription;
  },

  signUp: async (params: {
    email: string;
    password: string;
    name: string;
    phone?: string;
    role: UserRole;
    linkedFamilyCode?: string;
  }): Promise<{ user: SupabaseUser | null; session: SupabaseSession | null; error?: string }> => {
    const client = await supabaseAuth.getClient();
    if (!client) {
      return { user: null, session: null, error: 'Supabase client not initialized' };
    }

    try {
      const { data, error } = await client.auth.signUp({
        email: params.email,
        password: params.password,
        options: {
          data: {
            name: params.name,
            phone: params.phone || '',
            role: params.role,
            linkedFamilyCode: params.linkedFamilyCode || '',
          },
        },
      });

      if (error) {
        return { user: null, session: null, error: error.message };
      }

      if (data.user) {
        // Create initial profile in public.profiles table
        await supabaseApi.upsertProfile({
          id: data.user.id,
          email: params.email,
          name: params.name,
          phone: params.phone || '',
          role: params.role,
          family_code: params.role === 'family' ? (params.linkedFamilyCode || 'KIN-' + Math.floor(1000 + Math.random() * 9000)) : undefined,
          linkedFamilyCode: params.linkedFamilyCode,
        });

        // If senior individual / elder, ensure senior record in public.seniors exists
        if (params.role === 'senior_individual' || params.role === 'elder') {
          await supabaseApi.upsertSenior({
            name: params.name,
            owner_id: data.user.id,
            phone: params.phone,
            family_code: params.linkedFamilyCode || 'KIN-' + Math.floor(1000 + Math.random() * 9000),
          });
        }
      }

      return { user: data.user, session: data.session };
    } catch (err: any) {
      return { user: null, session: null, error: err.message || 'Signup failed' };
    }
  },

  signIn: async (
    email: string,
    password: string
  ): Promise<{ user: SupabaseUser | null; session: SupabaseSession | null; error?: string }> => {
    const client = await supabaseAuth.getClient();
    if (!client) {
      return { user: null, session: null, error: 'Supabase client not initialized' };
    }

    try {
      const { data, error } = await client.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { user: null, session: null, error: error.message };
      }

      return { user: data.user, session: data.session };
    } catch (err: any) {
      return { user: null, session: null, error: err.message || 'Login failed' };
    }
  },

  signOut: async (): Promise<{ error?: string }> => {
    const client = await supabaseAuth.getClient();
    if (!client) return {};
    try {
      const { error } = await client.auth.signOut();
      if (error) return { error: error.message };
      return {};
    } catch (err: any) {
      return { error: err.message };
    }
  },
};

// 2. SUPABASE DATABASE API (With RLS enforcement)
export const supabaseApi = {
  // PROFILES
  async getProfile(userId: string): Promise<UserProfile | null> {
    const client = await supabaseAuth.getClient();
    if (!client) return null;
    try {
      const { data, error } = await client.from('profiles').select('*').eq('id', userId).single();
      if (error) throw error;
      if (!data) return null;
      return {
        id: data.id,
        name: data.name,
        email: data.email || '',
        phone: data.phone || '',
        role: data.role as UserRole,
        preferredCity: data.preferred_city,
        emergencyContactName: data.emergency_contact_name,
        emergencyContactPhone: data.emergency_contact_phone,
        address: data.address,
        createdAt: data.created_at,
        familyCode: data.family_code,
        elderCode: data.elder_code,
        specialization: data.specialization,
        badgeNumber: data.badge_number,
        upiId: data.upi_id,
        avatarUrl: data.avatar_url,
      };
    } catch (err) {
      console.warn('Supabase getProfile error:', err);
      return null;
    }
  },

  async upsertProfile(profile: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    role: UserRole;
    preferred_city?: string;
    emergency_contact_name?: string;
    emergency_contact_phone?: string;
    address?: string;
    family_code?: string;
    linkedFamilyCode?: string;
    elder_code?: string;
    specialization?: string;
    badge_number?: string;
    upi_id?: string;
    avatar_url?: string;
  }): Promise<boolean> {
    const client = await supabaseAuth.getClient();
    if (!client) return false;
    try {
      const payload: any = {
        id: profile.id,
        name: profile.name,
        role: profile.role,
        updated_at: new Date().toISOString(),
      };
      if (profile.email) payload.email = profile.email;
      if (profile.phone) payload.phone = profile.phone;
      if (profile.preferred_city) payload.preferred_city = profile.preferred_city;
      if (profile.emergency_contact_name) payload.emergency_contact_name = profile.emergency_contact_name;
      if (profile.emergency_contact_phone) payload.emergency_contact_phone = profile.emergency_contact_phone;
      if (profile.address) payload.address = profile.address;
      if (profile.family_code) payload.family_code = profile.family_code;
      if (profile.elder_code) payload.elder_code = profile.elder_code;
      if (profile.specialization) payload.specialization = profile.specialization;
      if (profile.badge_number) payload.badge_number = profile.badge_number;
      if (profile.upi_id) payload.upi_id = profile.upi_id;
      if (profile.avatar_url) payload.avatar_url = profile.avatar_url;

      const { error } = await client.from('profiles').upsert(payload);
      if (error) throw error;
      return true;
    } catch (err) {
      console.warn('Supabase upsertProfile error:', err);
      return false;
    }
  },

  // SENIORS (Authorized to owner or linked family through RLS)
  async getSeniors(): Promise<SeniorRecord[] | null> {
    const client = await supabaseAuth.getClient();
    if (!client) return null;
    try {
      const { data, error } = await client.from('seniors').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.warn('Supabase getSeniors error:', err);
      return null;
    }
  },

  async upsertSenior(senior: {
    id?: string;
    owner_id?: string;
    name: string;
    age?: number;
    phone?: string;
    address?: string;
    emergency_contact?: string;
    family_code?: string;
  }): Promise<SeniorRecord | null> {
    const client = await supabaseAuth.getClient();
    if (!client) return null;
    try {
      const { data, error } = await client.from('seniors').upsert(senior).select().single();
      if (error) throw error;
      return data;
    } catch (err) {
      console.warn('Supabase upsertSenior error:', err);
      return null;
    }
  },

  // FAMILY LINKS (Relationship between family account and senior)
  async linkFamilyToSenior(familyCode: string): Promise<{ success: boolean; senior?: SeniorRecord; error?: string }> {
    const client = await supabaseAuth.getClient();
    if (!client) return { success: false, error: 'Client unavailable' };

    const user = (await client.auth.getUser()).data.user;
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      // 1. Find senior by family_code
      const cleanCode = familyCode.trim().toUpperCase();
      const { data: seniors, error: findError } = await client
        .from('seniors')
        .select('*')
        .eq('family_code', cleanCode)
        .limit(1);

      if (findError) throw findError;
      if (!seniors || seniors.length === 0) {
        return { success: false, error: `No senior record found with family code ${cleanCode}` };
      }

      const senior = seniors[0];

      // 2. Insert into family_links
      const { error: linkError } = await client.from('family_links').upsert({
        family_user_id: user.id,
        senior_id: senior.id,
        family_code: cleanCode,
      });

      if (linkError) throw linkError;

      // 3. Update family user profile with linked family code
      await client.from('profiles').update({ family_code: cleanCode }).eq('id', user.id);

      return { success: true, senior };
    } catch (err: any) {
      console.warn('Supabase linkFamilyToSenior error:', err);
      return { success: false, error: err.message || 'Failed to establish family link' };
    }
  },

  async getLinkedSeniors(): Promise<SeniorRecord[]> {
    const client = await supabaseAuth.getClient();
    if (!client) return [];
    try {
      const { data, error } = await client
        .from('family_links')
        .select('senior_id, seniors (*)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map((row: any) => row.seniors).filter(Boolean);
    } catch (err) {
      console.warn('Supabase getLinkedSeniors error:', err);
      return [];
    }
  },

  // MEDICATIONS (Controlled by RLS through is_authorized_for_senior)
  async getMedications(seniorId?: string): Promise<Medicine[] | null> {
    const client = await supabaseAuth.getClient();
    if (!client) return null;
    try {
      let query = client.from('medications').select('*').order('created_at', { ascending: false });
      if (seniorId) {
        query = query.eq('senior_id', seniorId);
      }
      const { data, error } = await query;
      if (error) throw error;
      if (!data) return null;
      return data.map((m: any) => ({
        id: String(m.id),
        name: m.name,
        dosage: m.dosage,
        timing: m.timing,
        instructions: m.instructions || '',
        takenToday: Boolean(m.taken_today),
        takenAt: m.taken_at || undefined,
        streakDays: Number(m.streak_days || 0),
      }));
    } catch (err) {
      console.warn('Supabase getMedications error:', err);
      return null;
    }
  },

  async addMedication(med: Omit<Medicine, 'id' | 'takenToday' | 'streakDays'>, seniorId?: string): Promise<Medicine | null> {
    const client = await supabaseAuth.getClient();
    if (!client) return null;
    try {
      let targetSeniorId = seniorId;
      if (!targetSeniorId) {
        // Resolve default senior for current user
        const seniors = await supabaseApi.getSeniors();
        if (seniors && seniors.length > 0) {
          targetSeniorId = seniors[0].id;
        }
      }

      if (!targetSeniorId) {
        throw new Error('No authorized senior found for medication');
      }

      const { data, error } = await client
        .from('medications')
        .insert({
          senior_id: targetSeniorId,
          name: med.name,
          dosage: med.dosage,
          timing: med.timing,
          instructions: med.instructions,
          taken_today: false,
          streak_days: 1,
        })
        .select()
        .single();

      if (error) throw error;
      return {
        id: String(data.id),
        name: data.name,
        dosage: data.dosage,
        timing: data.timing,
        instructions: data.instructions,
        takenToday: false,
        streakDays: 1,
      };
    } catch (err) {
      console.warn('Supabase addMedication error:', err);
      return null;
    }
  },

  async toggleMedication(id: string, nextTaken: boolean, takenAt?: string): Promise<boolean> {
    const client = await supabaseAuth.getClient();
    if (!client) return false;
    try {
      const { error } = await client
        .from('medications')
        .update({
          taken_today: nextTaken,
          taken_at: takenAt || null,
        })
        .eq('id', id);
      return !error;
    } catch (err) {
      console.warn('Supabase toggleMedication error:', err);
      return false;
    }
  },

  async deleteMedication(id: string): Promise<boolean> {
    const client = await supabaseAuth.getClient();
    if (!client) return false;
    try {
      const { error } = await client.from('medications').delete().eq('id', id);
      return !error;
    } catch (err) {
      console.warn('Supabase deleteMedication error:', err);
      return false;
    }
  },

  // BOOKINGS (Associated with authorized user and senior)
  async getBookings(): Promise<Booking[] | null> {
    const client = await supabaseAuth.getClient();
    if (!client) return null;
    try {
      const { data, error } = await client.from('bookings').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (!data) return null;
      return data.map((row: any) => ({
        id: String(row.id),
        serviceId: row.service_id,
        serviceTitle: row.service_title,
        patientName: row.patient_name,
        patientAge: Number(row.patient_age || 70),
        timeSlot: row.time_slot,
        visitDate: row.visit_date,
        address: row.address,
        phone: row.phone,
        notes: row.notes || '',
        status: row.status || 'assigned',
        caregiverName: row.caregiver_name || 'Sister Sunita Devi',
        caregiverRole: row.caregiver_role || 'ICU Nurse',
        caregiverPhone: row.caregiver_phone || '+91 98711 00213',
        caregiverRating: Number(row.caregiver_rating || 4.96),
        amount: Number(row.amount || 899),
        discountApplied: Number(row.discount_applied || 100),
        createdAt: row.created_at,
      }));
    } catch (err) {
      console.warn('Supabase getBookings error:', err);
      return null;
    }
  },

  async createBooking(booking: Partial<Booking>, seniorId?: string): Promise<Booking | null> {
    const client = await supabaseAuth.getClient();
    if (!client) return null;
    try {
      const user = (await client.auth.getUser()).data.user;
      const { data, error } = await client
        .from('bookings')
        .insert({
          senior_id: seniorId || null,
          user_id: user?.id || null,
          service_id: booking.serviceId || 'nurse-daily',
          service_title: booking.serviceTitle || 'Senior Healthcare Visit',
          patient_name: booking.patientName || 'Patient',
          patient_age: booking.patientAge || 70,
          time_slot: booking.timeSlot || 'Immediate',
          visit_date: booking.visitDate || 'Today',
          address: booking.address || 'Home Residence',
          phone: booking.phone || '+91 98000 00000',
          notes: booking.notes || '',
          status: 'assigned',
          caregiver_name: booking.caregiverName || 'Sister Sunita Devi',
          caregiver_role: booking.caregiverRole || 'ICU Trained Nurse',
          caregiver_phone: booking.caregiverPhone || '+91 98711 00213',
          caregiver_rating: booking.caregiverRating || 4.96,
          amount: booking.amount || 899,
          discount_applied: booking.discountApplied || 100,
        })
        .select()
        .single();

      if (error) throw error;
      return {
        id: String(data.id),
        serviceId: data.service_id,
        serviceTitle: data.service_title,
        patientName: data.patient_name,
        patientAge: Number(data.patient_age),
        timeSlot: data.time_slot,
        visitDate: data.visit_date,
        address: data.address,
        phone: data.phone,
        status: data.status,
        caregiverName: data.caregiver_name,
        caregiverRole: data.caregiver_role,
        caregiverPhone: data.caregiver_phone,
        caregiverRating: Number(data.caregiver_rating),
        amount: Number(data.amount),
        discountApplied: Number(data.discount_applied),
        createdAt: data.created_at,
      };
    } catch (err) {
      console.warn('Supabase createBooking error:', err);
      return null;
    }
  },

  async deleteBooking(id: string): Promise<boolean> {
    const client = await supabaseAuth.getClient();
    if (!client) return false;
    try {
      const { error } = await client.from('bookings').delete().eq('id', id);
      return !error;
    } catch (err) {
      console.warn('Supabase deleteBooking error:', err);
      return false;
    }
  },

  // FAMILY UPDATES (RLS filtered to authorized senior / family code)
  async getFamilyUpdates(familyCode: string): Promise<FamilyUpdateRecord[]> {
    const client = await supabaseAuth.getClient();
    if (!client) return [];
    try {
      const { data, error } = await client
        .from('family_updates')
        .select('*')
        .eq('family_code', familyCode.toUpperCase())
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return (data || []).map((row: any) => ({
        id: String(row.id),
        senior_id: row.senior_id,
        family_code: row.family_code,
        elder_name: row.elder_name,
        elder_phone: row.elder_phone,
        elder_address: row.elder_address,
        care_notes: row.care_notes,
        vitals: row.vitals || [],
        chores: row.chores || [],
        created_at: row.created_at,
      }));
    } catch (err) {
      console.warn('Supabase getFamilyUpdates error:', err);
      return [];
    }
  },

  async addFamilyUpdate(update: {
    seniorId?: string;
    familyCode: string;
    elderName?: string;
    elderPhone?: string;
    elderAddress?: string;
    careNotes?: string;
    vitals?: VitalRecord[];
    chores?: HelperChore[];
  }): Promise<FamilyUpdateRecord | null> {
    const client = await supabaseAuth.getClient();
    if (!client) return null;
    try {
      const { data, error } = await client
        .from('family_updates')
        .insert({
          senior_id: update.seniorId || null,
          family_code: update.familyCode.toUpperCase(),
          elder_name: update.elderName || 'Ramesh Sharma',
          elder_phone: update.elderPhone,
          elder_address: update.elderAddress,
          care_notes: update.careNotes || '',
          vitals: update.vitals || [],
          chores: update.chores || [],
        })
        .select()
        .single();

      if (error) throw error;
      return {
        id: String(data.id),
        senior_id: data.senior_id,
        family_code: data.family_code,
        elder_name: data.elder_name,
        elder_phone: data.elder_phone,
        elder_address: data.elder_address,
        care_notes: data.care_notes,
        vitals: data.vitals || [],
        chores: data.chores || [],
        created_at: data.created_at,
      };
    } catch (err) {
      console.warn('Supabase addFamilyUpdate error:', err);
      return null;
    }
  },
};

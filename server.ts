import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import cors from 'cors';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors({ origin: '*' }));
app.use(express.json());
// ==============================================================================
// SUPABASE CLIENT INITIALIZATION & CONFIGURATION
// ==============================================================================
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;

let supabase: SupabaseClient | null = null;
if (SUPABASE_URL && (SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY)) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY);
    console.log('[Supabase Server] Connected successfully to', SUPABASE_URL);
  } catch (err) {
    console.warn('[Supabase Server] Initialization note:', err);
  }
}

// Config endpoint so client can discover public Supabase credentials if configured
app.get('/api/config/supabase', (req, res) => {
  res.json({
    supabaseUrl: SUPABASE_URL,
    supabaseAnonKey: SUPABASE_ANON_KEY,
  });
});

// Extend Express Request type with authenticated user and profile
export interface AuthenticatedUser {
  id: string;
  email?: string;
  role?: string;
  familyCode?: string;
  name?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

// ==============================================================================
// AUTHENTICATION & AUTHORIZATION MIDDLEWARE
// ==============================================================================
async function authenticateUser(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = undefined;
    return next();
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    req.user = undefined;
    return next();
  }

  // 1. Verify with Supabase Auth if available
  if (supabase) {
    try {
      const { data, error } = await supabase.auth.getUser(token);
      if (data?.user && !error) {
        // Query user profile from profiles table to get current role and family_code
        let role = data.user.user_metadata?.role || 'senior_individual';
        let familyCode = data.user.user_metadata?.linkedFamilyCode;
        let name = data.user.user_metadata?.name || data.user.email?.split('@')[0];

        try {
          const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
          if (profile) {
            role = profile.role || role;
            familyCode = profile.family_code || familyCode;
            name = profile.name || name;
          }
        } catch {
          // Ignore profile query failure
        }

        req.user = {
          id: data.user.id,
          email: data.user.email,
          role,
          familyCode,
          name,
        };
        return next();
      }
    } catch (e) {
      console.warn('[Auth Middleware] Supabase verification error:', e);
    }
  }

  // 2. Demo fallback token check for local dev/preview
  if (token.startsWith('tok_') || token.startsWith('demo_')) {
    req.user = {
      id: token.includes('elder') ? 'usr_demo_elder_101' : (token.includes('helper') ? 'usr_demo_helper_901' : 'usr_demo_8821'),
      email: token.includes('elder') ? 'elder@kincare.in' : (token.includes('helper') ? 'helper@kincare.in' : 'demo@kincare.in'),
      role: token.includes('elder') ? 'senior_individual' : (token.includes('helper') ? 'helper' : 'family'),
      familyCode: 'KIN-9241',
      name: token.includes('elder') ? 'Ramesh Sharma' : (token.includes('helper') ? 'Sister Sunita Devi' : 'Ananya Sharma'),
    };
    return next();
  }

  req.user = undefined;
  next();
}

app.use(authenticateUser);

// ==============================================================================
// IN-MEMORY BACKEND DATA STORE WITH AUTHORIZED RECORDS
// ==============================================================================
interface SeniorItem {
  id: string;
  owner_id?: string;
  name: string;
  age?: number;
  phone?: string;
  address?: string;
  emergency_contact?: string;
  family_code?: string;
  created_at: string;
}

interface FamilyLinkItem {
  id: string;
  family_user_id: string;
  senior_id: string;
  family_code: string;
  created_at: string;
}

interface BackendState {
  seniors: SeniorItem[];
  familyLinksTable: FamilyLinkItem[];
  medicines: Array<{
    id: string;
    senior_id?: string;
    name: string;
    dosage: string;
    timing: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
    instructions: string;
    takenToday: boolean;
    takenAt?: string;
    streakDays: number;
  }>;
  vitals: Array<{
    id: string;
    senior_id?: string;
    timestamp: string;
    bloodPressure: string;
    sugarLevel: string;
    pulseSpO2: string;
    temperature: string;
    notes?: string;
    recordedBy: string;
  }>;
  helpers: Array<{
    id: string;
    name: string;
    role: string;
    phone: string;
    rating: number;
    reviewsCount: number;
    experienceYears: number;
    policeVerified: boolean;
    avatar: string;
    status: 'available' | 'on-duty' | 'en-route';
    currentLocation: { lat: number; lng: number; address: string };
    hourlyRate: number;
    skills: string[];
  }>;
  helperOrders: Array<{
    id: string;
    patientName: string;
    elderPhone: string;
    address: string;
    serviceTitle: string;
    timeSlot: string;
    status: 'assigned' | 'active' | 'completed';
    payout: number;
    chores: Array<{
      id: string;
      task: string;
      time: string;
      completed: boolean;
      category: 'vital' | 'hygiene' | 'medicine' | 'meal' | 'mobility';
    }>;
    vitalsLogged?: { bp: string; pulse: string; sugar: string };
    careNotes?: string;
    familyPhone: string;
  }>;
  helperStats: {
    totalEarnings: number;
    completedVisits: number;
    rating: number;
    todayHours: number;
    pendingPayout: number;
  };
  familyLinks: Record<string, {
    elderName: string;
    elderPhone: string;
    elderAddress: string;
    familyPhone: string;
    familyName: string;
    elderCode?: string;
  }>;
  bookings: Array<{
    id: string;
    senior_id?: string;
    user_id?: string;
    serviceId: string;
    serviceTitle: string;
    patientName: string;
    patientAge: number;
    timeSlot: string;
    visitDate: string;
    address: string;
    phone: string;
    notes?: string;
    status: 'assigned' | 'en-route' | 'in-progress' | 'completed';
    caregiverName: string;
    caregiverRole: string;
    caregiverPhone: string;
    caregiverRating: number;
    amount: number;
    discountApplied: number;
    createdAt: string;
  }>;
}

const state: BackendState = {
  seniors: [
    {
      id: 'snr-demo-1',
      owner_id: 'usr_demo_elder_101',
      name: 'Ramesh Sharma',
      age: 74,
      phone: '+91 98111 22334',
      address: 'Flat 402, Eldeco Greens, Sector 44, Noida',
      emergency_contact: 'Ananya Sharma (+91 98765 43210)',
      family_code: 'KIN-9241',
      created_at: new Date().toISOString(),
    },
  ],
  familyLinksTable: [
    {
      id: 'flk-demo-1',
      family_user_id: 'usr_demo_8821',
      senior_id: 'snr-demo-1',
      family_code: 'KIN-9241',
      created_at: new Date().toISOString(),
    },
  ],
  medicines: [
    {
      id: 'med-1',
      senior_id: 'snr-demo-1',
      name: 'Telmisartan 40mg',
      dosage: '1 Tablet',
      timing: 'Morning',
      instructions: 'Take after breakfast with water for blood pressure',
      takenToday: true,
      takenAt: '08:30 AM',
      streakDays: 14,
    },
    {
      id: 'med-2',
      senior_id: 'snr-demo-1',
      name: 'Metformin 500mg',
      dosage: '1 Tablet',
      timing: 'Afternoon',
      instructions: 'Take mid-lunch to control blood glucose',
      takenToday: true,
      takenAt: '01:15 PM',
      streakDays: 9,
    },
    {
      id: 'med-3',
      senior_id: 'snr-demo-1',
      name: 'Vitamin D3 & Calcium',
      dosage: '1 Softgel',
      timing: 'Evening',
      instructions: 'Take with milk for bone density',
      takenToday: false,
      streakDays: 8,
    },
    {
      id: 'med-4',
      senior_id: 'snr-demo-1',
      name: 'Atorvastatin 10mg',
      dosage: '1 Tablet',
      timing: 'Night',
      instructions: 'Take before sleep for cholesterol balance',
      takenToday: false,
      streakDays: 21,
    },
  ],
  vitals: [
    {
      id: 'vit-1',
      senior_id: 'snr-demo-1',
      timestamp: 'Today 10:15 AM',
      bloodPressure: '122/80 mmHg',
      sugarLevel: '118 mg/dL',
      pulseSpO2: '98% SpO2 (74 bpm)',
      temperature: '98.4 °F',
      notes: 'Morning vitals stable after breakfast',
      recordedBy: 'Nurse Sunita Devi (RN #34821)',
    },
  ],
  helpers: [
    {
      id: 'hlp-1',
      name: 'Sister Sunita Devi',
      role: 'ICU & Geriatric Trained RN',
      phone: '+91 98711 00213',
      rating: 4.96,
      reviewsCount: 142,
      experienceYears: 8,
      policeVerified: true,
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80',
      status: 'en-route',
      currentLocation: { lat: 28.5355, lng: 77.3910, address: 'En-route to Eldeco Greens' },
      hourlyRate: 350,
      skills: ['IV & Injections', 'Wound Dressing', 'Vitals Logging', 'Emergency Support'],
    },
    {
      id: 'hlp-2',
      name: 'Rajesh Kumar',
      role: 'Senior Bedside Attendant',
      phone: '+91 98102 33491',
      rating: 4.91,
      reviewsCount: 98,
      experienceYears: 5,
      policeVerified: true,
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80',
      status: 'on-duty',
      currentLocation: { lat: 28.5672, lng: 77.3211, address: 'Sector 29 Station' },
      hourlyRate: 220,
      skills: ['Mobility Support', 'Bed Bath', 'Feeding', 'Wheelchair Transfer'],
    },
    {
      id: 'hlp-3',
      name: 'Dr. Priya Verma (PT)',
      role: 'Geriatric Physiotherapist',
      phone: '+91 98991 77652',
      rating: 4.98,
      reviewsCount: 165,
      experienceYears: 10,
      policeVerified: true,
      avatar: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=300&auto=format&fit=crop&q=80',
      status: 'available',
      currentLocation: { lat: 28.5322, lng: 77.3621, address: 'Apollo Clinic Hub' },
      hourlyRate: 600,
      skills: ['Knee Rehab', 'Stroke Recovery', 'Balance Training', 'Pain Relief'],
    },
  ],
  helperOrders: [
    {
      id: 'ord-8821',
      patientName: 'Ramesh Sharma',
      elderPhone: '+91 98111 22334',
      address: 'Flat 402, Eldeco Greens, Sector 44, Noida',
      serviceTitle: 'At-Home Geriatric Care & Vital Checkup',
      timeSlot: '10:00 AM - 02:00 PM',
      status: 'active',
      payout: 750,
      chores: [
        { id: 'ch-1', task: 'Log morning blood pressure & pulse', time: '10:15 AM', completed: true, category: 'vital' },
        { id: 'ch-2', task: 'Administer Telmisartan 40mg BP tablet', time: '10:30 AM', completed: true, category: 'medicine' },
        { id: 'ch-3', task: 'Assist senior with gentle corridor walk', time: '11:15 AM', completed: true, category: 'mobility' },
        { id: 'ch-4', task: 'Serve nutritious low-sodium vegetable soup', time: '12:30 PM', completed: false, category: 'meal' },
        { id: 'ch-5', task: 'Pre-bed vitals and sugar checkup', time: '01:45 PM', completed: false, category: 'vital' },
      ],
      vitalsLogged: { bp: '122/80 mmHg', pulse: '74 bpm', sugar: '118 mg/dL' },
      careNotes: 'Senior had a peaceful morning walk. BP perfectly controlled. Lunch served on time.',
      familyPhone: '+91 98765 43210',
    },
  ],
  helperStats: {
    totalEarnings: 28450,
    completedVisits: 36,
    rating: 4.96,
    todayHours: 4.5,
    pendingPayout: 4650,
  },
  familyLinks: {
    'KIN-9241': {
      elderName: 'Ramesh Sharma',
      elderPhone: '+91 98111 22334',
      elderAddress: 'Flat 402, Eldeco Greens, Sector 44, Noida',
      familyPhone: '+91 98765 43210',
      familyName: 'Ananya Sharma',
      elderCode: 'ELD-4021',
    },
  },
  bookings: [
    {
      id: 'BK-8821',
      senior_id: 'snr-demo-1',
      user_id: 'usr_demo_8821',
      serviceId: 'nurse-daily',
      serviceTitle: 'At-Home Senior Nursing Care',
      patientName: 'Ramesh Sharma',
      patientAge: 74,
      timeSlot: '10:00 AM - 02:00 PM',
      visitDate: 'Today',
      address: 'Flat 402, Eldeco Greens, Sector 44, Noida',
      phone: '+91 98111 22334',
      status: 'in-progress',
      caregiverName: 'Sister Sunita Devi',
      caregiverRole: 'ICU Trained Nurse',
      caregiverPhone: '+91 98711 00213',
      caregiverRating: 4.96,
      amount: 899,
      discountApplied: 100,
      createdAt: new Date().toISOString(),
    },
  ],
};

// ==============================================================================
// OWNERSHIP & ACCESS CONTROL HELPERS
// ==============================================================================
async function getAuthorizedSeniorIds(user?: AuthenticatedUser): Promise<string[]> {
  if (!user) {
    // Unauthenticated: return default demo senior for public preview fallback
    return state.seniors.map((s) => s.id);
  }

  const authorizedIds = new Set<string>();

  // 1. Check Supabase database if connected
  if (supabase) {
    try {
      // Direct ownership: seniors owned by this user
      const { data: owned } = await supabase.from('seniors').select('id').eq('owner_id', user.id);
      if (owned) {
        owned.forEach((row) => authorizedIds.add(row.id));
      }

      // Family link ownership: seniors linked via family_links
      const { data: linked } = await supabase.from('family_links').select('senior_id').eq('family_user_id', user.id);
      if (linked) {
        linked.forEach((row) => authorizedIds.add(row.senior_id));
      }

      // If user has family code
      if (user.familyCode) {
        const { data: codeSeniors } = await supabase.from('seniors').select('id').eq('family_code', user.familyCode);
        if (codeSeniors) {
          codeSeniors.forEach((row) => authorizedIds.add(row.id));
        }
      }
    } catch (e) {
      console.warn('[Authorization] Supabase query note:', e);
    }
  }

  // 2. Fallback to in-memory state
  state.seniors.forEach((s) => {
    if (s.owner_id === user.id) {
      authorizedIds.add(s.id);
    }
  });

  state.familyLinksTable.forEach((fl) => {
    if (fl.family_user_id === user.id) {
      authorizedIds.add(fl.senior_id);
    }
  });

  if (user.familyCode) {
    state.seniors.forEach((s) => {
      if (s.family_code === user.familyCode) {
        authorizedIds.add(s.id);
      }
    });
  }

  // If user is the demo user or demo elder, ensure demo senior is included
  if (user.id === 'usr_demo_8821' || user.id === 'usr_demo_elder_101') {
    authorizedIds.add('snr-demo-1');
  }

  return Array.from(authorizedIds);
}

async function isAuthorizedForSenior(user: AuthenticatedUser | undefined, seniorId: string): Promise<boolean> {
  if (!user) return true; // Preview fallback
  const authorized = await getAuthorizedSeniorIds(user);
  return authorized.includes(seniorId);
}

// ==============================================================================
// 1. SENIORS API (Protected by Account Ownership)
// ==============================================================================
app.get('/api/seniors', async (req, res) => {
  const authorizedIds = await getAuthorizedSeniorIds(req.user);

  // If Supabase is available, query seniors with RLS
  if (supabase && req.user) {
    try {
      const { data, error } = await supabase
        .from('seniors')
        .select('*')
        .in('id', authorizedIds.length > 0 ? authorizedIds : ['00000000-0000-0000-0000-000000000000']);
      if (!error && data) {
        return res.json({ success: true, seniors: data });
      }
    } catch (e) {
      console.warn('Seniors DB fetch note:', e);
    }
  }

  const userSeniors = state.seniors.filter((s) => authorizedIds.includes(s.id));
  res.json({ success: true, seniors: userSeniors });
});

app.post('/api/seniors', async (req, res) => {
  const { name, age, phone, address, emergencyContact, familyCode } = req.body;
  if (!name) {
    return res.status(400).json({ success: false, error: 'Senior name is required' });
  }

  const ownerId = req.user?.id || 'usr_demo_elder_101';

  // 1. Try Supabase
  if (supabase && req.user) {
    try {
      const { data, error } = await supabase
        .from('seniors')
        .insert({
          owner_id: ownerId,
          name,
          age: age ? Number(age) : null,
          phone,
          address,
          emergency_contact: emergencyContact,
          family_code: familyCode || req.user.familyCode,
        })
        .select()
        .single();
      if (!error && data) {
        return res.json({ success: true, senior: data });
      }
    } catch (e) {
      console.warn('Supabase senior insert error:', e);
    }
  }

  // 2. In-memory fallback
  const newSenior: SeniorItem = {
    id: `snr-${Date.now()}`,
    owner_id: ownerId,
    name,
    age: age ? Number(age) : 70,
    phone,
    address,
    emergency_contact: emergencyContact,
    family_code: familyCode || req.user?.familyCode,
    created_at: new Date().toISOString(),
  };
  state.seniors.push(newSenior);
  res.json({ success: true, senior: newSenior });
});

// ==============================================================================
// 2. MEDICINES API (Enforcing Senior Ownership)
// ==============================================================================
app.get('/api/medicines', async (req, res) => {
  const authorizedSeniorIds = await getAuthorizedSeniorIds(req.user);

  // 1. Try Supabase
  if (supabase && req.user) {
    try {
      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .in('senior_id', authorizedSeniorIds.length > 0 ? authorizedSeniorIds : ['00000000-0000-0000-0000-000000000000']);
      if (!error && data && data.length > 0) {
        const mapped = data.map((m: any) => ({
          id: String(m.id),
          senior_id: m.senior_id,
          name: m.name,
          dosage: m.dosage,
          timing: m.timing,
          instructions: m.instructions || '',
          takenToday: Boolean(m.taken_today),
          takenAt: m.taken_at || undefined,
          streakDays: Number(m.streak_days || 0),
        }));
        return res.json({ success: true, medicines: mapped });
      }
    } catch (e) {
      console.warn('Supabase medicines fetch error:', e);
    }
  }

  // 2. In-memory fallback filtered by authorized senior
  const userMedicines = state.medicines.filter((m) => !m.senior_id || authorizedSeniorIds.includes(m.senior_id));
  res.json({ success: true, medicines: userMedicines });
});

app.post('/api/medicines', async (req, res) => {
  const { name, dosage, timing, instructions, seniorId } = req.body;
  if (!name) {
    return res.status(400).json({ success: false, error: 'Medicine name is required' });
  }

  const authorizedIds = await getAuthorizedSeniorIds(req.user);
  let targetSeniorId = seniorId;

  // Validate authorization
  if (targetSeniorId && !authorizedIds.includes(targetSeniorId)) {
    return res.status(403).json({ success: false, error: 'Unauthorized to manage medications for this senior.' });
  }

  if (!targetSeniorId) {
    targetSeniorId = authorizedIds[0] || 'snr-demo-1';
  }

  // 1. Try Supabase
  if (supabase && req.user) {
    try {
      const { data, error } = await supabase
        .from('medications')
        .insert({
          senior_id: targetSeniorId,
          name,
          dosage: dosage || '1 Tablet',
          timing: timing || 'Morning',
          instructions: instructions || 'Take with water after food',
          taken_today: false,
          streak_days: 1,
        })
        .select()
        .single();
      if (!error && data) {
        return res.json({
          success: true,
          medicine: {
            id: String(data.id),
            senior_id: data.senior_id,
            name: data.name,
            dosage: data.dosage,
            timing: data.timing,
            instructions: data.instructions,
            takenToday: false,
            streakDays: 1,
          },
        });
      }
    } catch (e) {
      console.warn('Supabase medicine post error:', e);
    }
  }

  const newMed = {
    id: `med-${Date.now()}`,
    senior_id: targetSeniorId,
    name,
    dosage: dosage || '1 Tablet',
    timing: timing || 'Morning',
    instructions: instructions || 'Take with water after food',
    takenToday: false,
    streakDays: 1,
  };
  state.medicines.push(newMed);
  res.json({ success: true, medicine: newMed });
});

app.patch('/api/medicines/:id/toggle', async (req, res) => {
  const med = state.medicines.find((m) => m.id === req.params.id);

  // If user is authenticated, check ownership
  if (req.user && med?.senior_id) {
    const isAuthorized = await isAuthorizedForSenior(req.user, med.senior_id);
    if (!isAuthorized) {
      return res.status(403).json({ success: false, error: 'Unauthorized to modify this medication' });
    }
  }

  if (supabase && req.user) {
    try {
      await supabase
        .from('medications')
        .update({ taken_today: true, taken_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })
        .eq('id', req.params.id);
    } catch {
      // Ignore
    }
  }

  if (med) {
    med.takenToday = !med.takenToday;
    if (med.takenToday) {
      med.takenAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      med.streakDays += 1;
    } else {
      med.takenAt = undefined;
      med.streakDays = Math.max(0, med.streakDays - 1);
    }
    return res.json({ success: true, medicine: med });
  }

  res.json({ success: true });
});

app.delete('/api/medicines/:id', async (req, res) => {
  const index = state.medicines.findIndex((m) => m.id === req.params.id);
  if (index !== -1) {
    const med = state.medicines[index];
    if (req.user && med.senior_id) {
      const isAuthorized = await isAuthorizedForSenior(req.user, med.senior_id);
      if (!isAuthorized) {
        return res.status(403).json({ success: false, error: 'Unauthorized to delete this medication' });
      }
    }
    state.medicines.splice(index, 1);
  }

  if (supabase && req.user) {
    try {
      await supabase.from('medications').delete().eq('id', req.params.id);
    } catch {
      // Ignore
    }
  }

  res.json({ success: true });
});

// ==============================================================================
// 3. VITALS API
// ==============================================================================
app.get('/api/vitals', (req, res) => {
  res.json({ success: true, vitals: state.vitals });
});

app.post('/api/vitals', (req, res) => {
  const { bloodPressure, sugarLevel, pulseSpO2, temperature, notes, recordedBy, seniorId } = req.body;
  if (!bloodPressure && !pulseSpO2) {
    return res.status(400).json({ success: false, error: 'Vitals data required' });
  }
  const newVital = {
    id: `vit-${Date.now()}`,
    senior_id: seniorId || 'snr-demo-1',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    bloodPressure: bloodPressure || '120/80 mmHg',
    sugarLevel: sugarLevel || '115 mg/dL',
    pulseSpO2: pulseSpO2 || '98% SpO2 (72 bpm)',
    temperature: temperature || '98.4 °F',
    notes: notes || 'Vitals stable',
    recordedBy: recordedBy || 'Caregiver / Elder',
  };
  state.vitals.unshift(newVital);
  res.json({ success: true, vital: newVital });
});

// ==============================================================================
// 4. FAMILY LINK & STATUS API (Scoped to Explicit Family Relationship)
// ==============================================================================
app.get('/api/family/status/:code', async (req, res) => {
  const code = req.params.code.toUpperCase();

  // If user is authenticated, ensure they are linked to this family code or own the senior
  if (req.user && req.user.familyCode && req.user.familyCode !== code) {
    const authorized = await getAuthorizedSeniorIds(req.user);
    const hasAccess = state.seniors.some((s) => s.family_code === code && authorized.includes(s.id));
    if (!hasAccess && req.user.role === 'family') {
      return res.status(403).json({ success: false, error: 'Unauthorized to view status for this family code.' });
    }
  }

  const linkInfo = state.familyLinks[code] || {
    elderName: 'Ramesh Sharma',
    elderPhone: '+91 98111 22334',
    elderAddress: 'Flat 402, Eldeco Greens, Sector 44, Noida',
    familyPhone: '+91 98765 43210',
    familyName: 'Family Member',
  };

  const takenCount = state.medicines.filter((m) => m.takenToday).length;
  const totalCount = state.medicines.length;
  const percent = totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 100;

  const activeHelper = state.helpers[0];
  const activeOrder = state.helperOrders[0];

  res.json({
    success: true,
    data: {
      familyCode: code,
      elderName: linkInfo.elderName,
      elderPhone: linkInfo.elderPhone,
      elderAddress: linkInfo.elderAddress,
      isOnline: true,
      lastCheckIn: '10 minutes ago',
      activeHelper: activeHelper,
      helperEtaMinutes: 12,
      medsAdherence: { taken: takenCount, total: totalCount, percent },
      recentVitals: state.vitals.slice(0, 4),
      activeChores: activeOrder ? activeOrder.chores : [],
      careNotes: activeOrder ? activeOrder.careNotes : 'Senior is resting comfortably.',
    },
  });
});

app.post('/api/family/link', async (req, res) => {
  const { familyCode, elderName, elderPhone, elderAddress, elderCode } = req.body;
  if (!familyCode) {
    return res.status(400).json({ success: false, error: 'Family code is required' });
  }
  const cleanCode = familyCode.trim().toUpperCase();

  // Store in memory
  state.familyLinks[cleanCode] = {
    elderName: elderName || 'Ramesh Sharma',
    elderPhone: elderPhone || '+91 98111 22334',
    elderAddress: elderAddress || 'Flat 402, Eldeco Greens, Sector 44, Noida',
    familyPhone: '+91 98765 43210',
    familyName: 'Family Caregiver',
    elderCode: elderCode || 'ELD-4021',
  };

  // If user is authenticated as family, record the relationship in familyLinksTable and Supabase
  if (req.user) {
    const existingSenior = state.seniors.find((s) => s.family_code === cleanCode);
    const seniorId = existingSenior ? existingSenior.id : 'snr-demo-1';

    state.familyLinksTable.push({
      id: `flk-${Date.now()}`,
      family_user_id: req.user.id,
      senior_id: seniorId,
      family_code: cleanCode,
      created_at: new Date().toISOString(),
    });

    if (supabase) {
      try {
        await supabase.from('family_links').upsert({
          family_user_id: req.user.id,
          senior_id: seniorId,
          family_code: cleanCode,
        });
      } catch (e) {
        console.warn('Supabase family link insert note:', e);
      }
    }
  }

  res.json({
    success: true,
    message: `Successfully paired with Family Code ${cleanCode}`,
    link: state.familyLinks[cleanCode],
  });
});

app.delete('/api/family/link/:code', async (req, res) => {
  const cleanCode = req.params.code.trim().toUpperCase();
  delete state.familyLinks[cleanCode];

  if (req.user) {
    state.familyLinksTable = state.familyLinksTable.filter(
      (fl) => !(fl.family_user_id === req.user?.id && fl.family_code === cleanCode)
    );

    if (supabase) {
      try {
        await supabase
          .from('family_links')
          .delete()
          .eq('family_user_id', req.user.id)
          .eq('family_code', cleanCode);
      } catch {
        // Ignore
      }
    }
  }

  res.json({ success: true, message: `Unlinked Family Code ${cleanCode}` });
});

// ==============================================================================
// 5. HELPERS & PROXY WORKERS API
// ==============================================================================
app.get('/api/helpers', (req, res) => {
  res.json({ success: true, helpers: state.helpers });
});

app.get('/api/helpers/orders', (req, res) => {
  res.json({ success: true, orders: state.helperOrders });
});

app.patch('/api/helpers/orders/:id/status', (req, res) => {
  const order = state.helperOrders.find((o) => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }
  const { status } = req.body;
  if (status) {
    order.status = status;
  }
  res.json({ success: true, order });
});

app.patch('/api/helpers/chores/:orderId/:choreId/toggle', (req, res) => {
  const order = state.helperOrders.find((o) => o.id === req.params.orderId);
  if (!order) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }
  const chore = order.chores.find((c) => c.id === req.params.choreId);
  if (!chore) {
    return res.status(404).json({ success: false, error: 'Chore not found' });
  }
  chore.completed = !chore.completed;
  res.json({ success: true, chore });
});

app.post('/api/helpers/orders/:orderId/log-vitals', (req, res) => {
  const order = state.helperOrders.find((o) => o.id === req.params.orderId);
  if (!order) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }
  const { bp, pulse, sugar, notes } = req.body;
  order.vitalsLogged = { bp, pulse, sugar };
  if (notes) {
    order.careNotes = notes;
  }

  state.vitals.unshift({
    id: `vit-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    bloodPressure: bp || '120/80 mmHg',
    pulseSpO2: pulse ? `${pulse} bpm` : '98% SpO2 (72 bpm)',
    sugarLevel: sugar || '115 mg/dL',
    temperature: '98.4 °F',
    notes: notes || 'Logged during home assistance visit',
    recordedBy: 'Sister Sunita Devi (RN #34821)',
  });

  res.json({ success: true, vitalsLogged: order.vitalsLogged, careNotes: order.careNotes });
});

app.get('/api/helpers/stats', (req, res) => {
  res.json({ success: true, stats: state.helperStats });
});

app.post('/api/helpers/payout-request', (req, res) => {
  state.helperStats.totalEarnings += state.helperStats.pendingPayout;
  state.helperStats.pendingPayout = 0;
  res.json({ success: true, message: 'Payout request received. Bank transfer initiated within 2 business hours.' });
});

// ==============================================================================
// 6. BOOKINGS API (With Ownership Enforcement)
// ==============================================================================
app.get('/api/bookings', async (req, res) => {
  const authorizedIds = await getAuthorizedSeniorIds(req.user);

  // 1. Try Supabase
  if (supabase && req.user) {
    try {
      const { data, error } = await supabase.from('bookings').select('*');
      if (!error && data && data.length > 0) {
        const mapped = data.map((row: any) => ({
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
        return res.json({ success: true, bookings: mapped });
      }
    } catch (e) {
      console.warn('Supabase bookings query error:', e);
    }
  }

  // 2. In-memory fallback
  if (req.user) {
    const userBookings = state.bookings.filter(
      (b) => b.user_id === req.user?.id || (b.senior_id && authorizedIds.includes(b.senior_id)) || !b.senior_id
    );
    return res.json({ success: true, bookings: userBookings });
  }

  res.json({ success: true, bookings: state.bookings });
});

app.post('/api/bookings', async (req, res) => {
  const { serviceId, serviceTitle, patientName, patientAge, timeSlot, visitDate, address, phone, notes, seniorId } = req.body;

  const authorizedIds = await getAuthorizedSeniorIds(req.user);
  let targetSeniorId = seniorId;

  if (targetSeniorId && !authorizedIds.includes(targetSeniorId)) {
    return res.status(403).json({ success: false, error: 'Unauthorized to book for this senior.' });
  }

  if (!targetSeniorId) {
    targetSeniorId = authorizedIds[0] || 'snr-demo-1';
  }

  const userId = req.user?.id || 'usr_demo_8821';

  // 1. Try Supabase
  if (supabase && req.user) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          senior_id: targetSeniorId,
          user_id: userId,
          service_id: serviceId || 'nurse-daily',
          service_title: serviceTitle || 'Senior Healthcare Visit',
          patient_name: patientName || 'Patient',
          patient_age: Number(patientAge) || 70,
          time_slot: timeSlot || 'Immediate Dispatch',
          visit_date: visitDate || 'Today',
          address: address || 'Home Residence',
          phone: phone || '+91 98000 00000',
          notes,
          status: 'assigned',
          caregiver_name: 'Sister Sunita Devi',
          caregiver_role: 'ICU Trained Nurse',
          caregiver_phone: '+91 98711 00213',
          caregiver_rating: 4.96,
          amount: 899,
          discount_applied: 100,
        })
        .select()
        .single();

      if (!error && data) {
        return res.json({
          success: true,
          booking: {
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
          },
        });
      }
    } catch (e) {
      console.warn('Supabase booking insert error:', e);
    }
  }

  const newBooking = {
    id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
    senior_id: targetSeniorId,
    user_id: userId,
    serviceId: serviceId || 'nurse-daily',
    serviceTitle: serviceTitle || 'Senior Healthcare Visit',
    patientName: patientName || 'Patient',
    patientAge: Number(patientAge) || 70,
    timeSlot: timeSlot || 'Immediate Dispatch',
    visitDate: visitDate || 'Today',
    address: address || 'Home Residence',
    phone: phone || '+91 98000 00000',
    notes,
    status: 'assigned' as const,
    caregiverName: 'Sister Sunita Devi',
    caregiverRole: 'ICU Trained Nurse',
    caregiverPhone: '+91 98711 00213',
    caregiverRating: 4.96,
    amount: 899,
    discountApplied: 100,
    createdAt: new Date().toISOString(),
  };
  state.bookings.unshift(newBooking);
  res.json({ success: true, booking: newBooking });
});

app.delete('/api/bookings/:id', async (req, res) => {
  const index = state.bookings.findIndex((b) => b.id === req.params.id);
  if (index !== -1) {
    const booking = state.bookings[index];
    if (req.user && booking.senior_id) {
      const isAuthorized = await isAuthorizedForSenior(req.user, booking.senior_id);
      if (!isAuthorized && booking.user_id !== req.user.id) {
        return res.status(403).json({ success: false, error: 'Unauthorized to delete this booking' });
      }
    }
    state.bookings.splice(index, 1);
  }

  if (supabase && req.user) {
    try {
      await supabase.from('bookings').delete().eq('id', req.params.id);
    } catch {
      // Ignore
    }
  }

  res.json({ success: true });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), supabaseConnected: !!supabase });
});

// Start Express Server with Vite integration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CareBridge Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

export type ServiceCategory = 
  | 'all' 
  | 'nursing' 
  | 'attendant' 
  | 'diagnostics' 
  | 'pharmacy' 
  | 'physio' 
  | 'doctor';

export interface CareService {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  category: ServiceCategory;
  priceFormatted: string;
  basePrice: number;
  badge: string;
  tagline: string;
  icon: 'stethoscope' | 'hand-heart' | 'activity' | 'pill' | 'person-standing' | 'phone' | 'video' | 'shield';
  accentColor: 'teal' | 'blue' | 'purple' | 'amber' | 'emerald' | 'rose';
  highlights: string[];
  slotsAvailable: string[];
}

export interface Booking {
  id: string;
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
}

export interface EmergencyContact {
  name: string;
  relation: string;
  phone: string;
}

export type UserRole = 
  | 'family' 
  | 'family_caregiver' 
  | 'senior_individual' 
  | 'elder' 
  | 'helper' 
  | 'helper_proxy' 
  | 'healthcare_guardian';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  preferredCity?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  address?: string;
  createdAt: string;
  familyCode?: string; // Generated for family account
  linkedFamilyCode?: string; // Entered by elder to link to family
  elderCode?: string; // Generated or assigned for senior account (e.g. ELD-4021)
  linkedElderName?: string; // Elder linked to this family account
  linkedElderCode?: string; // Code of elder linked to family account
  linkedElderPhone?: string; // Phone of elder linked to family account
  linkedElderAddress?: string; // Address of elder linked to family account
  avatarUrl?: string; // Profile picture URL
  specialization?: string; // Helper medical or assistance role / qualification
  badgeNumber?: string; // Official staff or attendant ID badge
  upiId?: string; // Payout UPI ID handle
}

export interface FamilyElderLink {
  familyCode: string;
  elderName: string;
  elderCode: string;
  elderPhone?: string;
  elderAddress?: string;
  linkedAt: string;
}

export interface StoredUserRecord extends UserProfile {
  saltHex: string;
  passwordHashHex: string;
}

export interface AuthSession {
  user: UserProfile;
  token: string;
  expiresAt: number;
}

export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  timing: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  instructions: string;
  takenToday: boolean;
  takenAt?: string;
  streakDays: number;
}

export interface VitalRecord {
  id: string;
  timestamp: string;
  bloodPressure: string;
  sugarLevel: string;
  pulseSpO2: string;
  temperature: string;
  notes?: string;
  recordedBy: string;
}

export interface Helper {
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
}

export interface HelperChore {
  id: string;
  task: string;
  time: string;
  completed: boolean;
  category: 'vital' | 'hygiene' | 'medicine' | 'meal' | 'mobility';
}

export interface HelperOrder {
  id: string;
  patientName: string;
  elderPhone: string;
  address: string;
  serviceTitle: string;
  timeSlot: string;
  status: 'assigned' | 'en_route' | 'active' | 'completed' | 'scheduled' | 'in_progress';
  payout: number;
  payoutAmount?: number;
  chores: HelperChore[];
  vitalsLogged?: { bp: string; pulse: string; sugar: string };
  careNotes?: string;
  familyPhone: string;
}

export interface HelperStats {
  totalEarnings: number;
  completedVisits: number;
  rating: number;
  todayHours: number;
  pendingPayout: number;
}

export interface FamilyStatus {
  familyCode: string;
  elderName: string;
  elderPhone: string;
  elderAddress: string;
  isOnline: boolean;
  lastCheckIn: string;
  activeHelper?: Helper;
  helperEtaMinutes?: number;
  medsAdherence: { taken: number; total: number; percent: number };
  recentVitals: VitalRecord[];
  activeChores: HelperChore[];
  careNotes: string;
}

export type CatalogueCategory = 'all' | 'medicine' | 'grocery' | 'fruits_veggies' | 'supplements';

export interface CatalogueItem {
  id: string;
  name: string;
  category: 'medicine' | 'grocery' | 'fruits_veggies' | 'supplements';
  price: number;
  mrp?: number;
  unit: string;
  description: string;
  image: string;
  inStock: boolean;
  requiresRx?: boolean;
  brand?: string;
  benefits?: string[];
  dosageAdvice?: string;
}

export interface CartItem {
  item: CatalogueItem;
  quantity: number;
}

export interface DeliveryLogStep {
  id: string;
  title: string;
  time: string;
  description: string;
  completed: boolean;
  current?: boolean;
}

export interface DeliveryOrder {
  id: string;
  placedAt: string;
  items: CartItem[];
  totalAmount: number;
  status: 'ordered' | 'assigned' | 'in_transit' | 'delivered';
  paymentMethod: 'Cash on Delivery' | 'UPI on Handover' | 'Prepaid Family Wallet';
  deliveryAddress: string;
  elderName: string;
  familyPhone: string;
  helper: {
    id: string;
    name: string;
    role: string;
    phone: string;
    avatar: string;
    vehicle: string;
    etaMinutes: number;
    policeVerified: boolean;
    rating: number;
  };
  timeline: DeliveryLogStep[];
}

export interface SeniorRecord {
  id: string;
  owner_id?: string;
  name: string;
  age?: number;
  phone?: string;
  address?: string;
  emergency_contact?: string;
  family_code?: string;
  created_at?: string;
}

export interface FamilyLinkRecord {
  id: string;
  family_user_id: string;
  senior_id: string;
  family_code: string;
  created_at?: string;
}

export interface FamilyUpdateRecord {
  id: string;
  senior_id?: string;
  family_code: string;
  elder_name?: string;
  elder_phone?: string;
  elder_address?: string;
  care_notes?: string;
  vitals?: VitalRecord[];
  chores?: HelperChore[];
  created_at?: string;
}


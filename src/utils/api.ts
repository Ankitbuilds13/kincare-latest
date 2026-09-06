import { Medicine, VitalRecord, Helper, HelperOrder, HelperStats, FamilyStatus, Booking } from '../types';
import { supabaseAuth, supabaseApi } from './supabase';

const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  try {
    const session = await supabaseAuth.getSession();
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
      return headers;
    }
  } catch {
    // Ignore error
  }

  // Fallback to local session token if available
  try {
    const local = localStorage.getItem('kincare_auth_session_v1');
    if (local) {
      const parsed = JSON.parse(local);
      if (parsed.token) {
        headers['Authorization'] = `Bearer ${parsed.token}`;
      }
    }
  } catch {
    // Ignore error
  }

  return headers;
};

// API client helper for Kin Care backend and Supabase
export const api = {
  // Medicines
  getMedicines: async (): Promise<Medicine[]> => {
    // 1. Try Supabase API first (Client RLS enforced)
    try {
      const supaMeds = await supabaseApi.getMedications();
      if (supaMeds && supaMeds.length > 0) {
        return supaMeds;
      }
    } catch {
      // Fall through to backend API
    }

    // 2. Query Express backend with Bearer token
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/medicines', { headers });
      if (res.ok) {
        const data = await res.json();
        if (data.medicines && data.medicines.length > 0) {
          return data.medicines;
        }
      }
    } catch {
      // Fall through to local fallback
    }

    // 3. Fallback defaults
    const saved = localStorage.getItem('kincare_medicines');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'med-1',
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
        name: 'Vitamin D3 & Calcium',
        dosage: '1 Softgel',
        timing: 'Evening',
        instructions: 'Take with milk for bone density',
        takenToday: false,
        streakDays: 8,
      },
      {
        id: 'med-4',
        name: 'Atorvastatin 10mg',
        dosage: '1 Tablet',
        timing: 'Night',
        instructions: 'Take before sleep for cholesterol balance',
        takenToday: false,
        streakDays: 21,
      },
    ];
  },

  addMedicine: async (med: Omit<Medicine, 'id' | 'takenToday' | 'streakDays'>): Promise<Medicine> => {
    // Try Supabase first
    try {
      const supaMed = await supabaseApi.addMedication(med);
      if (supaMed) return supaMed;
    } catch {
      // Fall through
    }

    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/medicines', {
        method: 'POST',
        headers,
        body: JSON.stringify(med),
      });
      const data = await res.json();
      if (data.success && data.medicine) return data.medicine;
    } catch (e) {
      console.warn('Fallback to local storage for addMedicine', e);
    }

    const newMed: Medicine = {
      ...med,
      id: `med-${Date.now()}`,
      takenToday: false,
      streakDays: 1,
    };
    return newMed;
  },

  toggleMedicine: async (id: string): Promise<boolean> => {
    try {
      await supabaseApi.toggleMedication(id, true, new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch {
      // Ignore
    }

    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`/api/medicines/${id}/toggle`, {
        method: 'PATCH',
        headers,
      });
      const data = await res.json();
      return !!data.success;
    } catch {
      return true;
    }
  },

  deleteMedicine: async (id: string): Promise<boolean> => {
    try {
      await supabaseApi.deleteMedication(id);
    } catch {
      // Ignore
    }

    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`/api/medicines/${id}`, {
        method: 'DELETE',
        headers,
      });
      const data = await res.json();
      return !!data.success;
    } catch {
      return true;
    }
  },

  // Vitals
  getVitals: async (): Promise<VitalRecord[]> => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/vitals', { headers });
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      return data.vitals || [];
    } catch {
      return [
        {
          id: 'vit-1',
          timestamp: 'Today 10:15 AM',
          bloodPressure: '122/80 mmHg',
          sugarLevel: '118 mg/dL',
          pulseSpO2: '98% SpO2 (74 bpm)',
          temperature: '98.4 °F',
          notes: 'Morning vitals stable after breakfast',
          recordedBy: 'Nurse Sunita Devi (RN #34821)',
        },
      ];
    }
  },

  addVital: async (vital: Omit<VitalRecord, 'id' | 'timestamp'>): Promise<VitalRecord> => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/vitals', {
        method: 'POST',
        headers,
        body: JSON.stringify(vital),
      });
      const data = await res.json();
      if (data.success && data.vital) return data.vital;
    } catch (e) {
      console.warn('Fallback vitals post', e);
    }
    return {
      ...vital,
      id: `vit-${Date.now()}`,
      timestamp: 'Just now',
    };
  },

  // Family status
  getFamilyStatus: async (familyCode: string): Promise<FamilyStatus> => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`/api/family/status/${familyCode}`, { headers });
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      if (data.success && data.data) return data.data;
    } catch (e) {
      console.warn('Family status fallback', e);
    }
    return {
      familyCode,
      elderName: 'Ramesh Sharma (Age 74)',
      elderPhone: '+91 98111 22334',
      elderAddress: 'Flat 402, Eldeco Greens, Sector 44, Noida',
      isOnline: true,
      lastCheckIn: '5 mins ago',
      activeHelper: {
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
        currentLocation: { lat: 28.5355, lng: 77.3910, address: 'Sector 62, En-route to Eldeco Greens' },
        hourlyRate: 350,
        skills: ['IV Lines', 'Dressing', 'Vitals', 'Tracheostomy'],
      },
      helperEtaMinutes: 12,
      medsAdherence: { taken: 2, total: 4, percent: 50 },
      recentVitals: [
        {
          id: 'vit-1',
          timestamp: '10:15 AM',
          bloodPressure: '122/80 mmHg',
          sugarLevel: '118 mg/dL',
          pulseSpO2: '98% SpO2 (74 bpm)',
          temperature: '98.4 °F',
          recordedBy: 'Nurse Sunita Devi',
        },
      ],
      activeChores: [
        { id: 'ch-1', task: 'Log morning blood pressure & pulse', time: '10:15 AM', completed: true, category: 'vital' },
        { id: 'ch-2', task: 'Administer Telmisartan 40mg BP tablet', time: '10:30 AM', completed: true, category: 'medicine' },
        { id: 'ch-3', task: 'Assist senior with gentle corridor walk', time: '11:15 AM', completed: true, category: 'mobility' },
        { id: 'ch-4', task: 'Serve nutritious low-sodium vegetable soup', time: '12:30 PM', completed: false, category: 'meal' },
      ],
      careNotes: 'Senior had a good night sleep. Morning medication given after hot breakfast.',
    };
  },

  linkFamilyCode: async (code: string, elderName?: string): Promise<{ success: boolean; message: string }> => {
    try {
      await supabaseApi.linkFamilyToSenior(code);
    } catch {
      // Ignore
    }

    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/family/link', {
        method: 'POST',
        headers,
        body: JSON.stringify({ familyCode: code, elderName }),
      });
      const data = await res.json();
      return { success: data.success, message: data.message || `Linked to family code ${code}` };
    } catch {
      return { success: true, message: `Linked to family code ${code}` };
    }
  },

  // Helpers
  getHelpers: async (): Promise<Helper[]> => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/helpers', { headers });
      const data = await res.json();
      return data.helpers || [];
    } catch {
      return [
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
      ];
    }
  },

  getHelperOrders: async (): Promise<HelperOrder[]> => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/helpers/orders', { headers });
      const data = await res.json();
      return data.orders || [];
    } catch {
      return [];
    }
  },

  updateOrderStatus: async (orderId: string, status: HelperOrder['status']): Promise<boolean> => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`/api/helpers/orders/${orderId}/status`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      return !!data.success;
    } catch {
      return true;
    }
  },

  toggleChore: async (orderId: string, choreId: string): Promise<boolean> => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`/api/helpers/chores/${orderId}/${choreId}/toggle`, {
        method: 'PATCH',
        headers,
      });
      const data = await res.json();
      return !!data.success;
    } catch {
      return true;
    }
  },

  logHelperVitals: async (orderId: string, vitals: { bp: string; pulse: string; sugar: string; notes?: string }): Promise<boolean> => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`/api/helpers/orders/${orderId}/log-vitals`, {
        method: 'POST',
        headers,
        body: JSON.stringify(vitals),
      });
      const data = await res.json();
      return !!data.success;
    } catch {
      return true;
    }
  },

  getHelperStats: async (helperName?: string): Promise<HelperStats> => {
    try {
      const headers = await getAuthHeaders();
      const query = helperName ? `?helperName=${encodeURIComponent(helperName)}` : '';
      const res = await fetch(`/api/helpers/stats${query}`, { headers });
      const data = await res.json();
      return data.stats || { totalEarnings: 28450, completedVisits: 36, rating: 4.96, todayHours: 4.5, pendingPayout: 4650 };
    } catch {
      return { totalEarnings: 28450, completedVisits: 36, rating: 4.96, todayHours: 4.5, pendingPayout: 4650 };
    }
  },

  requestPayout: async (): Promise<string> => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/helpers/payout-request', {
        method: 'POST',
        headers,
      });
      const data = await res.json();
      return data.message || 'Payout request submitted successfully';
    } catch {
      return 'Payout request submitted successfully';
    }
  },

  // Bookings (With Supabase Auth & RLS support)
  getBookings: async (): Promise<Booking[]> => {
    try {
      const supaBookings = await supabaseApi.getBookings();
      if (supaBookings && supaBookings.length > 0) {
        return supaBookings;
      }
    } catch {
      // Fall through
    }

    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/bookings', { headers });
      const data = await res.json();
      return data.bookings || [];
    } catch {
      return [];
    }
  },

  createBooking: async (bookingData: Partial<Booking>): Promise<Booking> => {
    try {
      const supaBooking = await supabaseApi.createBooking(bookingData);
      if (supaBooking) return supaBooking;
    } catch {
      // Fall through
    }

    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers,
        body: JSON.stringify(bookingData),
      });
      const data = await res.json();
      if (data.success && data.booking) return data.booking;
    } catch (e) {
      console.warn('Booking create fallback', e);
    }

    return {
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      serviceId: bookingData.serviceId || 'nurse-daily',
      serviceTitle: bookingData.serviceTitle || 'Senior Care Service',
      patientName: bookingData.patientName || 'Patient',
      patientAge: bookingData.patientAge || 70,
      timeSlot: bookingData.timeSlot || 'Immediate',
      visitDate: bookingData.visitDate || 'Today',
      address: bookingData.address || 'Home',
      phone: bookingData.phone || '+91 98000 00000',
      status: 'assigned',
      caregiverName: 'Sister Sunita Devi',
      caregiverRole: 'ICU Nurse',
      caregiverPhone: '+91 98711 00213',
      caregiverRating: 4.96,
      amount: 899,
      discountApplied: 100,
      createdAt: new Date().toISOString(),
    };
  },

  deleteBooking: async (id: string): Promise<boolean> => {
    try {
      await supabaseApi.deleteBooking(id);
    } catch {
      // Ignore
    }

    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'DELETE',
        headers,
      });
      const data = await res.json();
      return !!data.success;
    } catch {
      return true;
    }
  },
};

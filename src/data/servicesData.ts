import { CareService, Booking } from '../types';

export const CITIES = [
  'South Extension, Delhi',
  'Indiranagar, Bengaluru',
  'Bandra West, Mumbai',
  'Jubilee Hills, Hyderabad',
  'Koregaon Park, Pune',
  'Alwarpet, Chennai',
  'Manhattan, New York'
];

export const SERVICES_DATA: CareService[] = [
  {
    id: 'home-nurse',
    title: 'Trained Home Nurse',
    tagline: 'Certified Clinical Nurse at Home',
    shortDesc: 'Injections, wound dressing, BP & sugar monitoring, IV drip, and post-hospitalization recovery.',
    fullDesc: 'Government-registered and hospital-trained clinical nurses. Safe administration of intramuscular and IV medicines, surgical dressing change, vital sign stabilization, and compassionate bedside care.',
    category: 'nursing',
    priceFormatted: 'From $15 / visit',
    basePrice: 15,
    badge: 'Hospital Certified',
    icon: 'stethoscope',
    accentColor: 'teal',
    highlights: [
      'Daily vitals log & digital health chart',
      'Wound cleaning & sterile dressing',
      'Catheter, Ryle\'s tube & cannula support',
      'Doctor-prescribed IV & intramuscular injections'
    ],
    slotsAvailable: ['Morning (08:00 AM - 11:00 AM)', 'Afternoon (01:00 PM - 04:00 PM)', 'Evening (05:00 PM - 08:00 PM)']
  },
  {
    id: 'house-attendant',
    title: 'House Help & Bedside Aide',
    tagline: 'Compassionate Caregiver & Helper',
    shortDesc: 'Help with bathing, mobility, daily meal prep, medication reminders, and warm companionship.',
    fullDesc: 'Dedicated, empathetic care attendants trained in senior ergonomics, fall prevention, hygienic assistance, wheelchair handling, and engaging elderly companionship to prevent loneliness.',
    category: 'attendant',
    priceFormatted: '12h / 24h shifts',
    basePrice: 28,
    badge: '12h & 24h Shifts',
    icon: 'hand-heart',
    accentColor: 'blue',
    highlights: [
      'Assistance with walking, bathing & toileting',
      'Timely medication dispensing & hydration',
      'Healthy diet prep & assisted spoon feeding',
      'Gentle indoor walks & conversation companion'
    ],
    slotsAvailable: ['Day Shift (08:00 AM - 08:00 PM)', 'Night Shift (08:00 PM - 08:00 AM)', '24-Hour Live-in Aide']
  },
  {
    id: 'lab-tests',
    title: 'Lab Tests at Home',
    tagline: 'Painless Diagnostic Blood Draw',
    shortDesc: 'Painless home sample collection. Complete blood count, lipid, sugar check, and home ECG.',
    fullDesc: 'Experienced phlebotomists trained specifically for sensitive and fragile senior veins. Sterile vacuum vials, painless needle technology, cold-chain transport, and digital report dispatch via WhatsApp.',
    category: 'diagnostics',
    priceFormatted: 'Results in 6 Hours',
    basePrice: 18,
    badge: 'Reports in 6h',
    icon: 'activity',
    accentColor: 'purple',
    highlights: [
      'Diabetic Profile (HbA1c & Fasting Glucose)',
      'Cardiac & Lipid Health Profile',
      'Portable 12-Lead Home ECG with instant read',
      'Kidney & Liver Function Assessment'
    ],
    slotsAvailable: ['Early Morning Fasting (06:30 AM - 09:00 AM)', 'Mid-Day (11:00 AM - 02:00 PM)']
  },
  {
    id: 'medicine-delivery',
    title: 'Medicine Refills',
    tagline: 'Organized Pill Dispensing & Refills',
    shortDesc: 'Monthly medicine delivered automatically. Comes organized in labeled morning/night pillboxes.',
    fullDesc: 'Never miss a dose again. Certified pharmacists verify your prescription, pre-sort your tablets into intuitive morning, noon, and night color-coded blister trays, and automatically replenish before you run out.',
    category: 'pharmacy',
    priceFormatted: '20% Senior Discount',
    basePrice: 25,
    badge: '20% Concession',
    icon: 'pill',
    accentColor: 'amber',
    highlights: [
      'Labeled AM / PM weekly pill organizer included',
      'Direct pharmacist consultation on drug interactions',
      'Auto-refill every 28 days with SMS alerts',
      'Free urgent temperature-sensitive cold delivery'
    ],
    slotsAvailable: ['Today Express (Within 2 Hours)', 'Scheduled Monthly Auto-Ship']
  },
  {
    id: 'physiotherapy',
    title: 'Physiotherapy',
    tagline: 'Pain Relief & Mobility Restoration',
    shortDesc: 'Gentle exercises at home for arthritis, back pain, fall prevention, and stroke rehabilitation.',
    fullDesc: 'Licensed geriatric physical therapists focusing on joint preservation, gait retraining, balance exercises to prevent falls, and post-joint replacement rehabilitation in the comfort of your living room.',
    category: 'physio',
    priceFormatted: '45-min Session',
    basePrice: 22,
    badge: '45-min Session',
    icon: 'person-standing',
    accentColor: 'emerald',
    highlights: [
      'Osteoarthritis knee & hip pain relief',
      'Neurological & stroke mobility rehabilitation',
      'Balance & postural stability training',
      'TENS machine & passive joint mobilization'
    ],
    slotsAvailable: ['Morning (09:00 AM - 12:00 PM)', 'Afternoon (02:00 PM - 05:00 PM)']
  },
  {
    id: 'doctor-consult',
    title: 'Geriatrician Consultation',
    tagline: 'Senior Specialist Doctor at Home',
    shortDesc: 'Senior health specialist consultation via video or house call. Comprehensive health review.',
    fullDesc: 'Experienced MD physicians specializing in senior multi-morbidity, hypertension, memory care, and polypharmacy reduction (optimizing multiple prescriptions to minimize side-effects).',
    category: 'doctor',
    priceFormatted: 'Same-Day Visit',
    basePrice: 35,
    badge: 'Senior MD Specialist',
    icon: 'stethoscope',
    accentColor: 'rose',
    highlights: [
      'Comprehensive elderly health checkup',
      'Review of past medications & dosage tuning',
      'Official digital prescription sent immediately',
      'Follow-up messaging with doctor for 7 days'
    ],
    slotsAvailable: ['Video Teleconsult (Within 30 mins)', 'Home Visit (Scheduled Slot)']
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'SC-8921',
    serviceId: 'home-nurse',
    serviceTitle: 'Trained Home Nurse',
    patientName: 'Robert Vance (76 yrs)',
    patientAge: 76,
    timeSlot: 'Morning (09:30 AM)',
    visitDate: 'Tomorrow',
    address: 'B-42, Gulmohar Enclave, Ground Floor',
    phone: '+1 (555) 438-9210',
    notes: 'Post-op knee dressing check and morning insulin injection.',
    status: 'assigned',
    caregiverName: 'Sister Maria Fernandez, RN',
    caregiverRole: 'Certified Critical Care Nurse (8 yrs exp)',
    caregiverPhone: '+1 (555) 890-4122',
    caregiverRating: 4.95,
    amount: 15,
    discountApplied: 3,
    createdAt: 'Today, 08:30 AM'
  }
];

export const CAREGIVER_POOL = [
  {
    name: 'Sister Mary Joseph, RN',
    role: 'Clinical Nurse & Vitals Specialist',
    rating: 4.9,
    phone: '+1 (555) 234-8911',
    experience: '9 yrs hospital experience'
  },
  {
    name: 'David Sharma, CPT',
    role: 'Senior Mobility & Fall Prevention Aide',
    rating: 4.8,
    phone: '+1 (555) 345-9022',
    experience: '6 yrs geriatric care'
  },
  {
    name: 'Dr. Anita Desai, PT',
    role: 'Licensed Geriatric Physiotherapist',
    rating: 4.95,
    phone: '+1 (555) 456-0133',
    experience: '11 yrs orthopedic rehab'
  },
  {
    name: 'Ravi Kumar',
    role: 'Certified Phlebotomist & Technician',
    rating: 4.9,
    phone: '+1 (555) 567-1244',
    experience: '7 yrs diagnostics laboratory'
  }
];

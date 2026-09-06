import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Truck, 
  Eye, 
  X, 
  Sparkles, 
  Pill, 
  Apple, 
  ShoppingBag,
  HeartPulse,
  RefreshCw,
  PackageCheck,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CatalogueItem, CartItem, DeliveryOrder, CatalogueCategory } from '../types';
import { useAuth } from '../context/AuthContext';

// Default catalogue inventory (medicines, fresh vegetables & fruits, daily groceries)
export const INITIAL_CATALOGUE: CatalogueItem[] = [
  // --- MEDICINES ---
  {
    id: 'med-dolo-650',
    name: 'Dolo 650 Tablet',
    category: 'medicine',
    price: 32,
    mrp: 36,
    unit: 'Strip of 15 Tablets',
    description: 'Paracetamol 650mg micro-encapsulated formula for effective fever reduction and relief from joint and body aches.',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80',
    inStock: true,
    requiresRx: false,
    brand: 'Micro Labs',
    benefits: ['Gentle on stomach', 'Fast absorption within 20 mins', 'Relieves headache & muscular pain'],
    dosageAdvice: '1 tablet after food every 6 to 8 hours as needed. Do not exceed 4 tablets in 24 hours.',
  },
  {
    id: 'med-crocin-adv',
    name: 'Crocin Advance 500mg',
    category: 'medicine',
    price: 25,
    mrp: 28,
    unit: 'Strip of 15 Tablets',
    description: 'Fast acting paracetamol for mild fever, throat pain, and seasonal body ache.',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&auto=format&fit=crop&q=80',
    inStock: true,
    requiresRx: false,
    brand: 'GSK Healthcare',
    benefits: ['Optizorb technology for 5x faster release', 'Safe for elderly when taken as advised'],
    dosageAdvice: '1 tablet with half a glass of warm water after meals.',
  },
  {
    id: 'med-shelcal-500',
    name: 'Shelcal 500 (Calcium + Vit D3)',
    category: 'medicine',
    price: 118,
    mrp: 132,
    unit: 'Strip of 15 Tablets',
    description: 'Elemental Calcium 500mg + Vitamin D3 250 IU to prevent bone density loss and support mobility in seniors.',
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=400&auto=format&fit=crop&q=80',
    inStock: true,
    requiresRx: false,
    brand: 'Torrent Pharma',
    benefits: ['Strengthens knee & hip joints', 'Improves calcium absorption', 'Prevents age-related osteoporosis'],
    dosageAdvice: '1 tablet daily after evening meal or with warm milk.',
  },
  {
    id: 'med-neurobion',
    name: 'Neurobion Forte',
    category: 'medicine',
    price: 42,
    mrp: 48,
    unit: 'Strip of 30 Tablets',
    description: 'Vitamin B-Complex with B12 for nerve health, tingling sensation in feet, and natural energy revitalization.',
    image: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?w=400&auto=format&fit=crop&q=80',
    inStock: true,
    requiresRx: false,
    brand: 'Procter & Gamble',
    benefits: ['Reduces numbness and tingling in fingers/toes', 'Supports red blood cell production'],
    dosageAdvice: '1 tablet daily after breakfast.',
  },
  {
    id: 'med-glycomet',
    name: 'Glycomet 500mg',
    category: 'medicine',
    price: 24,
    mrp: 28,
    unit: 'Strip of 10 Tablets',
    description: 'Metformin Hydrochloride 500mg for reliable glycemic balance and diabetes management.',
    image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400&auto=format&fit=crop&q=80',
    inStock: true,
    requiresRx: true,
    brand: 'USV Ltd',
    benefits: ['Controls post-meal glucose spikes', 'Doctor recommended chronic care staple'],
    dosageAdvice: 'As prescribed by your endocrinologist. Usually taken mid-lunch.',
  },
  {
    id: 'med-telma-40',
    name: 'Telma 40 (Telmisartan)',
    category: 'medicine',
    price: 98,
    mrp: 110,
    unit: 'Strip of 15 Tablets',
    description: 'Telmisartan 40mg angiotensin receptor blocker for smooth 24-hour blood pressure control.',
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&auto=format&fit=crop&q=80',
    inStock: true,
    requiresRx: true,
    brand: 'Glenmark',
    benefits: ['Prevents cardiac strain', 'Smooth 24-hour continuous vascular protection'],
    dosageAdvice: 'Take 1 tablet every morning at a fixed hour.',
  },
  {
    id: 'med-digene',
    name: 'Digene Mint Gel Liquid',
    category: 'medicine',
    price: 150,
    mrp: 168,
    unit: '200ml Bottle',
    description: 'Sugar-free fast acting antacid gel for acidity, heartburn, and gas relief for sensitive elderly stomachs.',
    image: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=400&auto=format&fit=crop&q=80',
    inStock: true,
    requiresRx: false,
    brand: 'Abbott',
    benefits: ['Cooling mint flavor', 'Neutralizes stomach acid in seconds', '100% sugar-free'],
    dosageAdvice: '2 teaspoons (10ml) after meals or at bedtime.',
  },
  {
    id: 'med-volini',
    name: 'Volini Joint Pain Relief Spray',
    category: 'medicine',
    price: 135,
    mrp: 160,
    unit: '100g Aerosol Spray',
    description: 'Targeted micro-spray with Diclofenac and Methyl Salicylate for rapid relief from back, knee, and shoulder stiffness.',
    image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400&auto=format&fit=crop&q=80',
    inStock: true,
    requiresRx: false,
    brand: 'Sun Pharma',
    benefits: ['Non-greasy rapid penetration', 'No rubbing required', 'Immediate cooling relief'],
    dosageAdvice: 'Spray from 5 cm distance on affected joint 3 to 4 times a day.',
  },

  // --- FRESH FRUITS & VEGETABLES ---
  {
    id: 'fruit-shimla-apple',
    name: 'Fresh Shimla Royal Apples',
    category: 'fruits_veggies',
    price: 140,
    mrp: 165,
    unit: '1 kg (~4-5 pcs)',
    description: 'Crisp, sweet, pesticide-checked mountain apples. Soft texture that is easy to chew or slice for senior parents.',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&auto=format&fit=crop&q=80',
    inStock: true,
    brand: 'Safal Fresh Orchard',
    benefits: ['High soluble pectin fiber', 'Rich in flavonoids for heart health', 'Easy to digest'],
  },
  {
    id: 'fruit-banana',
    name: 'Fresh Robusta Bananas',
    category: 'fruits_veggies',
    price: 60,
    mrp: 75,
    unit: '1 Dozen (12 pcs)',
    description: 'Naturally ripened, rich in potassium and Vitamin B6. Perfect light breakfast or mid-morning snack.',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&auto=format&fit=crop&q=80',
    inStock: true,
    brand: 'Farm Fresh Direct',
    benefits: ['Natural blood pressure balancer', 'Promotes smooth intestinal motility', 'Instant gentle energy'],
  },
  {
    id: 'veg-spinach',
    name: 'Farm Fresh Organic Palak (Spinach)',
    category: 'fruits_veggies',
    price: 35,
    mrp: 45,
    unit: '500g Bunch (Washed)',
    description: 'Tender baby organic spinach leaves, washed and trimmed. Ideal for healthy low-sodium soups and saag.',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&auto=format&fit=crop&q=80',
    inStock: true,
    brand: 'Green Valley Organic',
    benefits: ['Rich in dietary iron & folate', 'Lutein for senior eye health', 'Extremely low glycemic index'],
  },
  {
    id: 'fruit-papaya',
    name: 'Ripe Sweet Papaya (Pappali)',
    category: 'fruits_veggies',
    price: 65,
    mrp: 80,
    unit: '1 pc (~1.2 kg)',
    description: 'Golden sweet semi-soft papaya packed with natural papain enzyme. Highly recommended by geriatricians for digestion.',
    image: 'https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?w=400&auto=format&fit=crop&q=80',
    inStock: true,
    brand: 'Safal Orchard',
    benefits: ['Prevents chronic constipation', 'High Vitamin C & Beta-carotene', 'Very soft on sensitive teeth'],
  },
  {
    id: 'bev-coconut',
    name: 'Fresh Tender Coconut Water',
    category: 'fruits_veggies',
    price: 110,
    mrp: 130,
    unit: 'Pack of 2 Coconuts',
    description: 'Sweet, chilled tender green coconuts with fresh straw included. Pure natural isotonic electrolytes for elder hydration.',
    image: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=400&auto=format&fit=crop&q=80',
    inStock: true,
    brand: 'South Coastal Direct',
    benefits: ['Natural hydration without added sugars', 'Loaded with potassium & magnesium'],
  },
  {
    id: 'fruit-pomegranate',
    name: 'Fresh Ruby Pomegranates (Anaar)',
    category: 'fruits_veggies',
    price: 160,
    mrp: 190,
    unit: '1 kg (~3-4 pcs)',
    description: 'Plump, ruby-red juicy seeds rich in natural polyphenols and iron, vital for healthy cardiovascular circulation in seniors.',
    image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&auto=format&fit=crop&q=80',
    inStock: true,
    brand: 'Maharashtra Fresh',
    benefits: ['Rich in antioxidants', 'Supports hemoglobin and cardiovascular health'],
  },
  {
    id: 'fruit-orange',
    name: 'Nagpur Sweet Oranges (Santra)',
    category: 'fruits_veggies',
    price: 85,
    mrp: 105,
    unit: '1 kg (~5-6 pcs)',
    description: 'Juicy, peel-friendly sweet citrus packed with natural Vitamin C and bioflavonoids to strengthen seasonal immunity.',
    image: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=400&auto=format&fit=crop&q=80',
    inStock: true,
    brand: 'Nagpur Orchards',
    benefits: ['Natural Vitamin C boost', 'Hydrating & easy to juice or peel'],
  },

  // --- DAILY GROCERIES & SENIOR NUTRITION ---
  {
    id: 'groc-milk',
    name: 'Amul Taaza Toned Milk Pouch',
    category: 'grocery',
    price: 56,
    mrp: 56,
    unit: '1 Litre Pouch',
    description: 'Fresh pasteurized 3.0% fat homogenized cow milk. Easy to digest and fortified with Vitamin A & D.',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&auto=format&fit=crop&q=80',
    inStock: true,
    brand: 'Amul India',
    benefits: ['Daily calcium requirement', 'Fortified with Vitamin A & D for senior immunity'],
  },
  {
    id: 'groc-oats',
    name: 'Quaker Rolled Oats 1kg',
    category: 'grocery',
    price: 175,
    mrp: 195,
    unit: '1 kg Box',
    description: '100% whole grain rolled oats rich in beta-glucan soluble fiber to help manage cholesterol and blood sugar.',
    image: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=300&auto=format&fit=crop&q=80',
    inStock: true,
    brand: 'Quaker India',
    benefits: ['Clinically proven to lower cholesterol', 'Keeps full longer without sugar spikes', 'Prepares in 3 minutes'],
  },
  {
    id: 'groc-bread',
    name: 'Multigrain Whole Wheat Bread',
    category: 'grocery',
    price: 48,
    mrp: 55,
    unit: '400g Loaf (12 Slices)',
    description: 'Soft-baked brown bread infused with flaxseeds, oats, and whole wheat. Low sugar and soft crust for seniors.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&auto=format&fit=crop&q=80',
    inStock: true,
    brand: 'Harvest Gold Select',
    benefits: ['Zero maida, high dietary fiber', 'Soft texture easy to chew'],
  },
  {
    id: 'groc-oil',
    name: 'Cold Pressed Kachi Ghani Mustard Oil',
    category: 'grocery',
    price: 185,
    mrp: 215,
    unit: '1 Litre Pet Bottle',
    description: 'Pure cold pressed mustard oil with natural pungency and balanced omega-3/omega-6 ratio for traditional healthy Indian cooking.',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&auto=format&fit=crop&q=80',
    inStock: true,
    brand: 'Fortune Select',
    benefits: ['Traditional unrefined extraction', 'Heart-safe monounsaturated fats'],
  },
  {
    id: 'supp-chyawanprash',
    name: 'Dabur Chyawanprash Ayurvedic Immunity',
    category: 'supplements',
    price: 195,
    mrp: 230,
    unit: '500g Jar',
    description: 'Ancient Ayurvedic formula with 40+ herbs, rich Indian Amla gooseberry, and honey for bronchial resilience and seasonal stamina.',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&auto=format&fit=crop&q=80',
    inStock: true,
    brand: 'Dabur India',
    benefits: ['Immunity against common cold & cough', 'Boosts respiratory health in elders'],
    dosageAdvice: '1 teaspoon twice daily with warm milk.',
  },
  {
    id: 'groc-eggs',
    name: 'Farm Fresh Brown Eggs (Pack of 6)',
    category: 'grocery',
    price: 52,
    mrp: 60,
    unit: 'Pack of 6 Eggs',
    description: 'Fresh organic high-protein brown eggs from cage-free poultry, rich in choline and lutein for elder muscle & brain wellness.',
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&auto=format&fit=crop&q=80',
    inStock: true,
    brand: 'Country Farm Natural',
    benefits: ['6g bioavailable protein per egg', 'Supports muscle mass retention in seniors', 'Fresh daily supply'],
  },
  {
    id: 'groc-atta',
    name: 'Aashirvaad Superior MP Chakki Atta 5kg',
    category: 'grocery',
    price: 245,
    mrp: 275,
    unit: '5 kg Bag',
    description: '100% whole wheat stone-ground chakki atta with 0% maida. High dietary bran fiber ensures soft digestible rotis for elders.',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&auto=format&fit=crop&q=80',
    inStock: true,
    brand: 'ITC Aashirvaad',
    benefits: ['Superior whole wheat grain nutrition', 'Absorbs more water for softer rotis', 'Promotes digestive wellness'],
  },
  {
    id: 'groc-tea',
    name: 'Organic India Tulsi Green Tea',
    category: 'grocery',
    price: 185,
    mrp: 210,
    unit: 'Box of 25 Tea Bags',
    description: 'Infusion of Rama, Krishna, and Vana Tulsi blended with premium green tea. Gentle soothing aroma to support healthy metabolism and heart.',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&auto=format&fit=crop&q=80',
    inStock: true,
    brand: 'Organic India',
    benefits: ['Rich in natural tea catechins & antioxidants', 'Calming adaptogenic properties', 'Zero sugar caffeine-balanced'],
  },
];

// Initial realistic active delivery order
const INITIAL_DELIVERY_ORDERS: DeliveryOrder[] = [
  {
    id: 'ORD-9821',
    placedAt: 'Today, 09:30 AM',
    items: [
      {
        item: INITIAL_CATALOGUE.find((i) => i.id === 'med-dolo-650') || INITIAL_CATALOGUE[0], // Dolo 650
        quantity: 2,
      },
      {
        item: INITIAL_CATALOGUE.find((i) => i.id === 'fruit-shimla-apple') || INITIAL_CATALOGUE[8], // Shimla Apples
        quantity: 1,
      },
      {
        item: INITIAL_CATALOGUE.find((i) => i.id === 'groc-milk') || INITIAL_CATALOGUE[15], // Amul Milk
        quantity: 2,
      },
    ],
    totalAmount: 316,
    status: 'in_transit',
    paymentMethod: 'UPI on Handover',
    deliveryAddress: 'Flat 402, Eldeco Greens, Sector 44, Noida',
    elderName: 'Ramesh Sharma (Age 74)',
    familyPhone: '+91 98765 43210',
    helper: {
      id: 'hlp-1',
      name: 'Sister Sunita Devi (RN)',
      role: 'KinCare Certified Caregiver & Medical Courier',
      phone: '+91 98711 00213',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80',
      vehicle: 'KinCare Electric Scooter (DL 3S CD 8941)',
      etaMinutes: 18,
      policeVerified: true,
      rating: 4.96,
    },
    timeline: [
      {
        id: 't-1',
        title: 'Order Verified & Packed',
        time: '09:30 AM',
        description: 'Pharmacist packaged sealed Dolo 650 (Batch #DL9201) and fresh fruit bag.',
        completed: true,
      },
      {
        id: 't-2',
        title: 'Assigned to Sister Sunita Devi',
        time: '09:38 AM',
        description: 'Caregiver accepted pickup at Apollo & Safal Hub, Sector 41.',
        completed: true,
      },
      {
        id: 't-3',
        title: 'Caregiver Picked Up & En-Route',
        time: '09:48 AM',
        description: 'Inspected expiry date & package seal. Live GPS tracking active on Sector 44 road.',
        completed: true,
        current: true,
      },
      {
        id: 't-4',
        title: 'Doorstep Handover & Senior Verification',
        time: 'Expected 10:15 AM',
        description: 'Handover directly to Ramesh Sharma with receipt and dose explanation.',
        completed: false,
      },
    ],
  },
];

interface CatalogueStoreProps {
  userRole?: 'elder' | 'family';
  onViewLiveRadar?: () => void;
  initialCategory?: CatalogueCategory;
}

export const CatalogueStore: React.FC<CatalogueStoreProps> = ({ 
  userRole = 'elder',
  onViewLiveRadar,
  initialCategory = 'all'
}) => {
  const { user } = useAuth();
  
  // State
  const [selectedCategory, setSelectedCategory] = useState<CatalogueCategory>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<CatalogueItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'shop' | 'orders'>('shop');
  
  // Cart state persisted in localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('kincare_store_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Orders state persisted in localStorage
  const [orders, setOrders] = useState<DeliveryOrder[]>(() => {
    try {
      const saved = localStorage.getItem('kincare_delivery_orders');
      return saved ? JSON.parse(saved) : INITIAL_DELIVERY_ORDERS;
    } catch {
      return INITIAL_DELIVERY_ORDERS;
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'UPI on Handover' | 'Prepaid Family Wallet'>('UPI on Handover');
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || 'Flat 402, Eldeco Greens, Sector 44, Noida');
  const [orderSuccessMessage, setOrderSuccessMessage] = useState<string | null>(null);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kincare_store_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Sync orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kincare_delivery_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  // Cart operations
  const addToCart = (item: CatalogueItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === item.id);
      if (existing) {
        return prev.map((c) => 
          c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((c) => {
          if (c.item.id === itemId) {
            const newQty = c.quantity + delta;
            return newQty > 0 ? { ...c, quantity: newQty } : null;
          }
          return c;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItemsCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const totalAmount = cart.reduce((sum, i) => sum + (i.item.price * i.quantity), 0);

  // Checkout order
  const handlePlaceOrder = () => {
    if (cart.length === 0) return;

    const newOrder: DeliveryOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      placedAt: 'Just now',
      items: [...cart],
      totalAmount,
      status: 'assigned',
      paymentMethod,
      deliveryAddress: deliveryAddress.trim() || 'Home Residence, Sector 44, Noida',
      elderName: user?.role === 'senior_individual' || user?.role === 'elder' ? user.name : 'Ramesh Sharma (Parent)',
      familyPhone: user?.phone || '+91 98765 43210',
      helper: {
        id: 'hlp-1',
        name: 'Sister Sunita Devi (RN)',
        role: 'KinCare Certified Caregiver & Medical Courier',
        phone: '+91 98711 00213',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80',
        vehicle: 'KinCare Electric Courier (DL 3S CD 8941)',
        etaMinutes: 25,
        policeVerified: true,
        rating: 4.96,
      },
      timeline: [
        {
          id: 't-1',
          title: 'Order Placed & Verified',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          description: `Items verified from Apollo Pharmacy & Safal Fresh Hub for ${user?.name || 'Ramesh Sharma'}.`,
          completed: true,
        },
        {
          id: 't-2',
          title: 'Assigned to Caretaker Sunita Devi',
          time: '2 mins ago',
          description: 'Caregiver accepted delivery and started order inspection.',
          completed: true,
          current: true,
        },
        {
          id: 't-3',
          title: 'Packaging & En-Route Transit',
          time: 'Est. in 10 mins',
          description: 'Medicines sealed, groceries secured in sanitized cooler bag.',
          completed: false,
        },
        {
          id: 't-4',
          title: 'Doorstep Handover & Confirmation',
          time: 'Est. in 25 mins',
          description: 'Caregiver hand-delivers to elder with batch verification.',
          completed: false,
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    setIsCartOpen(false);
    setActiveTab('orders');
    setOrderSuccessMessage(`Order #${newOrder.id} placed successfully! Sister Sunita Devi has been dispatched.`);
    setTimeout(() => setOrderSuccessMessage(null), 6000);
  };

  // Simulate advancing the delivery progress for testing
  const handleAdvanceOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;

        if (ord.status === 'ordered') {
          return {
            ...ord,
            status: 'assigned',
            timeline: ord.timeline.map((t, idx) => ({
              ...t,
              completed: idx <= 1,
              current: idx === 1,
            })),
          };
        } else if (ord.status === 'assigned') {
          return {
            ...ord,
            status: 'in_transit',
            timeline: ord.timeline.map((t, idx) => ({
              ...t,
              completed: idx <= 2,
              current: idx === 2,
            })),
          };
        } else if (ord.status === 'in_transit') {
          return {
            ...ord,
            status: 'delivered',
            timeline: ord.timeline.map((t) => ({
              ...t,
              completed: true,
              current: false,
            })),
          };
        }
        return ord;
      })
    );
  };

  // Filter items
  const filteredItems = INITIAL_CATALOGUE.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.brand && item.brand.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6" id="catalogueStoreSection">
      
      {/* 1. Header Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-teal-900 via-slate-900 to-emerald-950 border-2 border-teal-500/30 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-5"
      >
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-xs font-black uppercase tracking-wider text-teal-300 bg-teal-500/20 px-3 py-0.5 rounded-full border border-teal-400/30">
              {userRole === 'family' ? 'Family Store' : 'Senior Essentials & Medicine Store'}
            </span>
            <span className="text-[11px] font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/40 flex items-center gap-1">
              <Truck className="h-3 w-3" />
              Free Doorstep Handover by Caretaker
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {userRole === 'family' ? 'Order Medicines & Groceries for Senior' : 'Medicines & Daily Fresh Groceries'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-2xl mt-1">
            Certified pharmacy medicines (Dolo 650, BP & sugar pills) and farm-fresh fruits & vegetables, personally delivered and inspected by your KinCare caregiver.
          </p>
        </div>

        {/* View Switcher: Shop vs Delivery Status */}
        <div className="flex items-center gap-2 bg-slate-950/60 p-1.5 rounded-2xl border border-teal-500/30 self-start md:self-auto flex-shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('shop')}
            id="tabStoreShop"
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'shop'
                ? 'bg-teal-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Browse Catalogue</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            id="tabStoreOrders"
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition flex items-center gap-2 cursor-pointer relative ${
              activeTab === 'orders'
                ? 'bg-teal-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <PackageCheck className="h-4 w-4" />
            <span>Delivery Logs</span>
            {orders.some((o) => o.status !== 'delivered') && (
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            )}
          </button>
        </div>
      </motion.div>

      {/* Success Notification */}
      {orderSuccessMessage && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 border-2 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200 text-sm font-black flex items-center justify-between gap-3 shadow-md"
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <span>{orderSuccessMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black cursor-pointer whitespace-nowrap"
          >
            Track Delivery →
          </button>
        </motion.div>
      )}

      {/* 2. TAB CONTENT: BROWSE SHOP */}
      {activeTab === 'shop' && (
        <div className="space-y-6">
          {/* Controls: Search & Category Chips */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Dolo 650, Apples, Milk, Oats, BP medicines..."
                  id="catalogueSearchInput"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/90 border-2 border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium outline-none focus:border-teal-500 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              {/* Floating Cart Button */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => setIsCartOpen(true)}
                id="openCartBtn"
                className="px-5 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400 text-white dark:text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer whitespace-nowrap"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Cart ({totalItemsCount})</span>
                {totalAmount > 0 && (
                  <span className="ml-1 px-2 py-0.5 rounded-lg bg-black/20 dark:bg-white/30 text-xs">
                    ₹{totalAmount}
                  </span>
                )}
              </motion.button>
            </div>

            {/* Centralized Category Filter Chips */}
            <div className="flex items-center justify-center flex-wrap gap-2.5 pb-1">
              {[
                { id: 'all', label: 'All Catalogue Items', icon: ShoppingBag },
                { id: 'medicine', label: 'Prescription Medicines', icon: Pill },
                { id: 'fruits_veggies', label: 'Fresh Fruits & Veggies', icon: Apple },
                { id: 'grocery', label: 'Daily Groceries & Milk', icon: ShoppingBag },
                { id: 'supplements', label: 'Health Supplements', icon: HeartPulse },
              ].map((tab) => {
                const Icon = tab.icon;
                const isSelected = selectedCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSelectedCategory(tab.id as CatalogueCategory)}
                    className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition flex items-center gap-2 whitespace-nowrap cursor-pointer shadow-xs ${
                      isSelected
                        ? 'bg-teal-700 dark:bg-teal-600 text-white shadow-md ring-2 ring-teal-400 dark:ring-teal-500 scale-102'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:scale-101'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {filteredItems.map((item) => {
              const inCartItem = cart.find((c) => c.item.id === item.id);
              return (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -3 }}
                  className="rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs flex flex-col justify-between transition-all hover:border-teal-400 dark:hover:border-teal-600"
                >
                  <div>
                    {/* Item Image & Badge */}
                    <div className="relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 h-40 mb-3 group">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80';
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md shadow-xs ${
                          item.category === 'medicine' 
                            ? 'bg-purple-600 text-white' 
                            : item.category === 'fruits_veggies'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-teal-600 text-white'
                        }`}>
                          {item.category === 'medicine' ? 'Medicine' : item.category === 'fruits_veggies' ? 'Fresh Harvest' : 'Grocery'}
                        </span>
                        {item.requiresRx && (
                          <span className="text-[9px] font-extrabold uppercase bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded shadow-xs">
                            Rx Checked
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedItem(item);
                          setIsDetailModalOpen(true);
                        }}
                        className="absolute bottom-2.5 right-2.5 p-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-bold flex items-center gap-1 backdrop-blur-xs transition cursor-pointer"
                        title="View item information"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span className="text-[10px]">Details</span>
                      </button>
                    </div>

                    {/* Brand & Title */}
                    <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                      {item.brand || 'KinCare Verified'} • {item.unit}
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-0.5 line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Pricing & Add to Cart */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xl font-black text-slate-900 dark:text-white font-mono">
                          ₹{item.price}
                        </span>
                        {item.mrp && item.mrp > item.price && (
                          <span className="text-xs text-slate-400 line-through">
                            ₹{item.mrp}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        Senior Care Discount
                      </span>
                    </div>

                    {/* Add or Qty Selector */}
                    {inCartItem ? (
                      <div className="flex items-center gap-2 bg-teal-50 dark:bg-teal-950/80 border border-teal-300 dark:border-teal-700 rounded-xl px-2 py-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-6 h-6 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs hover:bg-teal-700 cursor-pointer"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-xs font-black text-teal-900 dark:text-teal-200 min-w-[16px] text-center font-mono">
                          {inCartItem.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-6 h-6 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs hover:bg-teal-700 cursor-pointer"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => addToCart(item)}
                        className="px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-black text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add</span>
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. TAB CONTENT: DELIVERY LOGS & HELPER TRACKING */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Truck className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                <span>Active Delivery Logs & Caretaker Status</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                Real-time tracking of medicine packaging, transit, and assigned caregiver handover.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('shop')}
              className="text-xs font-black text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-3.5 py-2 rounded-xl border border-teal-200 dark:border-teal-800 hover:bg-teal-100 transition cursor-pointer"
            >
              + Order More Items
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
              <PackageCheck className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
              <p className="font-black text-base">No active delivery orders yet.</p>
              <p className="text-xs mt-1">Browse the store to order medicines or fresh groceries.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-xs space-y-6"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-base text-slate-900 dark:text-white">
                          Order #{order.id}
                        </span>
                        <span className={`text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                          order.status === 'delivered'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 animate-pulse'
                        }`}>
                          {order.status === 'delivered' ? 'Delivered & Verified' : order.status === 'in_transit' ? 'En-Route (Caretaker in Transit)' : 'Assigned to Caregiver'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Placed: {order.placedAt} • For: {order.elderName} ({order.deliveryAddress})
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-xs text-slate-500 block">Total Amount</span>
                        <span className="text-lg font-black text-slate-900 dark:text-white font-mono">
                          ₹{order.totalAmount}
                        </span>
                      </div>
                      {/* Test simulation step */}
                      {order.status !== 'delivered' && (
                        <button
                          type="button"
                          onClick={() => handleAdvanceOrder(order.id)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-300 dark:border-slate-700 flex items-center gap-1 cursor-pointer"
                          title="Click to simulate next delivery step"
                        >
                          <RefreshCw className="h-3 w-3" />
                          <span>Advance Step</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 2-Column: Assigned Helper Card + Live Log Stepper */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Caregiver & Helper Card */}
                    <div className="rounded-2xl bg-teal-50/70 dark:bg-slate-800/80 border-2 border-teal-200 dark:border-slate-700 p-4 sm:p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 dark:text-teal-300">
                            Assigned Delivery Caretaker
                          </span>
                          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <ShieldCheck className="h-3 w-3" />
                            Police Verified
                          </span>
                        </div>

                        <div className="flex items-center gap-3 mb-3">
                          <img 
                            src={order.helper.avatar} 
                            alt={order.helper.name} 
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&auto=format&fit=crop&q=80';
                            }}
                            className="w-14 h-14 rounded-2xl object-cover border-2 border-teal-400 shadow-sm"
                          />
                          <div>
                            <h4 className="text-base font-black text-slate-900 dark:text-white">
                              {order.helper.name}
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                              {order.helper.role}
                            </p>
                            <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                              ★ {order.helper.rating} • Verified Medical Courier
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 bg-white/70 dark:bg-slate-900/60 p-3 rounded-xl border border-teal-100 dark:border-slate-800">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Vehicle:</span>
                            <span className="font-bold">{order.helper.vehicle}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Live ETA:</span>
                            <span className="font-black text-teal-700 dark:text-teal-300">
                              {order.status === 'delivered' ? 'Delivered' : `Arriving in ~${order.helper.etaMinutes} mins`}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-teal-200 dark:border-slate-700 flex items-center gap-2">
                        <a
                          href={`tel:${order.helper.phone.replace(/[^0-9]/g, '')}`}
                          className="flex-1 py-2 bg-teal-700 hover:bg-teal-800 text-white font-black text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Phone className="h-3.5 w-3.5" />
                          <span>Call Caretaker</span>
                        </a>
                        {onViewLiveRadar && (
                          <button
                            type="button"
                            onClick={onViewLiveRadar}
                            className="px-3 py-2 bg-purple-700 hover:bg-purple-800 text-white font-black text-xs rounded-xl shadow transition flex items-center justify-center gap-1 cursor-pointer"
                            title="View Caregiver Live GPS Radar"
                          >
                            <MapPin className="h-3.5 w-3.5" />
                            <span>GPS Radar</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Live Delivery Timeline Log */}
                    <div className="lg:col-span-2 space-y-3">
                      <h4 className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                        Live Delivery Timeline & Logs
                      </h4>

                      <div className="relative pl-6 space-y-4 border-l-2 border-teal-400 dark:border-teal-700 ml-3">
                        {order.timeline.map((step) => (
                          <div key={step.id} className="relative">
                            <div className={`absolute -left-[31px] top-0.5 w-5 h-5 rounded-full flex items-center justify-center ${
                              step.completed
                                ? 'bg-teal-600 text-white'
                                : step.current
                                ? 'bg-amber-400 text-slate-950 animate-ping'
                                : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                            }`}>
                              {step.completed ? (
                                <Check className="h-3 w-3 stroke-[3]" />
                              ) : (
                                <span className="w-2 h-2 rounded-full bg-slate-400" />
                              )}
                            </div>

                            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                              <div className="flex items-center justify-between text-xs font-bold mb-0.5">
                                <span className={step.completed ? 'text-teal-700 dark:text-teal-300' : 'text-slate-700 dark:text-slate-300'}>
                                  {step.title}
                                </span>
                                <span className="text-[11px] text-slate-400">{step.time}</span>
                              </div>
                              <p className="text-xs text-slate-600 dark:text-slate-400">
                                {step.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Items Summary in this Order */}
                      <div className="pt-2">
                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                          Items in this parcel:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {order.items.map((it) => (
                            <span 
                              key={it.item.id}
                              className="text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700"
                            >
                              {it.item.name} × {it.quantity} (₹{it.item.price * it.quantity})
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. CART SLIDE-OVER / MODAL */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 h-full border-l-2 border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between p-6 overflow-y-auto"
            >
              <div>
                {/* Cart Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center">
                      <ShoppingCart className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">
                        Your Order Cart
                      </h3>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {totalItemsCount} item{totalItemsCount !== 1 ? 's' : ''} selected
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsCartOpen(false)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-800 dark:hover:text-white transition cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Cart Items List */}
                <div className="py-4 space-y-3">
                  {cart.length === 0 ? (
                    <div className="py-12 text-center text-slate-500">
                      <ShoppingCart className="h-10 w-10 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                      <p className="font-bold">Your cart is empty.</p>
                      <p className="text-xs mt-1">Add items from the medicine or grocery catalogue.</p>
                    </div>
                  ) : (
                    cart.map(({ item, quantity }) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3"
                      >
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80';
                          }}
                          className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">
                            {item.name}
                          </h4>
                          <span className="text-[11px] text-slate-500 font-medium">
                            ₹{item.price} each
                          </span>
                        </div>

                        {/* Qty Counter */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white flex items-center justify-center font-bold text-xs cursor-pointer hover:bg-slate-300"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-xs font-black font-mono min-w-[14px] text-center">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-6 h-6 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs cursor-pointer hover:bg-teal-700"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <span className="text-xs font-black text-slate-900 dark:text-white font-mono min-w-[42px] text-right">
                          ₹{item.price * quantity}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                {/* Delivery Information */}
                {cart.length > 0 && (
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-teal-600" />
                        Senior Delivery Residence
                      </label>
                      <input
                        type="text"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="Elder address..."
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:border-teal-500 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Payment Preference
                      </label>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('UPI on Handover')}
                          className={`p-2 rounded-xl border-2 font-bold text-left transition cursor-pointer ${
                            paymentMethod === 'UPI on Handover'
                              ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/70 text-teal-900 dark:text-teal-200'
                              : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          UPI on Handover
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('Cash on Delivery')}
                          className={`p-2 rounded-xl border-2 font-bold text-left transition cursor-pointer ${
                            paymentMethod === 'Cash on Delivery'
                              ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/70 text-teal-900 dark:text-teal-200'
                              : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          Cash on Delivery
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Cart Footer */}
              {cart.length > 0 && (
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-500">
                      <span>Items Subtotal:</span>
                      <span className="font-mono">₹{totalAmount}</span>
                    </div>
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                      <span>Senior Caregiver Delivery:</span>
                      <span>FREE ₹0</span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-slate-900 dark:text-white pt-1 border-t border-slate-100 dark:border-slate-800">
                      <span>Total to Pay:</span>
                      <span className="font-mono text-base text-teal-700 dark:text-teal-400">
                        ₹{totalAmount}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    id="placeOrderBtn"
                    className="w-full py-3 bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-black rounded-2xl shadow-lg transition flex items-center justify-center gap-2 text-sm cursor-pointer"
                  >
                    <Truck className="h-4 w-4" />
                    <span>Place Order & Dispatch Caretaker</span>
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. ITEM DETAILS MODAL */}
      <AnimatePresence>
        {isDetailModalOpen && selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border-2 border-slate-200 dark:border-slate-800 shadow-2xl text-slate-900 dark:text-white relative"
            >
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-800 dark:hover:text-white transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-start gap-4 mb-4">
                <img 
                  src={selectedItem.image} 
                  alt={selectedItem.name} 
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80';
                  }}
                  className="w-20 h-20 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
                />
                <div>
                  <span className="text-[10px] font-black uppercase text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded">
                    {selectedItem.brand || 'KinCare Safe Quality'}
                  </span>
                  <h3 className="text-xl font-black mt-1">
                    {selectedItem.name}
                  </h3>
                  <div className="text-sm font-bold text-slate-500">
                    {selectedItem.unit}
                  </div>
                  <div className="text-lg font-black text-teal-700 dark:text-teal-400 font-mono mt-0.5">
                    ₹{selectedItem.price}
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-xs leading-relaxed">
                <div>
                  <h4 className="font-bold text-slate-700 dark:text-slate-300">Description</h4>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                    {selectedItem.description}
                  </p>
                </div>

                {selectedItem.benefits && (
                  <div>
                    <h4 className="font-bold text-slate-700 dark:text-slate-300">Benefits for Elders:</h4>
                    <ul className="list-disc pl-4 space-y-0.5 text-slate-600 dark:text-slate-400 mt-1">
                      {selectedItem.benefits.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedItem.dosageAdvice && (
                  <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/70 border border-teal-200 dark:border-teal-800 text-teal-900 dark:text-teal-200">
                    <span className="font-bold block mb-0.5">Usage & Dosage Guidance:</span>
                    <span>{selectedItem.dosageAdvice}</span>
                  </div>
                )}
              </div>

              <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-xs text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    addToCart(selectedItem);
                    setIsDetailModalOpen(false);
                  }}
                  className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-black text-xs flex items-center gap-1.5 shadow transition cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add to Cart (₹{selectedItem.price})</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

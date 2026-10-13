import bcrypt from 'bcryptjs';
import { ALL_FRUITS, ALL_GRAINS, ALL_PULSES } from './catalogData.ts';

export interface SeedUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'customer' | 'farmer' | 'admin';
  phone: string;
  address: string;
  farmLocation?: {
    farmName: string;
    description: string;
    city: string;
    state: string;
    address: string;
    lat: number;
    lng: number;
    experienceYears: number;
    organicCertified: boolean;
  };
  profileImage: string;
  isActive: boolean;
  createdAt: string;
}

export interface SeedProduct {
  id: string;
  name: string;
  description: string;
  category: 'Vegetables' | 'Fruits' | 'Grains' | 'Pulses' | 'Dairy' | 'Organic Produce';
  price: number;
  unit: 'kg' | 'dozen' | 'litre' | 'piece' | 'bunch' | 'quintal';
  quantity: number;
  images: string[];
  farmerId: string;
  farmerName: string;
  location: {
    farmName: string;
    city: string;
    state: string;
    address: string;
    lat: number;
    lng: number;
  };
  isAvailable: boolean;
  isOrganic: boolean;
  harvestDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface SeedOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: {
    id: string;
    productId: string;
    productName: string;
    image: string;
    price: number;
    unit: string;
    quantity: number;
    farmerId: string;
    farmerName: string;
    farmCity: string;
    itemTotal: number;
    fulfillmentStatus: 'Pending' | 'Confirmed' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled';
  }[];
  deliveryAddress: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    notes?: string;
  };
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: 'Cash on Delivery' | 'UPI / NetBanking (Test Mode)';
  paymentStatus: 'Pending' | 'Completed' | 'Refunded';
  orderStatus: 'Pending' | 'Confirmed' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
  updatedAt: string;
}

// Generate hashed password for "password123"
const DEFAULT_HASH = bcrypt.hashSync('password123', 10);

export function getInitialSeedData() {
  const users: SeedUser[] = [
    {
      id: 'usr_admin_001',
      name: 'FarmConnect Admin HQ',
      email: 'admin@farmconnect.org',
      passwordHash: DEFAULT_HASH,
      role: 'admin',
      phone: '+91 98201 11223',
      address: 'Agricultural Technology Center, Nariman Point, Mumbai, Maharashtra',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      isActive: true,
      createdAt: new Date(Date.now() - 60 * 86400000).toISOString()
    },
    {
      id: 'usr_farmer_001',
      name: 'Ramesh Patil',
      email: 'ramesh.farmer@farmconnect.org',
      passwordHash: DEFAULT_HASH,
      role: 'farmer',
      phone: '+91 98220 44551',
      address: 'Gat No. 42, Shivshambhu Agro Farm, Haveli Taluka, Pune, Maharashtra',
      farmLocation: {
        farmName: 'Shivshambhu Agro Orchards',
        description: 'Multi-generational natural farm cultivating certified organic seasonal vegetables, sweet vine tomatoes, and traditional grains using zero-chemical compost.',
        city: 'Pune',
        state: 'Maharashtra',
        address: 'Wagholi-Saswad Road, Pune Rural',
        lat: 18.5204,
        lng: 73.8567,
        experienceYears: 18,
        organicCertified: true
      },
      profileImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80',
      isActive: true,
      createdAt: new Date(Date.now() - 50 * 86400000).toISOString()
    },
    {
      id: 'usr_farmer_002',
      name: 'Sunita Gaikwad',
      email: 'sunita.farmer@farmconnect.org',
      passwordHash: DEFAULT_HASH,
      role: 'farmer',
      phone: '+91 97631 88992',
      address: 'Pimpalgaon Baswant, Niphad Taluka, Nashik, Maharashtra',
      farmLocation: {
        farmName: 'Gaikwad Sahyadri Fresh',
        description: 'Famous Nashik red onions, seedless table grapes, fresh pomegranate, and heirloom garlic directly harvested and sun-cured.',
        city: 'Nashik',
        state: 'Maharashtra',
        address: 'Niphad Highway, Nashik Agri Belt',
        lat: 19.9975,
        lng: 73.7898,
        experienceYears: 14,
        organicCertified: true
      },
      profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      isActive: true,
      createdAt: new Date(Date.now() - 40 * 86400000).toISOString()
    },
    {
      id: 'usr_farmer_003',
      name: 'Harpreet Singh',
      email: 'harpreet.farmer@farmconnect.org',
      passwordHash: DEFAULT_HASH,
      role: 'farmer',
      phone: '+91 98140 22334',
      address: 'VPO Samrala, Ludhiana District, Punjab',
      farmLocation: {
        farmName: 'Golden Fields Organic Grains',
        description: 'Direct-from-field 1121 Traditional Long Grain Basmati Rice, stone-ground Sharbati whole wheat flour, and desi mustard oil.',
        city: 'Ludhiana',
        state: 'Punjab',
        address: 'GT Road agri corridor, Ludhiana',
        lat: 30.9010,
        lng: 75.8573,
        experienceYears: 22,
        organicCertified: true
      },
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      isActive: true,
      createdAt: new Date(Date.now() - 35 * 86400000).toISOString()
    },
    {
      id: 'usr_farmer_004',
      name: 'Anand Devadiga',
      email: 'anand.farmer@farmconnect.org',
      passwordHash: DEFAULT_HASH,
      role: 'farmer',
      phone: '+91 94480 77112',
      address: 'Nelamangala Green Valley, Bengaluru Rural, Karnataka',
      farmLocation: {
        farmName: 'Cauvery River Desi Dairy & Green Farm',
        description: 'Pure Gir Cow A2 Milk, cultured Bilona Ghee, fresh tender coconuts, and hydro-organic greens picked daily at sunrise.',
        city: 'Bengaluru',
        state: 'Karnataka',
        address: 'Tumkur Road corridor, Bengaluru Rural',
        lat: 13.0982,
        lng: 77.3986,
        experienceYears: 11,
        organicCertified: true
      },
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
      isActive: true,
      createdAt: new Date(Date.now() - 28 * 86400000).toISOString()
    },
    {
      id: 'usr_customer_001',
      name: 'Priya Sharma',
      email: 'customer@farmconnect.org',
      passwordHash: DEFAULT_HASH,
      role: 'customer',
      phone: '+91 98765 43210',
      address: 'Flat 402, Green Meadows, Kothrud, Pune, Maharashtra 411038',
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
      isActive: true,
      createdAt: new Date(Date.now() - 25 * 86400000).toISOString()
    },
    {
      id: 'usr_customer_002',
      name: 'Vikram Joshi',
      email: 'vikram.j@gmail.com',
      passwordHash: DEFAULT_HASH,
      role: 'customer',
      phone: '+91 99887 66554',
      address: 'B-12 Hilltop Residency, Baner, Pune, Maharashtra 411045',
      profileImage: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80',
      isActive: true,
      createdAt: new Date(Date.now() - 15 * 86400000).toISOString()
    }
  ];

  const products: SeedProduct[] = [
    // --- LEAFY GREENS & CABBAGES ---
    {
      id: 'prd_004',
      name: 'Organic Palak (Spinach Bunch)',
      description: 'Crisp green broad-leaf spinach hand-picked in early morning mist. Zero synthetic fertilizer or wax coating.',
      category: 'Vegetables',
      price: 20,
      unit: 'bunch',
      quantity: 85,
      images: [
        'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&auto=format&fit=crop&q=80'
      ],
      farmerId: 'usr_farmer_001',
      farmerName: 'Ramesh Patil',
      location: {
        farmName: 'Shivshambhu Agro Orchards',
        city: 'Pune',
        state: 'Maharashtra',
        address: 'Wagholi-Saswad Road, Pune Rural',
        lat: 18.5204,
        lng: 73.8567
      },
      isAvailable: true,
      isOrganic: true,
      harvestDate: 'Harvested today at 6 AM',
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 86400000).toISOString()
    },
    {
      id: 'prd_011',
      name: 'Fresh Desi Methi (Fenugreek Leaves)',
      description: 'Tender, intensely aromatic small-leaf fenugreek cultivated with cow manure. Ideal for methi thepla, parathas, and aloo methi.',
      category: 'Vegetables',
      price: 25,
      unit: 'bunch',
      quantity: 90,
      images: [
        'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=800&auto=format&fit=crop&q=80'
      ],
      farmerId: 'usr_farmer_001',
      farmerName: 'Ramesh Patil',
      location: {
        farmName: 'Shivshambhu Agro Orchards',
        city: 'Pune',
        state: 'Maharashtra',
        address: 'Wagholi-Saswad Road, Pune Rural',
        lat: 18.5204,
        lng: 73.8567
      },
      isAvailable: true,
      isOrganic: true,
      harvestDate: 'Fresh harvest yesterday',
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 86400000).toISOString()
    },
    {
      id: 'prd_012',
      name: 'Sarson ke Saag (Mustard Greens)',
      description: 'Farm-fresh Punjabi mustard greens cultivated in winter mist. Peppery, iron-rich, and hand-cut at sunrise.',
      category: 'Vegetables',
      price: 35,
      unit: 'bunch',
      quantity: 70,
      images: [
        'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80'
      ],
      farmerId: 'usr_farmer_003',
      farmerName: 'Harpreet Singh',
      location: {
        farmName: 'Golden Fields Organic Grains',
        city: 'Ludhiana',
        state: 'Punjab',
        address: 'GT Road agri corridor, Ludhiana',
        lat: 30.9010,
        lng: 75.8573
      },
      isAvailable: true,
      isOrganic: true,
      harvestDate: 'Harvested this morning',
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 86400000).toISOString()
    },
    {
      id: 'prd_013',
      name: 'Crisp Green Cabbage (Patta Gobhi)',
      description: 'Firm, densely layered sweet green cabbage head harvested from fertile loamy soil. Clean, crisp, and pesticide-free.',
      category: 'Vegetables',
      price: 28,
      unit: 'piece',
      quantity: 110,
      images: [
        'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&auto=format&fit=crop&q=80'
      ],
      farmerId: 'usr_farmer_002',
      farmerName: 'Sunita Gaikwad',
      location: {
        farmName: 'Gaikwad Sahyadri Fresh',
        city: 'Nashik',
        state: 'Maharashtra',
        address: 'Niphad Highway, Nashik Agri Belt',
        lat: 19.9975,
        lng: 73.7898
      },
      isAvailable: true,
      isOrganic: true,
      harvestDate: 'Harvested 2 days ago',
      createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 4 * 86400000).toISOString()
    },
    {
      id: 'prd_014',
      name: 'Crisp Romaine & Butterhead Lettuce',
      description: 'Hydro-organic, pesticide-free crunchy salad lettuce with sweet tender leaves, freshly washed in clean borewell water.',
      category: 'Vegetables',
      price: 40,
      unit: 'piece',
      quantity: 50,
      images: [
        'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=800&auto=format&fit=crop&q=80'
      ],
      farmerId: 'usr_farmer_004',
      farmerName: 'Anand Devadiga',
      location: {
        farmName: 'Cauvery River Desi Dairy & Green Farm',
        city: 'Bengaluru',
        state: 'Karnataka',
        address: 'Tumkur Road corridor, Bengaluru Rural',
        lat: 13.0982,
        lng: 77.3986
      },
      isAvailable: true,
      isOrganic: true,
      harvestDate: 'Harvested yesterday',
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 86400000).toISOString()
    },
    {
      id: 'prd_015',
      name: 'Organic Tuscan Curly Kale',
      description: 'Deep green, nutrient-dense crinkled kale leaves packed with vitamins A, C, K, and antioxidants. Grown with zero chemical sprays.',
      category: 'Vegetables',
      price: 60,
      unit: 'bunch',
      quantity: 40,
      images: [
        'https://images.unsplash.com/photo-1524179091875-bf99a9a6fa57?w=800&auto=format&fit=crop&q=80'
      ],
      farmerId: 'usr_farmer_004',
      farmerName: 'Anand Devadiga',
      location: {
        farmName: 'Cauvery River Desi Dairy & Green Farm',
        city: 'Bengaluru',
        state: 'Karnataka',
        address: 'Tumkur Road corridor, Bengaluru Rural',
        lat: 13.0982,
        lng: 77.3986
      },
      isAvailable: true,
      isOrganic: true,
      harvestDate: 'Harvested today at 5:30 AM',
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 86400000).toISOString()
    },
    {
      id: 'prd_016',
      name: 'Tender Baby Bok Choy',
      description: 'Crisp white succulent stems and tender dark green leaves. Grown with organic compost, ideal for Asian stir-fries and clear soups.',
      category: 'Vegetables',
      price: 50,
      unit: 'bunch',
      quantity: 45,
      images: [
        'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=800&auto=format&fit=crop&q=80'
      ],
      farmerId: 'usr_farmer_004',
      farmerName: 'Anand Devadiga',
      location: {
        farmName: 'Cauvery River Desi Dairy & Green Farm',
        city: 'Bengaluru',
        state: 'Karnataka',
        address: 'Tumkur Road corridor, Bengaluru Rural',
        lat: 13.0982,
        lng: 77.3986
      },
      isAvailable: true,
      isOrganic: true,
      harvestDate: 'Fresh morning harvest',
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 86400000).toISOString()
    },
    {
      id: 'prd_017',
      name: 'Vibrant Rainbow Swiss Chard',
      description: 'Colorful ruby-red and canary-yellow stemmed Swiss chard. Earthy, tender greens full of iron, magnesium, and dietary fiber.',
      category: 'Vegetables',
      price: 55,
      unit: 'bunch',
      quantity: 35,
      images: [
        'https://images.unsplash.com/photo-1598030304671-5aa1d6f21128?w=800&auto=format&fit=crop&q=80'
      ],
      farmerId: 'usr_farmer_004',
      farmerName: 'Anand Devadiga',
      location: {
        farmName: 'Cauvery River Desi Dairy & Green Farm',
        city: 'Bengaluru',
        state: 'Karnataka',
        address: 'Tumkur Road corridor, Bengaluru Rural',
        lat: 13.0982,
        lng: 77.3986
      },
      isAvailable: true,
      isOrganic: true,
      harvestDate: 'Harvested yesterday',
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 86400000).toISOString()
    },
    {
      id: 'prd_018',
      name: 'Organic Collard Greens',
      description: 'Hearty broad leaves with robust earthy taste, slowly grown in temperate Punjab soils. Wonderful for slow braising and wraps.',
      category: 'Vegetables',
      price: 45,
      unit: 'bunch',
      quantity: 55,
      images: [
        'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800&auto=format&fit=crop&q=80'
      ],
      farmerId: 'usr_farmer_003',
      farmerName: 'Harpreet Singh',
      location: {
        farmName: 'Golden Fields Organic Grains',
        city: 'Ludhiana',
        state: 'Punjab',
        address: 'GT Road agri corridor, Ludhiana',
        lat: 30.9010,
        lng: 75.8573
      },
      isAvailable: true,
      isOrganic: true,
      harvestDate: 'Harvested 2 days ago',
      createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 4 * 86400000).toISOString()
    },
    {
      id: 'prd_019',
      name: 'Aromatic Desi Coriander (Dhania Leaves)',
      description: 'Pungent, highly aromatic country variety coriander with roots intact. Grown using traditional well irrigation.',
      category: 'Vegetables',
      price: 15,
      unit: 'bunch',
      quantity: 120,
      images: [
        'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=800&auto=format&fit=crop&q=80'
      ],
      farmerId: 'usr_farmer_001',
      farmerName: 'Ramesh Patil',
      location: {
        farmName: 'Shivshambhu Agro Orchards',
        city: 'Pune',
        state: 'Maharashtra',
        address: 'Wagholi-Saswad Road, Pune Rural',
        lat: 18.5204,
        lng: 73.8567
      },
      isAvailable: true,
      isOrganic: true,
      harvestDate: 'Harvested today at dawn',
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 86400000).toISOString()
    },

    // --- ROOT & TUBER VEGETABLES ---
    {
      id: 'prd_003',
      name: 'Farm Golden Potatoes (Aloo)',
      description: 'Thin-skinned, tender golden potatoes ideal for curries, baking, and roasting. Sourced straight from loamy soil.',
      category: 'Vegetables',
      price: 28,
      unit: 'kg',
      quantity: 180,
      images: [
        'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop&q=80'
      ],
      farmerId: 'usr_farmer_001',
      farmerName: 'Ramesh Patil',
      location: {
        farmName: 'Shivshambhu Agro Orchards',
        city: 'Pune',
        state: 'Maharashtra',
        address: 'Wagholi-Saswad Road, Pune Rural',
        lat: 18.5204,
        lng: 73.8567
      },
      isAvailable: true,
      isOrganic: false,
      harvestDate: 'Harvested this week',
      createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 8 * 86400000).toISOString()
    },
    {
      id: 'prd_020',
      name: 'Sweet Red Country Carrots (Gajar)',
      description: 'Juicy, deep red seasonal Delhi carrots pulled fresh from loose sandy soil. Naturally sweet, perfect for halwa and salads.',
      category: 'Vegetables',
      price: 42,
      unit: 'kg',
      quantity: 150,
      images: [
        'https://images.unsplash.com/photo-1447175008436-054170c2e979?w=800&auto=format&fit=crop&q=80'
      ],
      farmerId: 'usr_farmer_003',
      farmerName: 'Harpreet Singh',
      location: {
        farmName: 'Golden Fields Organic Grains',
        city: 'Ludhiana',
        state: 'Punjab',
        address: 'GT Road agri corridor, Ludhiana',
        lat: 30.9010,
        lng: 75.8573
      },
      isAvailable: true,
      isOrganic: true,
      harvestDate: 'Freshly dug 2 days ago',
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 86400000).toISOString()
    },
    {
      id: 'prd_021',
      name: 'Organic Ruby Beetroot (Chukandar)',
      description: 'Firm, deep purple-red roots harvested with fresh green leaves. Rich in dietary nitrates, natural sweetness, and antioxidants.',
      category: 'Vegetables',
      price: 38,
      unit: 'kg',
      quantity: 95,
      images: [
        'https://images.unsplash.com/photo-1593105544559-ecb03bf76f82?w=800&auto=format&fit=crop&q=80'
      ],
      farmerId: 'usr_farmer_001',
      farmerName: 'Ramesh Patil',
      location: {
        farmName: 'Shivshambhu Agro Orchards',
        city: 'Pune',
        state: 'Maharashtra',
        address: 'Wagholi-Saswad Road, Pune Rural',
        lat: 18.5204,
        lng: 73.8567
      },
      isAvailable: true,
      isOrganic: true,
      harvestDate: 'Harvested 3 days ago',
      createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 4 * 86400000).toISOString()
    },
    {
      id: 'prd_022',
      name: 'Crisp White Radish (Mooli)',
      description: 'Tender white winter radish with a mild peppery crunch and edible green tops. Excellent for stuffed mooli parathas and salads.',
      category: 'Vegetables',
      price: 28,
      unit: 'kg',
      quantity: 110,
      images: [
        'https://images.unsplash.com/photo-1590165482129-1b8b27698780?w=800&auto=format&fit=crop&q=80'
      ],
      farmerId: 'usr_farmer_003',
      farmerName: 'Harpreet Singh',
      location: {
        farmName: 'Golden Fields Organic Grains',
        city: 'Ludhiana',
        state: 'Punjab',
        address: 'GT Road agri corridor, Ludhiana',
        lat: 30.9010,
        lng: 75.8573
      },
      isAvailable: true,
      isOrganic: true,
      harvestDate: 'Harvested yesterday',
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 86400000).toISOString()
    },
    {
      id: 'prd_023',
      name: 'Purple Top Turnip (Shalgam)',
      description: 'Sweet, crisp root turnips grown in winter soil. Tender white flesh that cooks quickly in spicy village curries and pickles.',
      category: 'Vegetables',
      price: 35,
      unit: 'kg',
      quantity: 65,
      images: [
        'https://images.unsplash.com/photo-1579113800032-c38bd7635818?w=800&auto=format&fit=crop&q=80'
      ],
      farmerId: 'usr_farmer_003',
      farmerName: 'Harpreet Singh',
      location: {
        farmName: 'Golden Fields Organic Grains',
        city: 'Ludhiana',
        state: 'Punjab',
        address: 'GT Road agri corridor, Ludhiana',
        lat: 30.9010,
        lng: 75.8573
      },
      isAvailable: true,
      isOrganic: true,
      harvestDate: 'Harvested 3 days ago',
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 86400000).toISOString()
    },
    {
      id: 'prd_024',
      name: 'Golden Honey Sweet Potato (Shakarkandi)',
      description: 'Copper-skinned sweet roots with creamy orange interior. High beta-carotene and natural low-glycemic sweetness.',
      category: 'Vegetables',
      price: 48,
      unit: 'kg',
      quantity: 130,
      images: [
        'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80'
      ],
      farmerId: 'usr_farmer_001',
      farmerName: 'Ramesh Patil',
      location: {
        farmName: 'Shivshambhu Agro Orchards',
        city: 'Pune',
        state: 'Maharashtra',
        address: 'Wagholi-Saswad Road, Pune Rural',
        lat: 18.5204,
        lng: 73.8567
      },
      isAvailable: true,
      isOrganic: true,
      harvestDate: 'Freshly cured 4 days ago',
      createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 6 * 86400000).toISOString()
    },
    {
      id: 'prd_025',
      name: 'Organic Taro Root (Arbi / Colocasia)',
      description: 'Well-cured starchy Arbi roots from wetland agro beds. Great for crispy dry roasts and spicy mustard gravies.',
      category: 'Vegetables',
      price: 55,
      unit: 'kg',
      quantity: 80,
      images: [
        'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80'
      ],
      farmerId: 'usr_farmer_002',
      farmerName: 'Sunita Gaikwad',
      location: {
        farmName: 'Gaikwad Sahyadri Fresh',
        city: 'Nashik',
        state: 'Maharashtra',
        address: 'Niphad Highway, Nashik Agri Belt',
        lat: 19.9975,
        lng: 73.7898
      },
      isAvailable: true,
      isOrganic: true,
      harvestDate: 'Harvested 5 days ago',
      createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 7 * 86400000).toISOString()
    },
    {
      id: 'prd_026',
      name: 'Fresh Mountain Ginger (Adrak)',
      description: 'Strongly pungent, juicy ginger rhizomes harvested from Sahyadri slopes. Intensely aromatic with thin golden skin.',
      category: 'Vegetables',
      price: 95,
      unit: 'kg',
      quantity: 75,
      images: [
        'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80'
      ],
      farmerId: 'usr_farmer_001',
      farmerName: 'Ramesh Patil',
      location: {
        farmName: 'Shivshambhu Agro Orchards',
        city: 'Pune',
        state: 'Maharashtra',
        address: 'Wagholi-Saswad Road, Pune Rural',
        lat: 18.5204,
        lng: 73.8567
      },
      isAvailable: true,
      isOrganic: true,
      harvestDate: 'Fresh harvest this week',
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 86400000).toISOString()
    },
    {
      id: 'prd_027',
      name: 'Sun-Cured White Garlic (Lahsun)',
      description: 'Pungent heirloom white garlic bulbs naturally cured in village sunlight. Long shelf life and intense allicin aroma.',
      category: 'Vegetables',
      price: 120,
      unit: 'kg',
      quantity: 110,
      images: [
        'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=800&auto=format&fit=crop&q=80'
      ],
      farmerId: 'usr_farmer_002',
      farmerName: 'Sunita Gaikwad',
      location: {
        farmName: 'Gaikwad Sahyadri Fresh',
        city: 'Nashik',
        state: 'Maharashtra',
        address: 'Niphad Highway, Nashik Agri Belt',
        lat: 19.9975,
        lng: 73.7898
      },
      isAvailable: true,
      isOrganic: true,
      harvestDate: 'Sun-cured traditional batch',
      createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 10 * 86400000).toISOString()
    },
    {
      id: 'prd_002',
      name: 'Nashik Premium Red Onions (Pyaaz)',
      description: 'Hand-sorted, sun-dried aromatic Nashik onions with exceptional keeping quality and pungent sweetness.',
      category: 'Vegetables',
      price: 35,
      unit: 'kg',
      quantity: 250,
      images: [
        'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80'
      ],
      farmerId: 'usr_farmer_002',
      farmerName: 'Sunita Gaikwad',
      location: {
        farmName: 'Gaikwad Sahyadri Fresh',
        city: 'Nashik',
        state: 'Maharashtra',
        address: 'Niphad Highway, Nashik Agri Belt',
        lat: 19.9975,
        lng: 73.7898
      },
      isAvailable: true,
      isOrganic: true,
      harvestDate: 'Harvested 3 days ago',
      createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 12 * 86400000).toISOString()
    },

    // --- GOURD & SQUASH VEGETABLES ---
    {
      id: 'prd_028',
      name: 'Tender Bottle Gourd (Lauki / Dudhi)',
      description: 'Slender, pale-green tender bottle gourd freshly harvested from trellised vines. Cool, hydrating, and easy to digest.',
      category: 'Vegetables',
      price: 32,
      unit: 'piece',
      quantity: 70,
      images: [
        'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=800&auto=format&fit=crop&q=80'
      ],
      farmerId: 'usr_farmer_001',
      farmerName: 'Ramesh Patil',
      location: {
        farmName: 'Shivshambhu Agro Orchards',
        city: 'Pune',
        state: 'Maharashtra',
        address: 'Wagholi-Saswad Road, Pune Rural',
        lat: 18.5204,
        lng: 73.8567
      },
      isAvailable: true,
      isOrganic: true,
      harvestDate: 'Picked this morning',
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 86400000).toISOString()
    },
    {
      id: 'prd_029',
      name: 'Organic Bitter Gourd (Karela)',
      description: 'Tender ridged dark green karela known for natural blood-purifying properties. Low bitterness when cooked with spices.',
      category: 'Vegetables',
      price: 46,
      unit: 'kg',
      quantity: 60,
      images: [
        'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=800&auto=format&fit=crop&q=80'
      ],
      farmerId: 'usr_farmer_001',
      farmerName: 'Ramesh Patil',
      location: {
        farmName: 'Shivshambhu Agro Orchards',
        city: 'Pune',
        state: 'Maharashtra',
        address: 'Wagholi-Saswad Road, Pune Rural',
        lat: 18.5204,
        lng: 73.8567
      },
      isAvailable: true,
      isOrganic: true,
      harvestDate: 'Harvested 2 days ago',
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 86400000).toISOString()
    },
    {
      id: 'prd_030',
      name: 'Farm Fresh Ridge Gourd (Torai)',
      description: 'Tender, narrow ridged gourd picked early before seeds mature. Mild sweetness and quick cooking for light summer curries.',
      category: 'Vegetables',
      price: 42,
      unit: 'kg',
      quantity: 65,
      images: [
        'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=800&auto=format&fit=crop&q=80'
      ],
      farmerId: 'usr_farmer_002',
      farmerName: 'Sunita Gaikwad',
      location: {
        farmName: 'Gaikwad Sahyadri Fresh',
        city: 'Nashik',
        state: 'Maharashtra',
        address: 'Niphad Highway, Nashik Agri Belt',
        lat: 19.9975,
        lng: 73.7898
      },
      isAvailable: true,
      isOrganic: true,
      harvestDate: 'Vine-picked yesterday',
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 86400000).toISOString()
    },
    {
      id: 'prd_031',
      name: 'Sweet Golden Pumpkin (Kaddu)',
      description: 'Field-ripened orange pumpkin with dense, sweet flesh and nutrient-rich edible seeds. Rich in vitamin A and dietary fiber.',
      category: 'Vegetables',
      price: 30,
      unit: 'kg',
      quantity: 140,
      images: [
        'https://images.unsplash.com/photo-1570586437504-bbea49479e0a?w=800&auto=format&fit=crop&q=80'
      ],
      farmerId: 'usr_farmer_001',
      farmerName: 'Ramesh Patil',
      location: {
        farmName: 'Shivshambhu Agro Orchards',
        city: 'Pune',
        state: 'Maharashtra',
        address: 'Wagholi-Saswad Road, Pune Rural',
        lat: 18.5204,
        lng: 73.8567
      },
      isAvailable: true,
      isOrganic: true,
      harvestDate: 'Harvested 4 days ago',
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 86400000).toISOString()
    },
    {
      id: 'prd_032',
      name: 'Crisp Desi Cucumber (Kheera)',
      description: 'Non-waxed, juicy country cucumbers with crisp refreshing bite and thin edible skin. Sourced directly from shaded vines.',
      category: 'Vegetables',
      price: 32,
      unit: 'kg',
      quantity: 120,
      images: [
        'https://images.unsplash.com/photo-1449339854873-750e6913301b?w=800&auto=format&fit=crop&q=80'
      ],
      farmerId: 'usr_farmer_002',
      farmerName: 'Sunita Gaikwad',
      location: {
        farmName: 'Gaikwad Sahyadri Fresh',
        city: 'Nashik',
        state: 'Maharashtra',
        address: 'Niphad Highway, Nashik Agri Belt',
        lat: 19.9975,
        lng: 73.7898
      },
      isAvailable: true,
      isOrganic: true,
      harvestDate: 'Morning harvest yesterday',
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 86400000).toISOString()
    },
    {
      id: 'prd_033',
      name: 'Fresh Green Zucchini / Courgette',
      description: 'Plump, glossy dark green courgettes picked at medium size for maximum tenderness. Ideal for grilling, bakes, and pastas.',
      category: 'Vegetables',
      price: 65,
      unit: 'kg',
      quantity: 50,
      images: [
        'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=800&auto=format&fit=crop&q=80'
      ],
      farmerId: 'usr_farmer_004',
      farmerName: 'Anand Devadiga',
      location: {
        farmName: 'Cauvery River Desi Dairy & Green Farm',
        city: 'Bengaluru',
        state: 'Karnataka',
        address: 'Tumkur Road corridor, Bengaluru Rural',
        lat: 13.0982,
        lng: 77.3986
      },
      isAvailable: true,
      isOrganic: true,
      harvestDate: 'Harvested yesterday',
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 86400000).toISOString()
    },
    {
      id: 'prd_034',
      name: 'Sweet Nutty Butternut Squash',
      description: 'Bell-shaped winter squash with smooth tan skin and rich buttery orange flesh. Perfect for velvety soups and oven roasting.',
      category: 'Vegetables',
      price: 55,
      unit: 'kg',
      quantity: 60,
      images: [
        'https://images.unsplash.com/photo-1508747703725-719777637510?w=800&auto=format&fit=crop&q=80'
      ],
      farmerId: 'usr_farmer_004',
      farmerName: 'Anand Devadiga',
      location: {
        farmName: 'Cauvery River Desi Dairy & Green Farm',
        city: 'Bengaluru',
        state: 'Karnataka',
        address: 'Tumkur Road corridor, Bengaluru Rural',
        lat: 13.0982,
        lng: 77.3986
      },
      isAvailable: true,
      isOrganic: true,
      harvestDate: 'Harvested 4 days ago',
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 86400000).toISOString()
    },

    // --- OTHER STAPLES (Tomatoes, Fruits, Grains, Pulses, Dairy, Honey) ---
    {
      id: 'prd_001',
      name: 'Farm Fresh Red Vine Tomatoes',
      description: 'Naturally vine-ripened juicy tomatoes grown using organic vermicompost. High in lycopene with zero chemical spray.',
      category: 'Vegetables',
      price: 30,
      unit: 'kg',
      quantity: 120,
      images: [
        'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1546470427-e26264be0b11?w=800&auto=format&fit=crop&q=80'
      ],
      farmerId: 'usr_farmer_001',
      farmerName: 'Ramesh Patil',
      location: {
        farmName: 'Shivshambhu Agro Orchards',
        city: 'Pune',
        state: 'Maharashtra',
        address: 'Wagholi-Saswad Road, Pune Rural',
        lat: 18.5204,
        lng: 73.8567
      },
      isAvailable: true,
      isOrganic: true,
      harvestDate: 'Fresh harvest yesterday',
      createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 10 * 86400000).toISOString()
    },
    {
      id: 'prd_005',
      name: 'Fresh Elaichi Bananas (Yellaki)',
      description: 'Naturally ripened aromatic petite bananas with thin golden skin and honey-sweet fragrance. Never carbide treated.',
      category: 'Fruits',
      price: 50,
      unit: 'dozen',
      quantity: 60,
      images: [
        'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=800&auto=format&fit=crop&q=80'
      ],
      farmerId: 'usr_farmer_004',
      farmerName: 'Anand Devadiga',
      location: {
        farmName: 'Cauvery River Desi Dairy & Green Farm',
        city: 'Bengaluru',
        state: 'Karnataka',
        address: 'Tumkur Road corridor, Bengaluru Rural',
        lat: 13.0982,
        lng: 77.3986
      },
      isAvailable: true,
      isOrganic: true,
      harvestDate: 'Tree-ripened 2 days ago',
      createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 4 * 86400000).toISOString()
    },
    {
      id: 'prd_006',
      name: 'Aged 1121 Traditional Basmati Rice',
      description: 'Extra long grain Royal Basmati aged for 24 months in wooden granaries. Slender grains elongate up to 2.5 times when cooked.',
      category: 'Grains',
      price: 65,
      unit: 'kg',
      quantity: 400,
      images: [
        'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80'
      ],
      farmerId: 'usr_farmer_003',
      farmerName: 'Harpreet Singh',
      location: {
        farmName: 'Golden Fields Organic Grains',
        city: 'Ludhiana',
        state: 'Punjab',
        address: 'GT Road agri corridor, Ludhiana',
        lat: 30.9010,
        lng: 75.8573
      },
      isAvailable: true,
      isOrganic: true,
      harvestDate: 'Season Reserve Crop',
      createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 14 * 86400000).toISOString()
    },
    {
      id: 'prd_007',
      name: 'Unpolished Desi Moong Dal (Green Gram)',
      description: 'Traditional unpolished whole green moong split using stone chakki. High plant protein without any synthetic oil polish.',
      category: 'Pulses',
      price: 110,
      unit: 'kg',
      quantity: 90,
      images: [
        'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=800&auto=format&fit=crop&q=80'
      ],
      farmerId: 'usr_farmer_002',
      farmerName: 'Sunita Gaikwad',
      location: {
        farmName: 'Gaikwad Sahyadri Fresh',
        city: 'Nashik',
        state: 'Maharashtra',
        address: 'Niphad Highway, Nashik Agri Belt',
        lat: 19.9975,
        lng: 73.7898
      },
      isAvailable: true,
      isOrganic: true,
      harvestDate: 'Current season batch',
      createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 6 * 86400000).toISOString()
    },
    {
      id: 'prd_008',
      name: 'Pure Desi Gir Cow A2 Milk',
      description: 'Raw, unadulterated whole A2 milk from free-grazing indigenous Gir cows. Bottled immediately into food-grade glass containers.',
      category: 'Dairy',
      price: 85,
      unit: 'litre',
      quantity: 35,
      images: [
        'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&auto=format&fit=crop&q=80'
      ],
      farmerId: 'usr_farmer_004',
      farmerName: 'Anand Devadiga',
      location: {
        farmName: 'Cauvery River Desi Dairy & Green Farm',
        city: 'Bengaluru',
        state: 'Karnataka',
        address: 'Tumkur Road corridor, Bengaluru Rural',
        lat: 13.0982,
        lng: 77.3986
      },
      isAvailable: true,
      isOrganic: true,
      harvestDate: 'Milked early morning today',
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 86400000).toISOString()
    },
    {
      id: 'prd_009',
      name: 'Organic Raw Forest Honey',
      description: 'Unfiltered, unpasteurized natural honey collected from wild flowering flora in Sahyadri foothills. Rich in natural bee pollen.',
      category: 'Organic Produce',
      price: 320,
      unit: 'piece',
      quantity: 8,
      images: [
        'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=800&auto=format&fit=crop&q=80'
      ],
      farmerId: 'usr_farmer_001',
      farmerName: 'Ramesh Patil',
      location: {
        farmName: 'Shivshambhu Agro Orchards',
        city: 'Pune',
        state: 'Maharashtra',
        address: 'Wagholi-Saswad Road, Pune Rural',
        lat: 18.5204,
        lng: 73.8567
      },
      isAvailable: true,
      isOrganic: true,
      harvestDate: 'Wild collected 10 days ago',
      createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 15 * 86400000).toISOString()
    },
    {
      id: 'prd_010',
      name: 'Nashik Bhagwa Ruby Pomegranate',
      description: 'Deep red, soft-seeded Bhagwa pomegranates bursting with sweet juice and high antioxidant levels.',
      category: 'Fruits',
      price: 130,
      unit: 'kg',
      quantity: 85,
      images: [
        'https://images.unsplash.com/photo-1541344999736-83eca872f241?w=800&auto=format&fit=crop&q=80'
      ],
      farmerId: 'usr_farmer_002',
      farmerName: 'Sunita Gaikwad',
      location: {
        farmName: 'Gaikwad Sahyadri Fresh',
        city: 'Nashik',
        state: 'Maharashtra',
        address: 'Niphad Highway, Nashik Agri Belt',
        lat: 19.9975,
        lng: 73.7898
      },
      isAvailable: true,
      isOrganic: true,
      harvestDate: 'Orchard picked 2 days ago',
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 86400000).toISOString()
    },
    ...ALL_FRUITS,
    ...ALL_GRAINS,
    ...ALL_PULSES
  ];

  const orders: SeedOrder[] = [
    {
      id: 'ord_101',
      orderNumber: 'FC-ORD-8921',
      customerId: 'usr_customer_001',
      customerName: 'Priya Sharma',
      customerEmail: 'customer@farmconnect.org',
      customerPhone: '+91 98765 43210',
      items: [
        {
          id: 'item_1',
          productId: 'prd_001',
          productName: 'Farm Fresh Red Vine Tomatoes',
          image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80',
          price: 30,
          unit: 'kg',
          quantity: 3,
          farmerId: 'usr_farmer_001',
          farmerName: 'Ramesh Patil',
          farmCity: 'Pune',
          itemTotal: 90,
          fulfillmentStatus: 'Delivered'
        },
        {
          id: 'item_2',
          productId: 'prd_002',
          productName: 'Nashik Premium Red Onions',
          image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800&auto=format&fit=crop&q=80',
          price: 35,
          unit: 'kg',
          quantity: 4,
          farmerId: 'usr_farmer_002',
          farmerName: 'Sunita Gaikwad',
          farmCity: 'Nashik',
          itemTotal: 140,
          fulfillmentStatus: 'Delivered'
        }
      ],
      deliveryAddress: {
        fullName: 'Priya Sharma',
        phone: '+91 98765 43210',
        street: 'Flat 402, Green Meadows, Kothrud',
        city: 'Pune',
        state: 'Maharashtra',
        postalCode: '411038',
        notes: 'Please ring bell twice.'
      },
      subtotal: 230,
      deliveryFee: 40,
      totalAmount: 270,
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Completed',
      orderStatus: 'Delivered',
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 4 * 86400000).toISOString()
    },
    {
      id: 'ord_102',
      orderNumber: 'FC-ORD-8922',
      customerId: 'usr_customer_001',
      customerName: 'Priya Sharma',
      customerEmail: 'customer@farmconnect.org',
      customerPhone: '+91 98765 43210',
      items: [
        {
          id: 'item_3',
          productId: 'prd_006',
          productName: 'Aged 1121 Traditional Basmati Rice',
          image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
          price: 65,
          unit: 'kg',
          quantity: 5,
          farmerId: 'usr_farmer_003',
          farmerName: 'Harpreet Singh',
          farmCity: 'Ludhiana',
          itemTotal: 325,
          fulfillmentStatus: 'Shipped'
        },
        {
          id: 'item_4',
          productId: 'prd_004',
          productName: 'Organic Palak (Spinach Bunch)',
          image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&auto=format&fit=crop&q=80',
          price: 20,
          unit: 'bunch',
          quantity: 2,
          farmerId: 'usr_farmer_001',
          farmerName: 'Ramesh Patil',
          farmCity: 'Pune',
          itemTotal: 40,
          fulfillmentStatus: 'Packed'
        }
      ],
      deliveryAddress: {
        fullName: 'Priya Sharma',
        phone: '+91 98765 43210',
        street: 'Flat 402, Green Meadows, Kothrud',
        city: 'Pune',
        state: 'Maharashtra',
        postalCode: '411038'
      },
      subtotal: 365,
      deliveryFee: 40,
      totalAmount: 405,
      paymentMethod: 'UPI / NetBanking (Test Mode)',
      paymentStatus: 'Completed',
      orderStatus: 'Shipped',
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 12 * 3600000).toISOString()
    }
  ];

  return { users, products, orders };
}

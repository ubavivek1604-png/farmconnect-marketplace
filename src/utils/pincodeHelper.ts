import { Product } from '../types/index.ts';

export interface PincodeInfo {
  pincode: string;
  city: string;
  area: string;
  state: string;
  lat: number;
  lng: number;
}

export const POPULAR_PINCODES: PincodeInfo[] = [
  { pincode: '411038', city: 'Pune', area: 'Kothrud', state: 'Maharashtra', lat: 18.5074, lng: 73.8077 },
  { pincode: '411014', city: 'Pune', area: 'Wagholi / Pune Rural', state: 'Maharashtra', lat: 18.5804, lng: 73.9800 },
  { pincode: '411045', city: 'Pune', area: 'Baner', state: 'Maharashtra', lat: 18.5590, lng: 73.7868 },
  { pincode: '422303', city: 'Nashik', area: 'Niphad Agri Belt', state: 'Maharashtra', lat: 20.0800, lng: 74.1100 },
  { pincode: '422003', city: 'Nashik', area: 'Panchavati', state: 'Maharashtra', lat: 20.0150, lng: 73.8000 },
  { pincode: '141001', city: 'Ludhiana', area: 'Samrala / GT Road', state: 'Punjab', lat: 30.9010, lng: 75.8573 },
  { pincode: '560064', city: 'Bengaluru', area: 'Yelahanka / Bengaluru Rural', state: 'Karnataka', lat: 13.1007, lng: 77.5963 },
  { pincode: '560001', city: 'Bengaluru', area: 'MG Road / Central', state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
  { pincode: '400001', city: 'Mumbai', area: 'Fort / South Mumbai', state: 'Maharashtra', lat: 18.9322, lng: 72.8354 },
  { pincode: '110001', city: 'Delhi', area: 'Connaught Place', state: 'Delhi NCR', lat: 28.6304, lng: 77.2177 },
  { pincode: '500001', city: 'Hyderabad', area: 'Abids / Central', state: 'Telangana', lat: 17.3850, lng: 78.4867 },
  { pincode: '600001', city: 'Chennai', area: 'George Town', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 }
];

const KNOWN_MAP: Record<string, PincodeInfo> = {};
POPULAR_PINCODES.forEach(p => {
  KNOWN_MAP[p.pincode] = p;
});

// Calculate distance in kilometers using the Haversine formula
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Derives geographic region from 6-digit Indian PIN code
export function getRegionFromPincode(pin: string): {
  city: string;
  state: string;
  area: string;
  isValid: boolean;
  lat: number;
  lng: number;
} {
  const cleanPin = (pin || '').trim().replace(/\D/g, '');
  if (cleanPin.length !== 6) {
    return {
      city: 'Unknown Area',
      state: 'India',
      area: 'Invalid PIN',
      isValid: false,
      lat: 18.5204,
      lng: 73.8567
    };
  }

  if (KNOWN_MAP[cleanPin]) {
    const k = KNOWN_MAP[cleanPin];
    return {
      city: k.city,
      state: k.state,
      area: k.area,
      isValid: true,
      lat: k.lat,
      lng: k.lng
    };
  }

  // Derive region from Indian Postal Zone prefix (first 2 digits)
  const prefix2 = cleanPin.substring(0, 2);
  const prefix3 = cleanPin.substring(0, 3);

  let state = 'India';
  let city = `Zone ${prefix2}`;
  let lat = 18.5204;
  let lng = 73.8567;

  if (prefix2 === '11') {
    state = 'Delhi NCR';
    city = 'Delhi';
    lat = 28.6139;
    lng = 77.2090;
  } else if (prefix2 === '12' || prefix2 === '13') {
    state = 'Haryana';
    city = 'Gurugram / Ambala';
    lat = 28.4595;
    lng = 77.0266;
  } else if (prefix2 === '14' || prefix2 === '15') {
    state = 'Punjab';
    city = 'Ludhiana / Amritsar';
    lat = 30.9010;
    lng = 75.8573;
  } else if (prefix2 === '18' || prefix2 === '19') {
    state = 'Jammu & Kashmir';
    city = 'Srinagar / Jammu';
    lat = 34.0837;
    lng = 74.7973;
  } else if (prefix2 === '20' || prefix2 === '28') {
    state = 'Uttar Pradesh';
    city = 'Noida / Lucknow';
    lat = 26.8467;
    lng = 80.9462;
  } else if (prefix2 === '30' || prefix2 === '34') {
    state = 'Rajasthan';
    city = 'Jaipur / Jodhpur';
    lat = 26.9124;
    lng = 75.7873;
  } else if (prefix2 === '36' || prefix2 === '39') {
    state = 'Gujarat';
    city = 'Ahmedabad / Surat';
    lat = 23.0225;
    lng = 72.5714;
  } else if (prefix3 === '411') {
    state = 'Maharashtra';
    city = 'Pune';
    lat = 18.5204;
    lng = 73.8567;
  } else if (prefix3 === '422') {
    state = 'Maharashtra';
    city = 'Nashik';
    lat = 19.9975;
    lng = 73.7898;
  } else if (prefix3 === '400') {
    state = 'Maharashtra';
    city = 'Mumbai';
    lat = 18.9322;
    lng = 72.8354;
  } else if (prefix2 >= '40' && prefix2 <= '44') {
    state = 'Maharashtra';
    city = 'Maharashtra Region';
    lat = 19.7515;
    lng = 75.7139;
  } else if (prefix2 >= '56' && prefix2 <= '59') {
    state = 'Karnataka';
    city = 'Bengaluru / Mysuru';
    lat = 12.9716;
    lng = 77.5946;
  } else if (prefix2 === '50' || prefix2 === '53') {
    state = 'Telangana / Andhra Pradesh';
    city = 'Hyderabad / Vizag';
    lat = 17.3850;
    lng = 78.4867;
  } else if (prefix2 >= '60' && prefix2 <= '64') {
    state = 'Tamil Nadu';
    city = 'Chennai / Coimbatore';
    lat = 13.0827;
    lng = 80.2707;
  } else if (prefix2 >= '67' && prefix2 <= '69') {
    state = 'Kerala';
    city = 'Kochi / Trivandrum';
    lat = 9.9312;
    lng = 76.2673;
  } else if (prefix2 >= '70' && prefix2 <= '74') {
    state = 'West Bengal';
    city = 'Kolkata';
    lat = 22.5726;
    lng = 88.3639;
  }

  return {
    city,
    state,
    area: `PIN ${cleanPin} Sector`,
    isValid: true,
    lat,
    lng
  };
}

export interface DeliverabilityResult {
  isDeliverable: boolean;
  deliveryType: 'hyperlocal' | 'regional' | 'national' | 'perishable_restricted';
  badge: string;
  badgeColor: 'emerald' | 'amber' | 'rose' | 'blue';
  estimatedHours: string;
  distanceKm: number;
  deliveryFee: number;
  farmPincode: string;
  farmCity: string;
  explanation: string;
  isSameDay: boolean;
}

// Fallback farm pin codes by city name
const DEFAULT_FARM_PINS: Record<string, string> = {
  pune: '411014',
  nashik: '422303',
  ludhiana: '141001',
  punjab: '141001',
  bengaluru: '560064',
  mumbai: '400001'
};

/**
 * Computes agricultural deliverability based on customer PIN code and produce shelf-life
 */
export function checkProductDeliverability(
  product: Product,
  customerPinInput?: string
): DeliverabilityResult {
  const customerPin = (customerPinInput || getUserPincode()).trim().replace(/\D/g, '');
  const customerRegion = getRegionFromPincode(customerPin);

  // Determine farm coordinates & farm PIN code
  const farmCityKey = (product.location.city || '').toLowerCase();
  const farmPincode =
    product.location.pincode ||
    DEFAULT_FARM_PINS[farmCityKey] ||
    '411014';
  const farmRegion = getRegionFromPincode(farmPincode);

  const farmLat = product.location.lat || farmRegion.lat || 18.5204;
  const farmLng = product.location.lng || farmRegion.lng || 73.8567;

  const distanceKm = calculateDistanceKm(
    customerRegion.lat,
    customerRegion.lng,
    farmLat,
    farmLng
  );

  const isPerishableRawMilkOrGreens =
    product.name.toLowerCase().includes('milk') ||
    (product.category === 'Vegetables' &&
      (product.name.toLowerCase().includes('palak') ||
        product.name.toLowerCase().includes('spinach') ||
        product.name.toLowerCase().includes('methi') ||
        product.name.toLowerCase().includes('coriander') ||
        product.name.toLowerCase().includes('bok choy')));

  const isShelfStableGrainOrPulse =
    product.category === 'Grains' ||
    product.category === 'Pulses' ||
    product.name.toLowerCase().includes('honey') ||
    product.name.toLowerCase().includes('ghee') ||
    product.name.toLowerCase().includes('dates') ||
    product.name.toLowerCase().includes('garlic');

  // Same sorting district (first 3 digits match, e.g. 411xxx to 411xxx) or distance under 45 km
  const isSameDistrict =
    customerPin.length === 6 &&
    farmPincode.length === 6 &&
    customerPin.substring(0, 3) === farmPincode.substring(0, 3);

  // Same state prefix (first 2 digits match, e.g. 41 / 42) or distance under 220 km
  const isSameState =
    customerPin.length === 6 &&
    farmPincode.length === 6 &&
    customerPin.substring(0, 2) === farmPincode.substring(0, 2);

  // 1. Hyperlocal Delivery (< 45 km or same district)
  if (isSameDistrict || distanceKm <= 45) {
    return {
      isDeliverable: true,
      deliveryType: 'hyperlocal',
      badge: `⚡ Fast 24h Delivery (${distanceKm} km)`,
      badgeColor: 'emerald',
      estimatedHours: '4 – 12 hours (Dawn Harvest)',
      distanceKm,
      deliveryFee: 30,
      farmPincode,
      farmCity: product.location.city || farmRegion.city,
      explanation: `Harvested directly at ${product.farmerName || 'local'} farm in ${product.location.city || 'nearby region'} and delivered within hours to PIN ${customerPin}.`,
      isSameDay: true
    };
  }

  // 2. Perishable restriction for long distance
  if (isPerishableRawMilkOrGreens && distanceKm > 120) {
    return {
      isDeliverable: false,
      deliveryType: 'perishable_restricted',
      badge: `⚠️ Not deliverable to PIN ${customerPin}`,
      badgeColor: 'rose',
      estimatedHours: 'Restricted (> 120 km)',
      distanceKm,
      deliveryFee: 0,
      farmPincode,
      farmCity: product.location.city || farmRegion.city,
      explanation: `Fresh unpasteurized raw milk and tender leafy greens have a 6-hour farm freshness limit. Distance to PIN ${customerPin} is ${distanceKm} km. Please select local farms.`,
      isSameDay: false
    };
  }

  // 3. Regional transit (< 280 km or same state)
  if (isSameState || distanceKm <= 280) {
    return {
      isDeliverable: true,
      deliveryType: 'regional',
      badge: `🚚 Next-Day Farm Transit (${distanceKm} km)`,
      badgeColor: 'blue',
      estimatedHours: '18 – 28 hours (Next Day)',
      distanceKm,
      deliveryFee: 45,
      farmPincode,
      farmCity: product.location.city || farmRegion.city,
      explanation: `Packed in natural wooden crates at farm gate and transported directly via inter-district express to PIN ${customerPin}.`,
      isSameDay: false
    };
  }

  // 4. National direct farm transit (for shelf-stable grains, pulses, hardy root veg, honey)
  if (isShelfStableGrainOrPulse || distanceKm <= 1600) {
    return {
      isDeliverable: true,
      deliveryType: 'national',
      badge: `📦 Direct Farm Express (${distanceKm} km)`,
      badgeColor: 'amber',
      estimatedHours: '2 – 3 business days',
      distanceKm,
      deliveryFee: 60,
      farmPincode,
      farmCity: product.location.city || farmRegion.city,
      explanation: `Heirloom grains, traditional pulses, and sun-cured harvests shipped directly from ${product.location.city || 'origin farm'} to PIN ${customerPin}.`,
      isSameDay: false
    };
  }

  // Catch-all
  return {
    isDeliverable: true,
    deliveryType: 'national',
    badge: `📦 Farm Express (${distanceKm} km)`,
    badgeColor: 'amber',
    estimatedHours: '2 – 4 days',
    distanceKm,
    deliveryFee: 65,
    farmPincode,
    farmCity: product.location.city || farmRegion.city,
    explanation: `Dispatched from ${product.location.city || 'farm origin'} to PIN ${customerPin}.`,
    isSameDay: false
  };
}

// Current customer pincode stored in localStorage
export function getUserPincode(): string {
  if (typeof window === 'undefined') return '411038';
  return localStorage.getItem('farmconnect_customer_pincode') || '411038';
}

export function setUserPincode(pin: string): void {
  if (typeof window === 'undefined') return;
  const clean = (pin || '').trim().replace(/\D/g, '');
  if (clean.length === 6) {
    localStorage.setItem('farmconnect_customer_pincode', clean);
    window.dispatchEvent(new CustomEvent('farmconnect_pincode_changed', { detail: clean }));
  }
}
